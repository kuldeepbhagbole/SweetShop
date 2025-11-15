# 🍭 Sweet Shop Management System

This is a full-stack TDD Kata assignment to build a complete management system for a sweet shop. It includes a RESTful backend API and a modern React single-page application (SPA) frontend.

The backend is built with **Node.js**, **Express**, and **MongoDB**.
The frontend is built with **React**, **Vite**, and **Context API**.

---

## 📸 Application Screenshots
* **

[Image of Login Page]
![alt text](<Screenshot 2025-11-15 004412.png>)
**
* ****
* **

[Image of User Panel ]
![alt text](<Screenshot 2025-11-15 004553.png>)
![alt text](<Screenshot 2025-11-15 004602.png>)

[Image of Admin Panel (showing form and table)]
![alt text](<Screenshot 2025-11-15 004438.png>)
![alt text](<Screenshot 2025-11-15 004453.png>)
![alt text](<Screenshot 2025-11-15 004509.png>)
![alt text](<Screenshot 2025-11-15 004526.png>)
**
* ****

---

## ⚙️ How to Set Up and Run

### Prerequisites
* Node.js (v20.19+ recommended)
* MongoDB (A local instance running on `mongodb://127.0.0.1:27017`)
* npm (comes with Node.js)

### 1. Backend Setup

First, set up and run the backend server.

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the /backend folder
#    and add the following content:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/sweetshop
JWT_SECRET=your_super_secret_key_here

# 4. Start the server
npm run dev
```
The backend API will be running on `http://localhost:5000`.

### 2. Frontend Setup

Next, set up and run the frontend React app in a **separate terminal**.

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the React development server
npm run dev
```
The application will open in your browser at `http://localhost:5173`.

---

## ✅ Test Report (TDD)

The backend was developed using a Test-Driven Development (TDD) approach. All tests are written with Jest and Supertest.

To run the full test suite and generate the report:

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Run the test command
npm test
```

#### Test Results:
*(**TODO:** Paste your successful test output here!)*
```bash
PASS  tests/auth.test.js
PASS  tests/sweets.test.js

Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        2.406 s
Ran all test suites.
```

---

## 🤖 My AI Usage 

As per the assignment policy, this section details the use of AI tools in this project.

* **Tool(s) Used:** Google Gemini
* **How I used it:**
    * **Backend Generation:** I prompted Gemini to generate the initial backend folder structure, Express server setup, Mongoose models (`User.js`, `Sweet.js`), and the full implementation for all controller logic and API routes.
    * **TDD Implementation:** I asked Gemini to generate the complete Jest/Supertest TDD files (`auth.test.js`, `sweets.test.js`) and to use `mongodb-memory-server` for a clean test environment.
    * **Debugging:** When the tests failed (due to ES Module errors and missing `.env` variables), I provided the error logs to Gemini, which identified the problem and provided the correct configuration for `package.json` and `app.js`.
    * **Frontend Generation:** I prompted Gemini to build the complete React frontend, including the file structure, `AuthContext` for state management, API client with `axios`, and all pages and components.
    * **Refinement & Correction:** After my initial review, I pointed out that the frontend was missing required features (search filters, admin UI). Gemini then provided a corrected, more detailed version of the frontend code that met all requirements.

* **Reflection:**
    Using an AI assistant was like having an expert pair programmer. It dramatically accelerated the boilerplate and setup phases. Its true value was in debugging and refactoring. Instead of spending hours on configuration errors, I could get an immediate solution and focus on the application's logic. It also enforced best practices, like using an in-memory DB for tests and separating the `app` from the `server` file.