import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoute from "./route/authRoute.js";
import converRoute from "./route/converRoute.js";
import messRoute from "./route/messageRoute.js"
import { initDB } from "./model/intitDB.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { saveMessage } from "./controller/messageController.js";

const PORT = process.env.PORT;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors:{
    origin:'*'
  }
});


app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/conver", converRoute);
app.use("/api/v1/message",messRoute)


io.on('connection',(socket)=>{
  console.log("A user connected: ",socket.id);

  socket.on("joinConversation",(conversationId)=>{
    socket.join(conversationId)
    console.log("User joined conversation: ",conversationId)
  })

  socket.on("sendMessage",async(message)=>{
    const {conversation_id,sender_id,content}= message;

    try{
      const savedMessage = await saveMessage(conversation_id,sender_id,content)
      console.log("sendMessage: ");
      console.log(savedMessage);
io.to(conversation_id).emit("newMessage",savedMessage);
    }catch(error){
      console.log(error);
    };
    
  })

  socket.on("disconnect",()=>{
    console.log("User disconnected: ",socket.id);
  })
})

initDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
