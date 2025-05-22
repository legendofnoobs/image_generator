import express from "express";
import { generateImage, getSavedImages, saveImageToDB, unsaveImage, editImage } from "../controllers/imageController.js";
import userAuth from "../middlewares/auth.js";

const imageRouter = express.Router();

imageRouter.post("/generate-image", userAuth, generateImage);
imageRouter.post("/save", userAuth, saveImageToDB);
imageRouter.get("/saved", userAuth, getSavedImages);
imageRouter.delete("/unsave/:imageId", userAuth, unsaveImage);
imageRouter.post("/edit", userAuth, editImage);

export default imageRouter;