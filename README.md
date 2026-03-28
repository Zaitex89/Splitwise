# Splitwise

## Preview

![Splitwise](assets/splitwise_landing_page.png)
![Splitwise](assets/splitwise_ex1.png)


A fullstack expense splitting app built with FastAPI and React.

---

## Project Structure

```
splitwise/
├── backend/
│   ├── config/
│   │   └── database.py
│   ├── models/
│   │   └── tables.py
│   ├── routes/
│   │   ├── users.py
│   │   ├── groups.py
│   │   ├── expenses.py
│   │   └── balances.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── group.py
│   │   ├── expense.py
│   │   └── balance.py
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── pages/
    │   ├── types/
    │   └── main.tsx
    └── package.json
```

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL

---

## Backend Setup

### 1. Create a virtual environment

```bash
cd backend
python -m venv .venv
```

Activate it:

- **Windows:**
  ```bash
  .venv\Scripts\activate
  ```
- **Mac/Linux:**
  ```bash
  source .venv/bin/activate
  ```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

If you don't have a `requirements.txt`, install manually:

```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv pydantic[email]
```

### 3. Create a `.env` file

Create a file called `.env` in the `backend/` folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/splitwise
```

Replace `username`, `password`, and `splitwise` with your PostgreSQL credentials and database name.

### 4. Create the database

Open psql or your preferred PostgreSQL client and run:

```sql
CREATE DATABASE splitwise;
```

### 5. Start the backend

```bash
uvicorn main:app --reload
```

The API will be running at `http://127.0.0.1:8000`.  
API docs available at `http://127.0.0.1:8000/docs`.

---

## Frontend Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## Usage

1. Go to **Manage members** and create users
2. Create a group and select members
3. Click a group to add expenses and view balances
4. The **Att swisha** section shows exactly who owes whom

---

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/` | Get all users |
| GET | `/users/{id}` | Get a user |
| POST | `/users/` | Create a user |
| DELETE | `/users/{id}` | Delete a user |

### Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/groups/` | Get all groups |
| GET | `/groups/{id}` | Get a group |
| POST | `/groups/` | Create a group |
| PUT | `/groups/{id}` | Update a group |
| DELETE | `/groups/{id}` | Delete a group |
| GET | `/groups/{id}/expenses` | Get group expenses |
| GET | `/groups/{id}/balances` | Get group balances |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/expenses/` | Create an expense |
| DELETE | `/expenses/{id}` | Delete an expense |