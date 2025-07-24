# 💸 BudgetSplit – Shared Expense Splitter

## 🚀 Overview

**BudgetSplit** is a full-stack application that helps groups manage and split shared expenses effortlessly. Whether you're traveling, living with roommates, or sharing costs with friends, BudgetSplit eliminates the headache of manual calculations and transactions.

---

## 🎯 Objective

Provide a seamless platform where users can:

- Form groups
- Log shared expenses
- Automatically calculate debts
- Generate optimized settlement recommendations

---

## 🛠️ Tech Stack

### Backend
- **Spring Boot (Java)** – RESTful API development
- **PostgreSQL** – Primary relational database
- **Redis** – NoSQL data caching

### Frontend
- **React + Vite** – Fast and modern UI development

---

## 👥 User Role

- **User**
  - Must be authenticated to access the app
  - Can create or join groups using invite codes

---

## 🔐 Authentication & Authorization

- Secure login required for all key operations
- Access is restricted to group members only

---

## 🧱 Core Functional Modules

### ✅ Group & Membership
- Create a group with a unique name and invite code
- Join groups via invite code
- View a list of current group members

### 💰 Expense Entry
- Log shared expenses with fields:
  - Amount, Description, Date
  - Payer and Participants (multi-select)
- Choose between equal split or custom percentage split

### 🔁 Balance & Settlement
- Auto-calculated net balances per user (who owes or is owed)
- “Settle All” screen showing minimum number of transactions needed
  - Example: “Alice pays Bob ₹200”

### 📜 History & Export
- View a chronological expense ledger
- Export transaction history & balances as CSV

### 💱 Multi-Currency Support
- Choose expense currency at entry
- Live conversion using exchange rate APIs (mock or free APIs)

### 🔔 Notifications & Reminders
- In-app or email notifications when:
  - A new expense is added
  - A monthly summary is generated

---

## 🎨 UI/UX Highlights

- Color-coded balances (owed vs. owing)
- Interactive balance graphs
- Mobile-responsive forms and layout

---

## 📦 Project Setup

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Folder Structure (Example)

```
budgetsplit/
├── backend/
│   └── src/main/java/... (Spring Boot App)
├── frontend/
│   └── src/... (React + Vite App)
└── README.md
```

---

## 📧 Contact

For questions or support, reach out via [Your Email or GitHub].

---

## ⭐️ Give it a Star!

If you like this project, please ⭐️ the repo to show your support!
