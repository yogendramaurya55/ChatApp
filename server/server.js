import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from "http";
import connectDB from './lib/db.js';


//create express and http server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req , res)=>{
    res.send("Server is Live");
});

const port = process.env.PORT || 5000;

//Connect to MONGODB

connectDB()
.then(()=>{
    server.listen(port , ()=>{
    console.log(`Server is running on port: ${port}`)
})

})
.catch((err)=>{
    console.log(`error while sating the server ${err}`)
})

