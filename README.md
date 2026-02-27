# Banking API

This repository is a simple Node.js/Express application that provides a RESTful API
for basic banking user flows. It includes user registration and login endpoints
(without authentication security), MongoDB persistence with `mongoose`, and request
logging middleware.

---

## 🗂️ Project Structure

```text
index.js                    # Application entry point
config/db.js                # MongoDB connection helper
controllers/
  auth.controller.js        # Route handlers for user registration and login
models/
  user.model.js             # Mongoose schema for users
middleware/
  logger.middleware.js      # Request logging middleware
routes/
  auth.routes.js            # Express router for user endpoints
```

- **index.js**: bootstraps the server, loads environment variables, applies
  middleware (CORS, JSON body parsing, and request logging), and registers the
  `/users` router.
- **config/db.js**: connects to the database using the `MONGO_URI` from
  environment.
- **user.model.js**: defines `User` fields such as name, email, password, and
  account number.
- **auth.controller.js**: contains registration and login logic.
- **auth.routes.js**: wires auth controller functions to endpoints.
- **logger.middleware.js**: logs every incoming request with method, URL,
  status code, and response time.

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root with:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/mydb
   ```

3. Run the server:
   ```bash
   pnpm start
   # or: node index.js
   ```

4. The API will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Path                    | Description                            |
|--------|-------------------------|----------------------------------------|
| POST   | `/users/register`       | Register a new banking user            |
| POST   | `/users/login`          | Login a user (plain email/password)    |

### Request Body Notes

- `POST /users/register` expects:
  `{ "fullName": "John Doe", "email": "john@example.com", "password": "123456", "accountNumber": 11223344 }`
- `POST /users/login` expects:
  `{ "email": "john@example.com", "password": "123456" }`

---

## 🛠️ Technologies Used

- Node.js (ES modules)
- Express.js
- MongoDB & Mongoose
- CORS & dotenv
- Custom logging middleware

---

## ✅ Additional Notes

- Login is intentionally implemented without security (no password hashing,
  tokens, or session management), based on the objective.
- Request logs are printed to console on every completed response.

Feel free to extend the codebase with password hashing, JWT/session based auth,
and role-based authorization.
