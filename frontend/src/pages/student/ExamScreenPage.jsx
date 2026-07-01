import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Save, LogOut, ShieldAlert, Monitor, Lock, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { startExam, saveAnswer, submitExam, logViolation, logEvent } from '../../api/examApi';

const ExamScreenPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Answers state: maps questionId -> answer string/value
  const [answers, setAnswers] = useState({});
  // Working buffer state for the currently displayed question's input
  const [currentAnswer, setCurrentAnswer] = useState('');

  // Visited set: tracks which question indexes the student has looked at
  const [visited, setVisited] = useState(new Set([0]));

  // Timer state (seconds remaining)
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);
  const lastViolationTimes = useRef({});

  // Submit Modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Security Hardening States
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Violations & Audit Logs
  const [violationCount, setViolationCount] = useState(0);
  const [violations, setViolations] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);

  // Termination details
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState('');

  // Overlay & State Violations
  const [activeViolations, setActiveViolations] = useState({
    fullscreen: false,
    tabSwitch: false,
    blur: false,
    devTools: false,
    action: false
  });

  const [overlayTimeLeft, setOverlayTimeLeft] = useState(30);
  const overlayTimerRef = useRef(null);

  // 1. Load exam questions on mount & restore state
  useEffect(() => {
    startExam(id)
      .then((data) => {
        setExamData(data);

        const studentId = localStorage.getItem('userId') || 'S-1042';
        const localKey = `exam_data_${studentId}_${id}`;
        const cachedState = JSON.parse(localStorage.getItem(localKey));

        let initialTimeLeft = data.durationMinutes * 60;

        if (cachedState) {
          if (cachedState.answers) {
            setAnswers(cachedState.answers);
            toast.info("Exam progress loaded from backup.", { autoClose: 2000 });
          }
          if (cachedState.violationCount !== undefined) {
            setViolationCount(cachedState.violationCount);
          }
          if (cachedState.violations) {
            setViolations(cachedState.violations);
          }
          if (cachedState.auditTrail) {
            setAuditTrail(cachedState.auditTrail);
          }
          if (cachedState.terminated) {
            setIsTerminated(true);
            setTerminationReason(cachedState.terminationReason || 'Security violation limit reached.');
            setIsExamSubmitted(true);
            setIsExamStarted(true);
          }

          if (cachedState.startTime) {
            const elapsed = Math.floor((Date.now() - cachedState.startTime) / 1000);
            initialTimeLeft = data.durationMinutes * 60 - elapsed;
            setIsExamStarted(true);
          }
        }

        if (initialTimeLeft <= 0) {
          setTimeLeft(0);
          if (cachedState && !cachedState.terminated) {
            handleAutoSubmit();
          }
        } else {
          setTimeLeft(initialTimeLeft);
        }
      })
      .catch(async (error) => {
        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch (e) {
            console.warn("Could not exit fullscreen on load error", e);
          }
        }
        const msg = error.response?.data?.message || "Failed to start exam. Returning to list.";
        toast.error(msg);
        navigate('/student/tests');
      })
      .finally(() => setIsLoading(false));
  }, [id, navigate]);

  // Cleanup fullscreen on unmount if it is still active
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((e) => {
          console.warn("Could not exit fullscreen on unmount", e);
        });
      }
    };
  }, []);

  // 2. Countdown Timer Effect
  useEffect(() => {
    if (isLoading || !examData || !isExamStarted || isExamSubmitted || timeLeft <= 0) {
      if (timeLeft === 0 && examData && isExamStarted && !isExamSubmitted) {
        handleAutoSubmit();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLoading, examData, isExamStarted, isExamSubmitted, timeLeft]);

  // Sync the currentAnswer working buffer when navigating questions
  useEffect(() => {
    if (examData && examData.questions && examData.questions[currentIdx]) {
      const qId = examData.questions[currentIdx].id;
      setCurrentAnswer(answers[qId] || '');
    }
  }, [currentIdx, examData, answers]);

  // Unified answer change handler that updates local answers state
  const handleAnswerChange = (val) => {
    setCurrentAnswer(val);
    if (examData && examData.questions && examData.questions[currentIdx]) {
      const qId = examData.questions[currentIdx].id;
      setAnswers((prev) => ({
        ...prev,
        [qId]: val,
      }));
    }
  };

  // DevTools detection heuristic: dock or undock detection
  const checkDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      return true;
    }

    const start = performance.now();
    (function() {
      debugger;
    }());
    const end = performance.now();
    if (end - start > 100) {
      return true;
    }

    return false;
  };

  // Record a violation locally and log to the backend
  const recordViolation = (type, details = '') => {
    if (isExamSubmitted || isTerminated) return;

    // Debounce duplicate violations within 3 seconds
    const now = Date.now();
    if (lastViolationTimes.current[type] && (now - lastViolationTimes.current[type] < 3000)) {
      console.log(`Violation ${type} debounced`);
      return;
    }
    lastViolationTimes.current[type] = now;

    const timestamp = new Date().toISOString();
    const studentId = localStorage.getItem('userId') || 'S-1042';
    const testId = id;

    const newViolation = {
      violationType: type,
      timestamp,
      studentId,
      testId,
      details
    };

    const newEvent = {
      studentId,
      testId,
      event: `Violation: ${type} - ${details}`,
      timestamp
    };

    const localKey = `exam_data_${studentId}_${id}`;
    const examState = JSON.parse(localStorage.getItem(localKey)) || {
      violationCount: 0,
      violations: [],
      auditTrail: [],
      answers: {}
    };

    examState.violations.push(newViolation);
    examState.auditTrail.push(newEvent);
    examState.violationCount += 1;
    localStorage.setItem(localKey, JSON.stringify(examState));

    setViolationCount(examState.violationCount);
    setViolations(examState.violations);
    setAuditTrail(examState.auditTrail);

    logViolation(newViolation);
    logEvent(newEvent);

    toast.error(`Security Warning: ${type.replace('_', ' ')} recorded!`, { autoClose: 3000 });

    if (examState.violationCount >= 3) {
      handleImmediateTermination(`Exceeded maximum violation limit of 3. (Last violation: ${type})`);
    }
  };

  // Handle immediate termination due to warnings or timeout
  const handleImmediateTermination = async (reason) => {
    if (isSubmitting || isExamSubmitted) return;
    setIsSubmitting(true);
    setIsExamSubmitted(true);
    setIsTerminated(true);
    setTerminationReason(reason);

    if (timerRef.current) clearInterval(timerRef.current);
    if (overlayTimerRef.current) clearInterval(overlayTimerRef.current);

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (e) {
        console.warn("Could not exit fullscreen", e);
      }
    }

    const studentId = localStorage.getItem('userId') || 'S-1042';
    const termEvent = {
      studentId,
      testId: id,
      event: `Exam Terminated: ${reason}`,
      timestamp: new Date().toISOString()
    };

    const localKey = `exam_data_${studentId}_${id}`;
    const examState = JSON.parse(localStorage.getItem(localKey)) || {
      violationCount: 0,
      violations: [],
      auditTrail: [],
      answers: {}
    };
    examState.auditTrail.push(termEvent);
    examState.terminated = true;
    examState.terminationReason = reason;
    localStorage.setItem(localKey, JSON.stringify(examState));

    await logEvent(termEvent);
    try {
      await submitExam(examData.testId, answers);
    } catch (error) {
      console.error("Failed to submit exam on termination", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start / Resume fullscreen exam
  const handleStartExam = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setIsExamStarted(true);

      const studentId = localStorage.getItem('userId') || 'S-1042';
      const localKey = `exam_data_${studentId}_${id}`;
      const examState = JSON.parse(localStorage.getItem(localKey)) || {
        violationCount: 0,
        violations: [],
        auditTrail: [],
        answers: {}
      };

      if (!examState.startTime) {
        examState.startTime = Date.now();
      }

      const startEvent = {
        studentId,
        testId: id,
        event: 'Exam started / resumed in fullscreen mode',
        timestamp: new Date().toISOString()
      };

      examState.auditTrail.push(startEvent);
      localStorage.setItem(localKey, JSON.stringify(examState));

      logEvent(startEvent);
    } catch (err) {
      toast.error("Failed to enter fullscreen mode. Please ensure browser permissions allow fullscreen and try again.");
    }
  };

  // 3. Prevent leaving page beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isExamStarted && !isExamSubmitted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress is saved but navigating away is a violation of exam integrity.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isExamStarted, isExamSubmitted]);

  // 4. popstate blocker (Back navigation disable)
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    window.history.pushState(null, null, window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, null, window.location.href);
      toast.warning("Back navigation is disabled during the examination.");
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isExamStarted, isExamSubmitted]);

  // 5. Keyboard Shortcut Restrictions
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode;

      let isBlocked = false;
      let blockedInfo = '';

      // F12
      if (key === 'f12' || keyCode === 123) {
        isBlocked = true;
        blockedInfo = 'F12';
      }
      // Ctrl+Shift+I / J / C
      else if (isCtrl && isShift && (key === 'i' || key === 'j' || key === 'c' || keyCode === 73 || keyCode === 74 || keyCode === 67)) {
        isBlocked = true;
        blockedInfo = `Ctrl+Shift+${key.toUpperCase()}`;
      }
      // Ctrl+U
      else if (isCtrl && (key === 'u' || keyCode === 85)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+U (View Source)';
      }
      // Ctrl+S
      else if (isCtrl && (key === 's' || keyCode === 83)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+S (Save)';
      }
      // Ctrl+P
      else if (isCtrl && (key === 'p' || keyCode === 80)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+P (Print)';
      }
      // Ctrl+A
      else if (isCtrl && (key === 'a' || keyCode === 65)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+A (Select All)';
      }
      // Ctrl+C
      else if (isCtrl && (key === 'c' || keyCode === 67)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+C (Copy)';
      }
      // Ctrl+V
      else if (isCtrl && (key === 'v' || keyCode === 86)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+V (Paste)';
      }
      // Ctrl+X
      else if (isCtrl && (key === 'x' || keyCode === 88)) {
        isBlocked = true;
        blockedInfo = 'Ctrl+X (Cut)';
      }
      // PrintScreen
      else if (key === 'printscreen' || key === 'snapshot' || keyCode === 44) {
        isBlocked = true;
        blockedInfo = 'PrintScreen';
      }
      // Context Menu Key
      else if (key === 'contextmenu' || keyCode === 93) {
        isBlocked = true;
        blockedInfo = 'Context Menu key';
      }

      if (isBlocked) {
        e.preventDefault();
        e.stopPropagation();
        setActiveViolations(prev => ({ ...prev, action: true }));
        recordViolation('KEYBOARD_SHORTCUT', `Keyboard shortcut blocked: ${blockedInfo}`);
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isExamStarted, isExamSubmitted]);

  // 6. Right-Click and Copy Protection (text selection, copy/cut/paste, drag/drop)
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      setActiveViolations(prev => ({ ...prev, action: true }));
      recordViolation('RIGHT_CLICK', 'Right click blocked');
      return false;
    };

    const handleCopy = (e) => {
      e.preventDefault();
      setActiveViolations(prev => ({ ...prev, action: true }));
      recordViolation('COPY_ATTEMPT', 'Copy attempt blocked');
      return false;
    };

    const handleCut = (e) => {
      e.preventDefault();
      setActiveViolations(prev => ({ ...prev, action: true }));
      recordViolation('COPY_ATTEMPT', 'Cut attempt blocked');
      return false;
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setActiveViolations(prev => ({ ...prev, action: true }));
      recordViolation('PASTE_ATTEMPT', 'Paste attempt blocked');
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleDragStart = (e) => {
      e.preventDefault();
      return false;
    };

    const handleDrop = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
    };
  }, [isExamStarted, isExamSubmitted]);

  // 7. Fullscreen, Visibility and Blur Observers
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);

      if (!isFS) {
        setActiveViolations(prev => ({ ...prev, fullscreen: true }));
        recordViolation('FULLSCREEN_EXIT', 'Fullscreen exited');
      } else {
        setActiveViolations(prev => ({ ...prev, fullscreen: false }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setActiveViolations(prev => ({ ...prev, tabSwitch: true }));
        recordViolation('TAB_SWITCH', 'Student switched browser tab or minimized window');
      } else {
        setActiveViolations(prev => ({ ...prev, tabSwitch: false }));
      }
    };

    const handleBlur = () => {
      setActiveViolations(prev => ({ ...prev, blur: true }));
      recordViolation('WINDOW_BLUR', 'Browser window lost focus');
    };

    const handleFocus = () => {
      setActiveViolations(prev => ({ ...prev, blur: false }));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isExamStarted, isExamSubmitted]);

  // 8. DevTools Polling Observer
  useEffect(() => {
    if (!isExamStarted || isExamSubmitted) return;

    const check = () => {
      const isDevToolsOpen = checkDevTools();
      if (isDevToolsOpen) {
        setActiveViolations(prev => {
          if (!prev.devTools) {
            recordViolation('DEVTOOLS_OPEN', 'Developer tools opened');
          }
          return { ...prev, devTools: true };
        });
      } else {
        setActiveViolations(prev => ({ ...prev, devTools: false }));
      }
    };

    check();
    const interval = setInterval(check, 1500);
    return () => clearInterval(interval);
  }, [isExamStarted, isExamSubmitted]);

  // 9. Security Warning Overlay 30-Second Timer
  const isStateViolationActive = activeViolations.fullscreen || activeViolations.tabSwitch || activeViolations.blur || activeViolations.devTools || activeViolations.action;

  useEffect(() => {
    if (isStateViolationActive && !isExamSubmitted && !isTerminated) {
      if (!overlayTimerRef.current) {
        setOverlayTimeLeft(30);
        overlayTimerRef.current = setInterval(() => {
          setOverlayTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(overlayTimerRef.current);
              overlayTimerRef.current = null;
              handleImmediateTermination('Violation warning countdown expired without resolution');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      if (overlayTimerRef.current) {
        clearInterval(overlayTimerRef.current);
        overlayTimerRef.current = null;
      }
      setOverlayTimeLeft(30);
    }

    return () => {
      if (overlayTimerRef.current) {
        clearInterval(overlayTimerRef.current);
        overlayTimerRef.current = null;
      }
    };
  }, [isStateViolationActive, isExamSubmitted, isTerminated]);

  // 10. Auto-Save answers to localStorage on modification
  useEffect(() => {
    if (!examData) return;
    const studentId = localStorage.getItem('userId') || 'S-1042';
    const localKey = `exam_data_${studentId}_${id}`;
    const examState = JSON.parse(localStorage.getItem(localKey)) || {
      violationCount: 0,
      violations: [],
      auditTrail: [],
      answers: {}
    };

    examState.answers = answers;
    localStorage.setItem(localKey, JSON.stringify(examState));
  }, [answers, examData, id]);

  // 11. Sections derived from questions (must be before early returns to satisfy Rules of Hooks)
  const sections = useMemo(() => {
    if (!examData?.questions) return [];
    const subjects = new Set();
    examData.questions.forEach(q => {
      subjects.add(q.subjectName || 'General');
    });
    return Array.from(subjects);
  }, [examData]);

  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (examData?.questions && examData.questions[currentIdx]) {
      setActiveSection(examData.questions[currentIdx].subjectName || 'General');
    }
  }, [currentIdx, examData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-12 h-12 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-[#64748B]">Setting up examination environment...</p>
      </div>
    );
  }

  if (!examData || !examData.questions || examData.questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <AlertTriangle size={48} className="text-[#DC2626] mb-4" />
        <h1 className="text-lg font-bold text-[#0F172A]">No Questions Available</h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-sm">This test does not contain any questions. Please notify your instructor.</p>
        <button onClick={() => navigate('/student/tests')} className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const questions = examData.questions;
  const activeQuestion = questions[currentIdx];

  const handleSectionClick = (subject) => {
    const idx = questions.findIndex(q => (q.subjectName || 'General') === subject);
    if (idx !== -1) {
      navigateTo(idx);
    }
  };

  // Helper to format remaining seconds into MM:SS
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Nav actions
  const navigateTo = (idx) => {
    // Add target index to visited
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(idx);
      return next;
    });
    setCurrentIdx(idx);
  };

  const handlePrev = () => {
    if (currentIdx > 0) navigateTo(currentIdx - 1);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) navigateTo(currentIdx + 1);
  };

  // Save answer to local state & trigger mock API call
  const handleSaveAnswer = async () => {
    const qId = activeQuestion.id;
    const finalAnswer = String(currentAnswer).trim();

    setAnswers((prev) => ({
      ...prev,
      [qId]: finalAnswer,
    }));

    // Trigger local API save placeholder
    await saveAnswer(examData.testId, qId, finalAnswer);
    toast.success("Answer saved!", { autoClose: 1000, hideProgressBar: true });

    // Auto-advance if not on the last question
    if (currentIdx < questions.length - 1) {
      handleNext();
    }
  };

  // Compute metrics
  const answeredCount = Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length;
  const unansweredCount = questions.length - answeredCount;

  // Submit Exam handlers
  const handleAutoSubmit = async () => {
    if (isSubmitting || isExamSubmitted) return;
    setIsSubmitting(true);
    setIsExamSubmitted(true);
    toast.warning("Time is up! Submitting your exam automatically...", { autoClose: 3000 });
    try {
      await submitExam(examData.testId, answers);
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (e) {
          console.warn("Could not exit fullscreen on auto-submit", e);
        }
      }
      navigate(`/student/tests/${examData.testId}/submitted`, { replace: true });
    } catch {
      toast.error("An error occurred during submission, but your progress has been cached.");
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (e) {
          console.warn("Could not exit fullscreen on auto-submit catch", e);
        }
      }
      navigate('/student/dashboard', { replace: true });
    }
  };

  const handleManualSubmit = async () => {
    if (isSubmitting || isExamSubmitted) return;
    setIsSubmitting(true);
    setIsExamSubmitted(true);
    try {
      await submitExam(examData.testId, answers);
      toast.success("Exam submitted successfully!");
      if (document.fullscreenElement) {
        try {
          await document.exitFullscreen();
        } catch (e) {
          console.warn("Could not exit fullscreen on manual submit", e);
        }
      }
      navigate(`/student/tests/${examData.testId}/submitted`, { replace: true });
    } catch {
      setIsExamSubmitted(false);
      toast.error("Failed to submit exam. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  // Clear current active selection
  const handleClearAnswer = () => {
    setCurrentAnswer('');
    const qId = activeQuestion.id;
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[qId];
      return next;
    });
  };

  if (isTerminated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans text-[#0F172A] select-none">
        <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-8 shadow-xl space-y-6">
          <div className="flex flex-col items-center gap-3 text-[#DC2626]">
            <div className="p-4 bg-red-50 rounded-full border border-red-100 animate-pulse">
              <AlertOctagon size={56} className="text-[#DC2626]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-[#0F172A]">Attempt Terminated</h1>
          </div>

          <p className="text-sm text-[#475569] leading-relaxed">
            Your examination session has been terminated due to security violations.
          </p>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 text-left text-xs font-semibold text-[#475569]">
            <p className="text-[#64748B]">Student ID: <span className="text-[#0F172A] font-mono">{localStorage.getItem('userId') || 'S-1042'}</span></p>
            <p className="text-[#64748B]">Test ID: <span className="text-[#0F172A] font-mono">{examData?.testId || id}</span></p>
            <p className="text-[#64748B]">Termination Reason: <span className="text-[#DC2626] font-bold">{terminationReason}</span></p>
            <p className="text-[#64748B]">Total Violations Recorded: <span className="text-[#DC2626] font-bold">{violationCount}</span></p>
          </div>

          {violations.length > 0 && (
            <div className="space-y-2 text-left max-h-40 overflow-y-auto pr-1">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Violation History:</p>
              <div className="space-y-1.5">
                {violations.map((v, i) => (
                  <div key={i} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-2 text-[10px] text-[#475569] font-mono">
                    [{new Date(v.timestamp).toLocaleTimeString()}] {v.violationType} - {v.details}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E2E8F0]">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl transition-all cursor-pointer shadow-md hover:shadow-red-500/10 text-sm"
            >
              Exit to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans select-none">
        <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-8 shadow-xl space-y-6">
          <div className="flex flex-col items-center gap-3 text-blue-600">
            <div className="p-4 bg-blue-50 rounded-full border border-blue-100">
              <ShieldAlert size={48} className="text-[#2563EB]" />
            </div>
            <h1 className="text-2xl font-black text-[#0F172A] tracking-tight mt-2">Security Enforcement Setup</h1>
          </div>

          <div className="text-sm text-[#475569] leading-relaxed space-y-4">
            <p>
              To ensure integrity, this examination must be taken under maximum security settings:
            </p>
            <ul className="text-xs text-left bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5 font-medium text-[#64748B]">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">✓</span> Enforced Fullscreen Mode (exiting triggers termination countdown).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">✓</span> Tab Switching & Blur Detection (leaving tab/window logs violations).
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">✓</span> Right-Click, PrintScreen, Clipboard, and Keyboard shortcuts are disabled.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">✓</span> Real-time DevTools detection (debugging is strictly prohibited).
              </li>
            </ul>
            <p className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-xl leading-normal">
              ⚠️ Warning: You get a maximum of 2 warnings. The 3rd security violation will immediately terminate your session and auto-submit answers.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={handleStartExam}
              className="w-full py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg hover:shadow-blue-500/20 text-sm"
            >
              Enter Fullscreen & Begin Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans select-none">
      {/* 1. Header Area */}
      <header className="bg-white border-b border-[#E2E8F0] shadow-xs px-6 py-4 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#0F172A] leading-tight">{examData.testName}</h1>
          <p className="text-xs font-semibold text-[#64748B] mt-0.5">{examData.subjectName} Assessment</p>
        </div>

        {/* Timer Box */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
            timeLeft < 300 
              ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626] animate-pulse' 
              : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
          }`}>
            <Clock size={16} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-5 py-2.5 bg-[#16A34A] text-white font-bold text-xs rounded-xl hover:bg-[#15803D] transition-colors shadow-xs hover:shadow-sm cursor-pointer"
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* 2. Main Workstation */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Question Pane */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs space-y-6">
            
            {/* Subject Section Tabs */}
            {sections.length > 1 && (
              <div className="flex border-b border-[#E2E8F0] gap-4 pb-1 mb-4 overflow-x-auto">
                {sections.map(sec => {
                  const isCurrent = activeSection === sec;
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => handleSectionClick(sec)}
                      className={`pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                        isCurrent
                          ? 'border-[#2563EB] text-[#2563EB]'
                          : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      {sec}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Question Info Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-[#2563EB]/10 text-[#2563EB] border border-[#2563EB]/25">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-xs font-bold text-[#64748B]">
                Marks: <span className="font-black text-[#0F172A]">{activeQuestion.marks} pts</span>
              </span>
            </div>

            {/* Question Type Descriptor */}
            <div className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">
              Type: {activeQuestion.questionType.replace('_', ' ')}
            </div>

            {/* Question Text */}
            <p className="text-base text-[#0F172A] font-semibold leading-relaxed whitespace-pre-wrap">
              {activeQuestion.questionText}
            </p>

            {/* Answer Field Render Area */}
            <div className="pt-4 border-t border-[#F1F5F9] space-y-4">
              
              {/* MCQ Options */}
              {activeQuestion.questionType === 'MCQ_SINGLE' && (
                <div className="grid grid-cols-1 gap-3">
                  {['A', 'B', 'C', 'D'].map((opt) => {
                    const optVal = activeQuestion[`option${opt}`];
                    if (!optVal) return null;
                    const isSelected = currentAnswer === optVal;

                    return (
                      <label
                        key={opt}
                        onClick={() => handleAnswerChange(optVal)}
                        className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#2563EB]/5 border-[#2563EB] text-[#2563EB] font-semibold'
                            : 'border-[#E2E8F0] bg-white text-[#475569] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full border text-xs font-bold flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#CBD5E1] text-[#64748B]'
                        }`}>
                          {opt}
                        </span>
                        <span>{optVal}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* NUMERICAL Number Input */}
              {activeQuestion.questionType === 'NUMERICAL' && (
                <div>
                  <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Enter numerical value:</label>
                  <input
                    type="number"
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    placeholder="Enter a number..."
                    className="w-full sm:w-64 px-4 py-3 rounded-xl border border-[#CBD5E1] text-sm text-[#0F172A] font-bold focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                  />
                </div>
              )}

              {/* Reset answer option */}
              {currentAnswer && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="text-xs font-semibold text-[#DC2626] hover:underline"
                >
                  Clear Selection / Reset
                </button>
              )}
            </div>
          </div>

          {/* 3. Footer Action Navigation Controls */}
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-4 rounded-2xl shadow-2xs">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <button
              onClick={handleSaveAnswer}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition-colors shadow-xs cursor-pointer"
            >
              <Save size={14} /> Save Answer
            </button>

            <button
              onClick={handleNext}
              disabled={currentIdx === questions.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </main>

        {/* Right Side: Sidebar Palette */}
        <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-[#E2E8F0] bg-white p-6 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Question Palette</h2>
            <p className="text-xs text-[#64748B] mt-0.5">Click a number to navigate directly.</p>
          </div>

          {/* Grouped by Section Palette */}
          <div className="space-y-4">
            {sections.map(sec => {
              const secQuestions = questions.map((q, idx) => ({ q, idx })).filter(item => (item.q.subjectName || 'General') === sec);
              if (secQuestions.length === 0) return null;
              return (
                <div key={sec} className="space-y-2">
                  <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider">{sec}</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {secQuestions.map(({ q, idx }) => {
                      const isCurrent = currentIdx === idx;
                      const hasAns = answers[q.id] !== undefined && answers[q.id] !== '';
                      const hasVisited = visited.has(idx);

                      let btnBg = 'bg-[#F1F5F9] border-[#E2E8F0] text-[#64748B]'; // Unvisited default
                      if (hasVisited) {
                        btnBg = hasAns
                          ? 'bg-[#16A34A] border-[#16A34A] text-white font-bold' // Answered
                          : 'bg-[#DC2626] border-[#DC2626] text-white font-bold'; // Visited but Unanswered
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => navigateTo(idx)}
                          className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center border transition-all cursor-pointer ${btnBg} ${
                            isCurrent ? 'ring-3 ring-[#2563EB]/40 border-[#2563EB]' : ''
                          }`}
                          title={`Question ${idx + 1}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Code Legend indicator */}
          <div className="border-t border-[#F1F5F9] pt-4 space-y-2.5 text-xs">
            <span className="block font-bold text-[#475569] tracking-tight mb-1">Status Legend:</span>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#16A34A] block" />
              <span className="text-[#64748B] font-medium">Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#DC2626] block" />
              <span className="text-[#64748B] font-medium">Visited but Unanswered ({questions.length - answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-[#F1F5F9] border border-[#E2E8F0] block" />
              <span className="text-[#64748B] font-medium">Not Visited</span>
            </div>
          </div>

          {/* Safety Exit warning */}
          <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-3.5 text-xs text-[#92400E] leading-normal font-medium">
            ⚠️ Warning: Navigating away from this tab or refreshing the page may clear unsaved data progress. Make sure to click "Save Answer" before submitting.
          </div>
        </aside>
      </div>

      {/* 3. Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center gap-3 text-[#EAB308]">
                <AlertTriangle size={28} />
                <h3 className="text-lg font-bold text-[#0f172a]">Confirm Exam Submission</h3>
              </div>

              <div className="space-y-2 text-sm text-[#475569]">
                <p>Are you sure you want to finish and submit your exam?</p>
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 space-y-1.5 font-semibold">
                  <p className="flex justify-between">
                    <span>Total Questions:</span> <span className="text-[#0F172A]">{questions.length}</span>
                  </p>
                  <p className="flex justify-between text-[#16A34A]">
                    <span>Answered:</span> <span>{answeredCount}</span>
                  </p>
                  <p className="flex justify-between text-[#DC2626]">
                    <span>Unanswered:</span> <span>{unansweredCount}</span>
                  </p>
                </div>

                {unansweredCount > 0 && (
                  <p className="text-xs text-[#DC2626] font-bold bg-[#FEF2F2] border border-[#FCA5A5] p-2.5 rounded-lg">
                    ⚠️ You still have {unansweredCount} unanswered questions! If you submit now, they will receive 0 marks.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-[#E2E8F0] text-sm text-[#475569] font-semibold rounded-xl hover:bg-[#F8FAFC] disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleManualSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#16A34A] text-white text-sm font-bold rounded-xl hover:bg-[#15803D] disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Exam"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Security Warning Overlay Modal */}
      <AnimatePresence>
        {isStateViolationActive && !isExamSubmitted && !isTerminated && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 text-center"
            >
              <div className="flex flex-col items-center gap-3 text-[#DC2626]">
                <div className="p-4 bg-red-50 rounded-full animate-bounce">
                  <ShieldAlert size={48} />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-[#0F172A] mt-2">Security Breach Detected</h2>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold text-[#DC2626]">
                  Violation {violationCount} of 3 (3rd violation auto-submits exam)
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-left text-sm text-[#475569]">
                  <p className="font-bold text-[#0F172A] mb-1">Unresolved security issue(s):</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs font-semibold text-red-600">
                    {activeViolations.fullscreen && <li>Fullscreen mode has been exited.</li>}
                    {activeViolations.tabSwitch && <li>Browser tab switched or minimized.</li>}
                    {activeViolations.blur && <li>Browser window lost focus.</li>}
                    {activeViolations.devTools && <li>Developer Tools are not allowed during examinations.</li>}
                    {activeViolations.action && <li>Forbidden action (copy, paste, print screen, right click, or restricted keys) detected.</li>}
                  </ul>
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs font-bold text-[#92400E]">Time remaining to resolve issue(s):</p>
                  <p className="text-3xl font-black text-[#DC2626] font-mono mt-1">{overlayTimeLeft}s</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {activeViolations.fullscreen && (
                  <button
                    onClick={() => {
                      document.documentElement.requestFullscreen()
                        .then(() => {
                          setActiveViolations(prev => ({ ...prev, fullscreen: false }));
                        })
                        .catch(() => {
                          toast.error("Failed to re-enter fullscreen. Please try again.");
                        });
                    }}
                    className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold rounded-xl transition-all cursor-pointer font-sans"
                  >
                    Re-enter Fullscreen
                  </button>
                )}

                {activeViolations.action && (
                  <button
                    onClick={() => {
                      setActiveViolations(prev => ({ ...prev, action: false }));
                    }}
                    className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold rounded-xl transition-all cursor-pointer font-sans"
                  >
                    Acknowledge Violation & Resume
                  </button>
                )}

                <p className="text-[10px] text-[#64748B] font-semibold leading-relaxed">
                  Note: The warning timer continues ticking. Failing to comply before it hits 0 will terminate your session and submit all answers automatically.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExamScreenPage;
