# CHAT-APPLICATION

*COMPANY* : CODTECH IT SOLUTIONS

*NAME* : VAGHELA NIRALI JAGDISHBHAI

*INTERN ID* : CT06DR1068

*DOMAIN* : FULL STACK WEB DEVLOPMENT

*DURATION* : 6 WEEKS

*MENTOR* : NEELA SANTOSH

💬 Pro Chat App
A Modern Real-Time Chat Application using Socket.IO, Express.js, and Vanilla JS

🚀 Pro Chat App is a full-stack real-time chat application built with Node.js, Express, and Socket.IO.
It allows multiple users to connect, chat instantly, see who’s typing, and get notified when users join or leave — all in real-time!
The app is designed with a clean and modern UI for an engaging chatting experience.

🧩 Features

✅ Real-Time Messaging — Messages appear instantly across all connected users
✅ User Join/Leave Notifications — See when users join or exit the chat
✅ Typing Indicator — Know when someone is typing a message
✅ Chat History — Displays all previous messages (stored in memory or can connect to MongoDB)
✅ Responsive UI — Works smoothly on desktop and mobile
✅ Frontend + Backend Integration — Complete communication between client and server using WebSocket
✅ Modular Code Structure — Clean separation of controllers, models, and configuration files

🏗️ Project Structure

pro-chat-app/
│
├── server/                     # Backend (Node.js + Express + Socket.IO)
│   ├── server.js               # Main server setup
│   ├── controllers/            # Handles chat logic
│   │   └── chatController.js
│   ├── models/                 # (Optional) Message model for DB
│   │   └── Message.js
│   ├── config/                 # DB configuration (optional)
│   │   └── db.js
│   └── package.json
│
├── client/                     # Frontend (HTML, CSS, JS)
│   ├── public/
│   │   ├── index.html          # Main chat page
│   │   ├── style.css           # Styling
│   │   └── script.js           # Socket.io logic
│   └── package.json
│
├── .env                        # Environment variables (e.g., PORT)
└── README.md

⚙️ Installation & Setup

1️⃣ Clone the repository
git clone https://github.com/<your-username>/pro-chat-app.git

2️⃣ Navigate to the server folder
cd pro-chat-app/server

3️⃣ Install dependencies
npm install

4️⃣ Run the server
node server.js

5️⃣ Open the app in your browser
http://localhost:3000

🖥️ Tech Stack

Category	Technologies Used
Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express.js
Realtime Communication	Socket.IO
Environment	dotenv
Styling	Custom CSS

💡 How It Works

When a user opens the app, they enter their name.
The server assigns a unique socket ID and broadcasts the user’s arrival.
Each message is sent to the server via Socket.IO, which instantly transmits it to all clients.
The typing indicator and online/offline status update dynamically using WebSocket events.
All chat history is stored temporarily in memory (can be upgraded to a database).

🧠 Future Enhancements

🗄️ MongoDB Integration for persistent chat storage
👤 User Authentication (JWT / OAuth)
💬 Private Rooms / Group Chats
📷 Media Sharing (Images, Files)
🌐 Multilingual Interface (English, Gujarati, etc.)

📸 Preview

<img width="651" height="525" alt="Image" src="https://github.com/user-attachments/assets/e2762ec8-eb6a-40ba-b92c-dbeb75144c94" />
<img width="1910" height="966" alt="Image" src="https://github.com/user-attachments/assets/41ca51c8-89b2-41aa-a9b4-def1edac10dd" />
<img width="1919" height="907" alt="Image" src="https://github.com/user-attachments/assets/9a5f2874-6ffd-4f27-aa75-c062453b3bd4" />
<img width="1919" height="913" alt="Image" src="https://github.com/user-attachments/assets/dd848814-d3c8-4ba4-b5b4-0e0488c598ee" />
<img width="499" height="189" alt="Image" src="https://github.com/user-attachments/assets/5fd19a26-e834-4cfc-93c8-4c25f29413e3" />
<img width="1890" height="922" alt="Image" src="https://github.com/user-attachments/assets/0b7baaf8-db81-4bc8-879a-5f5742e40c51" />
<img width="1913" height="923" alt="Image" src="https://github.com/user-attachments/assets/0a09acec-8af1-4318-8fdf-035926387945" />
<img width="507" height="292" alt="Image" src="https://github.com/user-attachments/assets/6afc8d0b-dc16-48e1-9197-20134e9ce1ec" />
