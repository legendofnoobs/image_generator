import mongoose from "mongoose";

const connectDB = async ()=>{
	mongoose.connection.on("connected", ()=> console.log("Connected to Mongo"))
	await mongoose.connect(`${process.env.MONGODB_URI}/image_generator`)
}

export default connectDB;