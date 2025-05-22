import axios from "axios"
import userModel from "../models/userModel.js"
import imageModel from "../models/imageModel.js"
import FormData from "form-data"

export const generateImage = async (req, res) => {
	try {
		const { userId, prompt } = req.body

		const user = await userModel.findById(userId)
		if (!user || !prompt) return res.json({ success: false, message: "missing details" })

		if (user.creditBalance === 0 || userModel.creditBalance < 0) return res.json({ success: false, message: "no credit available", creditBalance: userModel.creditBalance })

		const finalPrompt = `Ultra-realistic pencil drawing effect, finely detailed portrait illustration, smooth shading, precise features, perfect symmetry, soft natural light, clean white background. ${prompt} `
		const formData = new FormData();
		formData.append('prompt', finalPrompt);

		const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
			headers: {
				"x-api-key": process.env.CLIPDROP_API,
			},
			responseType: 'arraybuffer',
		})

		const base64Image = Buffer.from(data, "binary").toString("base64")
		const resultImage = `data:image/png;base64,${base64Image}`

		res.json({ success: true, message: "image generated", resultImage })

	} catch (error) {
		console.log(error)
		res.json({ success: false, message: error.message })
	}
}

export const saveImageToDB = async (req, res) => {
	try {
		const { image, prompt } = req.body;
		const userId = req.body.userId; // From userAuth middleware

		if (!image || !userId || !prompt) {
			return res.status(400).json({
				success: false,
				message: "Missing required fields"
			});
		}

		const newImage = new imageModel({
			userId,
			prompt,
			image
		});

		const savedImage = await newImage.save();

		res.json({
			success: true,
			message: "Image saved successfully",
			imageId: savedImage._id
		});

	} catch (error) {
		console.error("Error saving image:", error);
		res.status(500).json({
			success: false,
			message: error.message
		});
	}
};

export const getSavedImages = async (req, res) => {
	try {
		const userId = req.body.userId; // From userAuth middleware

		const savedImages = await imageModel.find({ userId });

		if (savedImages.length === 0) {
			return res.status(404).json({ success: false, message: "No saved images found" });
		}

		res.json({ success: true, savedImages });
	} catch (error) {
		console.error("Error fetching saved images:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const unsaveImage = async (req, res) => {
	try {
		const { imageId } = req.params;
		console.log(imageId)
		const userId = req.body.userId; // From userAuth middleware

		const imageToDelete = await imageModel.findOne({ _id: imageId, userId });

		if (!imageToDelete) {
			return res.status(404).json({ success: false, message: "Image not found" });
		}

		// Delete the image
		await imageToDelete.deleteOne();

		res.json({ success: true, message: "Image unsaved successfully" });
	} catch (error) {
		console.error("Error unsaving image:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};

export const editImage = async (req, res) => {
	try {
		const { image, mask, prompt } = req.body;
		const userId = req.body.userId;

		if (!image || !mask || !prompt || !userId) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		// Convert base64 images to Buffers
		const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
		const maskBuffer = Buffer.from(mask.replace(/^data:image\/\w+;base64,/, ""), "base64");

		// Construct FormData
		const formData = new FormData();
		formData.append("image_file", imageBuffer, {
			filename: "image.png",
			contentType: "image/png",
		});
		formData.append("mask_file", maskBuffer, {
			filename: "mask.png",
			contentType: "image/png",
		});
		formData.append("text_prompt", prompt);

		// Send request to Clipdrop
		const response = await axios.post("https://clipdrop-api.co/text-inpainting/v1", formData, {
			headers: {
				...formData.getHeaders(),
				"x-api-key": process.env.CLIPDROP_API,
			},
			responseType: "arraybuffer",
		});

		const base64Result = Buffer.from(response.data, "binary").toString("base64");
		const resultImage = `data:image/jpeg;base64,${base64Result}`;

		res.json({
			success: true,
			message: "Image inpainted successfully",
			resultImage,
			remainingCredits: response.headers['x-remaining-credits']
		});
	} catch (error) {
		console.error("Error inpainting image:", error?.response?.data || error.message);
		res.status(500).json({
			success: false,
			message: error?.response?.data?.error || "Failed to edit image"
		});
	}
};