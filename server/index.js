import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT || 4000;

const app = express();

// 🔥 Use only one express.json with increased limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
	origin: "http://localhost:5173", // or Vercel URL in prod
	methods: ["GET", "POST", "PUT", "DELETE"],
}));

await connectDB();

app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)

app.get("/", (req, res) => { res.send("API Working lol") })

app.listen(PORT, () => console.log("server running on port " + PORT));
