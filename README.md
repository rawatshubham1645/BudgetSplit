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

## 📦 Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js ≥ 18
- (Optional) Java 21 if you want to run the backend outside Docker

---

### 1️⃣ Clone & configure environment files
```bash
git clone https://github.com/rawatshubham1645/BudgetSplit.git
cd BudgetSplit
# Edit the env files as needed
cp Backend/.env Backend/.env.local   # example – or just edit Backend/.env
cp Frontend/.env Frontend/.env.local # example – or create manually
```
Default values:
```dotenv
# Backend/.env
POSTGRES_DB=expenseSplit
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qtl
POSTGRES_PORT=5433
REDIS_PORT=6380
SPRING_PORT=8081

# Frontend/.env
VITE_API_BASE_URL=http://localhost:8081
```

---

### 2️⃣ Run everything with Docker Compose
```bash
cd Backend
docker-compose up --build
```
This starts:
- PostgreSQL → `localhost:5433`
- Redis     → `localhost:6380`
- Spring Boot API → `localhost:8081`

---

### 3️⃣ Start the React frontend
Open a new terminal:
```bash
cd Frontend
npm install
npm run dev -- --host
```
Visit `http://localhost:5173` in your browser. All API calls proxy to `localhost:8081`.

---

### 4️⃣ Useful URLs
- API Health  : `http://localhost:8081/actuator/health`
- Swagger UI   : `http://localhost:8081/swagger-ui.html`

---

### Running backend without Docker (optional)
```bash
cd Backend
./gradlew build
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5433/expenseSplit \
SPRING_REDIS_HOST=localhost \
java -jar build/libs/BudgetSplit-0.0.1-SNAPSHOT.jar
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

For questions or support, reach out via [rawatshubham1645@gmail.com].

---

## ⭐️ Give it a Star!

If you like this project, please ⭐️ the repo to show your support!
