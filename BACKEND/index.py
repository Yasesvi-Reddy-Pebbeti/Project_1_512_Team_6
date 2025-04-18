import tornado.ioloop
import tornado.web
import tornado.websocket
import json
import sqlite3
from db import init_db

DB_FILE = "chat.db"
connected_users = {}  # user_id: WebSocketHandler instance


def save_message(sender, receiver, message):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)", (sender, receiver, message))
    conn.commit()
    conn.close()

import tornado.web

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")  # Or specify "http://localhost:5173"
        self.set_header("Access-Control-Allow-Headers", "x-requested-with, Content-Type, Authorization")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE')

    def options(self, *args, **kwargs):
        # no body for options requests
        self.set_status(204)
        self.finish()

class RegisterHandler(BaseHandler):
    def post(self):
        data = json.loads(self.request.body)
        user_id = data.get("user_id")
        password = data.get("password")

        if not user_id or not password:
            self.set_status(400)
            self.write({"error": "Missing user_id or password"})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        try:
            cursor.execute("INSERT INTO users (user_id, password) VALUES (?, ?)", (user_id, password))
            conn.commit()
            self.write({"message": "User registered successfully."})
        except sqlite3.IntegrityError:
            self.set_status(409)
            self.write({"error": "User ID already exists."})
        finally:
            conn.close()


class LoginHandler(BaseHandler):
    def post(self):
        data = json.loads(self.request.body)
        user_id = data.get("user_id")
        password = data.get("password")

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE user_id = ? AND password = ?", (user_id, password))
        user = cursor.fetchone()
        conn.close()

        if user:
            self.write({"message": "Login successful."})
        else:
            self.set_status(401)
            self.write({"error": "Invalid credentials."})

class GetMessagesHandler(BaseHandler):
    def post(self):
        try:
            data = json.loads(self.request.body)
            user = data.get("user_id")
        except Exception:
            self.set_status(400)
            self.write({"error": "Invalid JSON"})
            return

        if not user:
            self.set_status(400)
            self.write({"error": "Missing 'user_id'"})
            return

        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT sender, receiver, message, timestamp FROM messages
            WHERE sender = ? OR receiver = ?
            ORDER BY timestamp ASC
        """, (user, user))
        rows = cursor.fetchall()

        # Group by the other participant
        grouped = {}
        for sender, receiver, message, timestamp in rows:
            other = receiver if sender == user else sender
            if other not in grouped:
                grouped[other] = []
            grouped[other].append({
                "sender": sender,
                "receiver": receiver,
                "message": message,
                "timestamp": timestamp
            })
        cursor.execute("SELECT user_id FROM users WHERE user_id != ?", (user,))
        users = [row[0] for row in cursor.fetchall()]
        conn.close()
        self.write({"conversations": grouped , "users" : users})

class ChatWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        self.user_id = None
        print("WebSocket opened")

    def on_message(self, message):
        data = json.loads(message)

        if data["type"] == "connect":
            self.user_id = data["user_id"]
            connected_users[self.user_id] = self
            print(f"{self.user_id} connected via WebSocket.")

        elif data["type"] == "message":
            sender = self.user_id
            receiver = data["to"]
            text = data["message"]

            save_message(sender, receiver, text)

            payload = json.dumps({
                "from": sender,
                "to": receiver,
                "message": text,
                "type": "message"
            })

            # Send to receiver if connected
            if receiver in connected_users:
                connected_users[receiver].write_message(payload)

            # Optionally echo back to sender
            self.write_message(payload)

    def on_close(self):
        if self.user_id in connected_users:
            del connected_users[self.user_id]
            print(f"{self.user_id} disconnected.")

    def check_origin(self, origin):
        return True  # allow all origins


def make_app():
    return tornado.web.Application([
        (r"/register", RegisterHandler),
        (r"/login", LoginHandler),
        (r"/ws", ChatWebSocket),
        (r"/get-messages", GetMessagesHandler)
    ])


if True == True:
    init_db()
    app = make_app()
    app.listen(8888)
    print("Server running at http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
