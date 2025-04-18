# Tornado Chat Application

This is a simple chat application built with **Tornado Web Server** and **SQLite** as the database. The frontend can be built using React or any other framework. Users can register, log in, and chat in real-time using WebSockets.

---

## 🔧 Features

- User Registration (`/register`)
- User Login (`/login`)
- Real-Time Chat using WebSockets (`/ws`)
- Fetch Chat History and List of Users (`/get-messages`)
- Cross-Origin Resource Sharing (CORS) enabled for frontend access

---

## 🗃️ Database

SQLite is used as the backend database. A file named `chat.db` stores all data.

### Tables

- `users(user_id TEXT PRIMARY KEY, password TEXT)`
- `messages(sender TEXT, receiver TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`

> Make sure to run the `init_db()` function to initialize the database. You can define it in `db.py`.

---

## 📂 Endpoints

### 1. Register

**URL:** `/register`  
**Method:** `POST`  
**Body:**

```json
{
  "user_id": "your_username",
  "password": "your_password"
}
```

**Responses:**

- `200 OK`: `{ "message": "User registered successfully." }`
- `400 Bad Request`: `{ "error": "Missing user_id or password" }`
- `409 Conflict`: `{ "error": "User ID already exists." }`

---

### 2. Login

**URL:** `/login`  
**Method:** `POST`  
**Body:**

```json
{
  "user_id": "your_username",
  "password": "your_password"
}
```

**Responses:**

- `200 OK`: `{ "message": "Login successful." }`
- `401 Unauthorized`: `{ "error": "Invalid credentials." }`

---

### 3. WebSocket Connection

**URL:** `/ws`  
**Method:** WebSocket Connection

**Message Types:**

- Connect:

```json
{
  "type": "connect",
  "user_id": "your_username"
}
```

- Send Message:

```json
{
  "type": "message",
  "to": "receiver_username",
  "message": "Hello, how are you?"
}
```

**Real-Time Message Response:**

```json
{
  "from": "sender_username",
  "to": "receiver_username",
  "message": "Hello, how are you?",
  "type": "message"
}
```

---

### 4. Fetch Chat History and User List

**URL:** `/get-messages`  
**Method:** `POST`  
**Body:**

```json
{
  "user_id": "your_username"
}
```

**Response:**

```json
{
  "conversations": {
    "other_username": [
      {
        "sender": "your_username",
        "receiver": "other_username",
        "message": "Hi",
        "timestamp": "2023-04-17 12:00:00"
      }
    ]
  },
  "users": ["user1", "user2", "user3"]
}
```

---

## 🚀 Running the Application

1. Ensure Python and SQLite are installed.
2. Install Tornado:

```bash
pip install tornado
```

3. Run the server:

```bash
python your_app.py
```

The server will be available at `http://localhost:8888`.

---

## ⚙️ Frontend Integration

Frontend applications (e.g., React) can connect to the server at:

- HTTP API endpoints: `http://localhost:8888`
- WebSocket endpoint: `ws://localhost:8888/ws`

Make sure to handle WebSocket events (`connect`, `message`, `disconnect`) appropriately.

---

## 🔐 CORS Configuration

CORS is enabled for all origins. Modify headers in `BaseHandler` to restrict specific origins if needed.

```python
self.set_header("Access-Control-Allow-Origin", "*")
```

---

Enjoy your real-time Tornado chat application! 🎉

