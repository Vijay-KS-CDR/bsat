import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  name,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full flex flex-col gap-1 mb-5">
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 z-10">
            <Icon size={20} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          placeholder={placeholder || " "}
          value={value}
          onChange={onChange}
          className={`
            peer w-full bg-white border-2 rounded-lg outline-none transition-all duration-200
            ${Icon ? 'pl-10' : 'pl-3'}
            ${isPassword ? 'pr-10' : 'pr-3'}
            py-3
            placeholder-transparent
            ${error 
              ? 'border-red-500 focus:border-red-500 text-red-900' 
              : 'border-slate-200 focus:border-primary text-slate-900'}
          `}
        />
        {label && (
          <label 
            htmlFor={name} 
            className={`absolute left-0 -top-2.5 bg-white px-1 text-sm font-medium transition-all duration-200 cursor-text
              ${Icon ? 'ml-9' : 'ml-2'}
              peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5
              peer-focus:-top-2.5 peer-focus:text-sm
              ${error ? 'text-red-500 peer-focus:text-red-500' : 'text-slate-500 peer-focus:text-primary'}
            `}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors z-10"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500 font-medium ml-1">{error}</span>}
    </div>
  );
};

export default InputField;
