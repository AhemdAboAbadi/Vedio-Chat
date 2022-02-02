const express = require("express");
const app = express();
const http = require("http")
const cors = require("cors");

app.use(cors());
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection' , (socket) => {
  socket.emit("me" , socket.id);

  socket.on("disconnect" , () => {
    console.log("user disconnected");
    socket.broadcast.emit("callEnded");
  })

  socket.on("callUser" , ({userToCall , signalData , from , name}) => {
    io.to(userToCall).emit("caller" , {signalData , from , name});
  })
  
  socket.on('answerCall', (data)=> {
    io.to(data.to).emit('callAccepted', data.signal);
  })
})











app.get("/", (req, res) => {
  res.send("server is ranging");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  {
    console.log(`Server running on port ${PORT} http://localhost:${PORT}`);
    });