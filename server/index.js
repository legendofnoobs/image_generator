import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
	origin: "https://image-generator-six-delta.vercel.app",
	methods: ["GET", "POST", "PUT", "DELETE"],
}));

await connectDB();

app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)

app.get("/", (req, res) => { res.send("API Working lol") })

app.listen(PORT, () => console.log("server running on port " + PORT));