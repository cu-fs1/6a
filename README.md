# Banking API

This repository is a simple Node.js/Express application that provides a RESTful API
for basic banking user flows. It includes user registration and login endpoints,
MongoDB persistence with `mongoose`, request logging middleware, and remote log
shipping to SolarWinds Observability.

---

## 🗂️ Project Structure

```text
index.js                        # Application entry point
config/
  db.js                         # MongoDB connection helper
  solarwinds.js                 # SolarWinds Observability log shipper
controllers/
  auth.controller.js            # Route handlers for user registration and login
models/
  user.model.js                 # Mongoose schema for users
middleware/
  logger.middleware.js          # Request logging middleware (ships logs to SolarWinds)
routes/
  auth.routes.js                # Express router for user endpoints
```

- **index.js**: bootstraps the server, loads environment variables via `dotenv`,
  applies middleware (CORS, JSON body parsing, and request logging), and registers
  the `/users` router.
- **config/db.js**: connects to MongoDB using the `MONGO_URI` env variable.
- **config/solarwinds.js**: exports `sendToSolarWinds()` — ships structured log
  entries to SolarWinds Observability via `axios` using the `SOLARWINDS_TOKEN`
  env variable.
- **models/user.model.js**: defines `User` fields — `fullName`, `email`,
  `password` — with timestamps.
- **controllers/auth.controller.js**: contains `registerUser` and `loginUser`
  handlers.
- **routes/auth.routes.js**: wires auth controller functions to `POST /register`
  and `POST /login`.
- **middleware/logger.middleware.js**: on every completed response, records
  method, URL, status code, and duration, then forwards the structured payload
  to `sendToSolarWinds`.

---

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Create a `.env` file in the root:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/mydb
   SOLARWINDS_TOKEN=your_solarwinds_ingestion_token
   ```
   > `SOLARWINDS_TOKEN` is optional. If omitted, logs are silently skipped and
   > only printed to the console.

3. Run the server:
   ```bash
   pnpm dev      # development (nodemon)
   pnpm start    # production
   ```

4. The API will be available at `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Path              | Description                         |
|--------|-------------------|-------------------------------------|
| GET    | `/`               | Health check — returns welcome text |
| POST   | `/users/register` | Register a new banking user         |
| POST   | `/users/login`    | Login a user                        |

### Request & Response Examples

#### `POST /users/register`

Request body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Response `201`:
```json
{
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "createdAt": "..."
  }
}
```

#### `POST /users/login`

Request body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Response `200`:
```json
{
  "message": "Login successful",
  "data": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

Response `401`:
```json
{ "message": "Invalid email or password" }
```

---

## 🛠️ Technologies Used

| Package    | Purpose                                  |
|------------|------------------------------------------|
| Express.js | HTTP server & routing                    |
| http-errors | Standardized HTTP error objects         |
| Mongoose   | MongoDB ODM                              |
| dotenv     | Environment variable loading             |
| axios      | HTTP client for SolarWinds log shipping  |
| cors       | Cross-Origin Resource Sharing middleware |
| nodemon    | Auto-restart during development          |

---

## 📊 Logging & Observability

Every completed HTTP request is captured by `logger.middleware.js` and sent as
a structured JSON payload to
[SolarWinds Observability](https://logs.collector.ap-01.cloud.solarwinds.com/v1/logs):

```json
{
  "timestamp": "2026-03-03T06:51:04.381Z",
  "method": "POST",
  "url": "/users/login",
  "statusCode": 200,
  "durationMs": 46,
  "message": "2026-03-03T06:51:04.381Z | POST /users/login | 200 | 46ms"
}
```

Set `SOLARWINDS_TOKEN` in `.env` to enable shipping. If the token is absent,
logs are skipped silently.

---

## ✅ Additional Notes

- Login is intentionally implemented without security (no password hashing,
  tokens, or session management), based on the lab objective.
- Feel free to extend the codebase with password hashing (bcrypt), JWT/session
  based auth, and role-based authorization.
