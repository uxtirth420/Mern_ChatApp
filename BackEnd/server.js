const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { notFound, errorHandler} = require('./middleware/errorMiddleware')
const messageRoutes = require('./routes/messageRoutes')
const Chat = require('./models/chatModel');

dotenv.config();

const connectDB = require('./config/db');
const app = express();

app.use(cors({
    origin: process.env.ORIGIN || process.env.origin || 'http://localhost:5173', // Vite default port
    credentials: true, // Required for cookies to work cross origin
    allowedHeaders: ['Content-Type', 'Authorization'] //Before your GET request, the browser sends an OPTIONS request. If your backend isn't configured to handle OPTIONS with a 200 status, the browser will block the actual request with a 403.
})); 

connectDB();

app.use(express.json());  // To accept the json data.

app.get("/", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    res.sendFile(path.join(__dirname, '../FrontEnd/dist/index.html'));
  } else {
    res.send("API is Running Successfully");
  }
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user/login", userRoutes);
app.use("/api/message", messageRoutes);

// Deployment //

if(process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, '../FrontEnd/dist');

  app.use(express.static(frontendDistPath));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send("API is running successfully");
  });
}
// Deployment //

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});


const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // vite default port
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on('setup', (userData) => {
    socket.join(userData._id);   // the room creates for that particular user.
    // console.log(userData._id);
    socket.emit('connected');
    });
    
    socket.on('join chat', (room) => {
      socket.join(room);
      console.log("user joined room: " + room);
    });

    socket.on('typing', (chatId) => {
      socket.in(chatId).emit("typing", { chatId });
    });
    socket.on('stop typing', (chatId) => {
      socket.in(chatId).emit("stop typing", { chatId });
    });

    socket.on('messages read', async ({ chatId, readerId }) => {
      const chat = await Chat.findById(chatId).select("users");
      if (!chat) return;

      chat.users.forEach((userId) => {
        if (userId.toString() !== readerId.toString()) {
          io.in(userId.toString()).emit("messages read", { chatId, readerId });
        }
      });
    });

    socket.on('new message', (newMessageReceived) => {
      let chat = newMessageReceived.chat;

      if(!chat.users) return console.log("chat.users not defined");

      chat.users.forEach(user => {
        if(user._id.toString() === newMessageReceived.sender._id.toString()) return;
        
        socket.in(user._id.toString()).emit("message received", newMessageReceived);
      })
    })

    socket.on('message deleted', ({ chatId, messageId }) => {
      if (!chatId || !messageId) return;

      io.in(chatId).emit("message deleted", { chatId, messageId });
    });
});


