# ✨ Full-Stack Store Rating Application

A robust, full-stack web application designed for comprehensive store and user rating management. Built using **NestJS**, **React (Vite)**, and **PostgreSQL**, this platform enforces strict Role-Based Access Control (RBAC) across three specialized interfaces: System Administrator, Store Owner, and Normal User.

---

## 🛠️ Tech Stack & Architecture
*   **Backend:** [NestJS](https://nestjs.com/) (Node.js framework), TypeScript
*   **Frontend:** [React](https://reactjs.org/) (bootstrapped with Vite), CSS Modules, Axios
*   **Database:** PostgreSQL (running strictly inside a Docker Container)
*   **ORM:** TypeORM
*   **Authentication:** JWT (JSON Web Tokens) with Passport strategy & Bcrypt hashing

---

## 🚀 Features by Role

### 1. System Administrator
*   **Global Command Center:** View massive key metrics (Total Users, Total Stores, Total Ratings).
*   **Entity Management:** Add fresh System Users and explicitly assign them to newly registered Stores.
*   **Advanced Data Tables:** Highly readable tables for tracking all stored and registered personnel with fully functional column sorting (Ascending/Descending) and multi-field filtering capabilities.

### 2. Store Owner
*   **Specialized Dashboard:** View the aggregated Average Rating of your specific assigned store prominently at the top.
*   **Feedback Tracking:** Analyze a clean table of exactly which Normal Users submitted ratings for your store, the star rating given, and the date submitted.

### 3. Normal User
*   **Marketplace View:** Access a beautiful grid display of all available stores.
*   **Dual-Search Functionality:** Filter targets dynamically by *both* Store Name and explicit Store Address.
*   **Interactive Rating:** Easily submit or update star ratings (1 to 5 scale) instantly sending feedback straight to the store owner's view.

### 4. Global Security
*   **Adaptive Validation:** Passwords explicitly require 8-16 characters, 1 uppercase letter, and 1 special symbol.
*   **Update Passwords:** Secure universal update portal accessible to all logged-in roles.
*   **Responsive UI:** Natively built to seamlessly re-flow for laptop widths and mobile phone dimensions utilizing dynamic flex-wrap locking and horizontal table scrolling.

---

## 💻 Local Setup & Installation

### Prerequisites
*   [Node.js](https://nodejs.org/en) (v18+)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be active to boot the isolated PostgreSQL instance)

### 1. Boot Database (PostgreSQL inside Docker)
Because native Windows services often conflict on port `5432`, the database exclusively runs inside a dedicated Docker container mapping to port **`5433`**.
```bash
# Start the pre-configured database container
docker start rating-db-2
```

### 2. Start the Backend API (NestJS)
Open a new terminal window:
```bash
cd rating-app-backend
npm install
npm run start:dev
```
*(Runs on `http://localhost:3001`)*

### 3. Start the Frontend App (React)
Open a new terminal window:
```bash
cd rating-app-frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 🧪 Database Seeding & Testing

If at any point you want to completely wipe out experimental data and return the application to a pristine starting point, simply execute the clean-up script from the backend folder:
```bash
cd rating-app-backend
node clean-db.js
```
*This will completely truncate all tables and safely reconstruct the isolated root Administrator account.*

### Default Administrator Credentials:
*   **Email:** `admin@app.com`
*   **Password:** `Admin@12345`

Log into the platform at `http://localhost:5173` using this account to begin constructing your ecosystem!

---
*Developed meticulously following strict RESTful API parameters and modern React hooks guidelines.*
