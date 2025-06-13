import express from 'express';
import cors from 'cors';
import "dotenv/config"
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

const PORT = process.env.PORT;

const app = express();

await connectDB();

app.use(cors({
	origin: ['http://localhost:5173', 'https://image-generator-t526.vercel.app'],
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'token']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));


// const allowedOrigins = ['http://localhost:5173', 'https://your-frontend.vercel.app'];

// app.use((req, res, next) => {
// 	const origin = req.headers.origin;
// 	if (allowedOrigins.includes(origin)) {
// 		res.setHeader('Access-Control-Allow-Origin', origin);
// 	}
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
// 	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token'); // <-- FIXED
// 	res.setHeader('Access-Control-Allow-Credentials', 'true');

// 	if (req.method === 'OPTIONS') {
// 		res.status(200).end();
// 		return;
// 	}

// 	next();
// });


app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)

app.get("/", (req, res) => { res.send("API Working lol") })

app.listen(PORT, () => console.log("server running on port " + PORT));
