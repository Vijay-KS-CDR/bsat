# BSAT — School Assessment Platform

Welcome to the School Assessment Platform (BSAT), a modern web application designed for administrating, conducting, and scoring school assessments. 

This repository has been structured as a professional, standard full-stack monorepo, housing both the backend and frontend modules under a single workspace.

---

## Folder Structure

```text
BSAT/
├── backend/                  # Spring Boot REST API
│   ├── .mvn/                 # Maven wrapper configuration
│   ├── src/                  # Java source files (controller, service, repository, entity)
│   ├── target/               # Compiled backend build files (ignored)
│   ├── mvnw                  # Linux/Unix Maven wrapper script
│   ├── mvnw.cmd              # Windows Maven wrapper script
│   ├── pom.xml               # Maven configuration file
│   └── HELP.md               # Backend Spring Boot setup notes
│
├── frontend/                 # React UI Client
│   ├── public/               # Static assets folder
│   ├── src/                  # React source components and state
│   ├── node_modules/         # Package dependencies (ignored)
│   ├── vite.config.js        # Vite compilation configuration
│   ├── package.json          # Node package configuration
│   └── package-lock.json     # Node locked dependencies versioning
│
├── docs/                     # Design and architectural assets
│   ├── api-contracts/        # REST API spec blueprints
│   ├── database/             # ER diagrams, SQL schemas, data dictionary
│   └── ui-design/            # UI styleguides and design wireframes
│
├── .gitattributes            # Repository attribute rules
├── .gitignore                # Global workspace gitignore
└── README.md                 # Project root documentation
```

---

## Backend Setup (Spring Boot)

The backend is built with Spring Boot, Java 21/24, and Spring JPA. It connects to a PostgreSQL database.

### Prerequisites
* Java Development Kit (JDK) 21 or later.
* PostgreSQL database instance running locally or on a remote host.

### Configuration
Update the database connection details in `backend/src/main/resources/application.properties` if necessary:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bsat
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Running the Backend
From the root workspace directory, run:
```bash
# On Windows PowerShell/CMD:
cd backend
.\mvnw.cmd spring-boot:run

# On Linux/macOS:
cd backend
./mvnw spring-boot:run
```
The Spring Boot server will start up on `http://localhost:8080` (or the configured port).

---

## Frontend Setup (React & Vite)

The frontend is a modern React application compiled using Vite.

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+ recommended)
* npm (comes bundled with Node.js)

### Installation
From the root workspace directory, run:
```bash
cd frontend
npm install
```

### Running the Frontend
Start the local development server by running:
```bash
npm run dev
```
Vite will serve the frontend locally, typically at `http://localhost:5173`. Open this URL in your web browser to interact with the application.

---

## How to Run the Entire Application Locally

To test the full-stack system locally:
1. Ensure your PostgreSQL database is running and credentials in `backend/src/main/resources/application.properties` are correct.
2. In one terminal terminal window:
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
3. In another terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. Access the web app in the browser via `http://localhost:5173`.
