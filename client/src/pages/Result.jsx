import { useContext, useState, useEffect, useRef } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

import { useSpeechRecognition } from "react-speech-recognition";
import SpeechRecognition from "react-speech-recognition";

import { FaMicrophone } from "react-icons/fa";
import { MdOutlineDataSaverOn } from "react-icons/md";
import { FaCircleStop } from "react-icons/fa6";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Result = () => {
	const [image, setImage] = useState(assets.sample_img_1)
	const [isImageLoaded, setIsImageLoaded] = useState(false)
	const [loading, setLoading] = useState(false)
	const [input, setInput] = useState("")
	const { generateImage, saveImage } = useContext(AppContext);
	const navigate = useNavigate();

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (input) {
			const image = await generateImage(input)
			if (image) {
				setIsImageLoaded(true)
				setImage(image);
			}
		}else{
			toast.error("Please enter a description");
		}
		setLoading(false);
	}

	const onSaveHandler = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (!image || image === assets.sample_img_1) {
				toast.error("No image to save");
				return;
			}

			// Compress the image before saving if it's too large
			const compressedImage = await compressImageIfNeeded(image);

			await saveImage({
				image: compressedImage,
				prompt: input
			});

			toast.success("Image saved successfully");
		} catch (error) {
			toast.error(error.message || "Failed to save image");
			console.error("Save error:", error);
		} finally {
			setLoading(false);
		}
	}

	const compressImageIfNeeded = async (imageData) => {
		// Only compress if the image is larger than 1MB
		if (imageData.length > 1000000) {
			return await compressBase64Image(imageData);
		}
		return imageData;
	}

	const compressBase64Image = async (base64, quality = 0.7) => {
		return new Promise((resolve) => {
			const img = new Image();
			img.src = base64;
			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				resolve(canvas.toDataURL('image/jpeg', quality));
			};
		});
	}

	const {
		interimTranscript,
		finalTranscript,
		listening,
		resetTranscript,
		browserSupportsSpeechRecognition,
	} = useSpeechRecognition();

	const lastFinalTranscriptRef = useRef("");

	const displayedText = interimTranscript ? `${input} ${interimTranscript}` : input;

	useEffect(() => {
		if (finalTranscript && finalTranscript !== lastFinalTranscriptRef.current) {
			const newWords = finalTranscript.replace(lastFinalTranscriptRef.current, "").trim();
			if (newWords) {
				setInput((prevText) => (prevText ? `${prevText} ${newWords}` : newWords));
			}
			lastFinalTranscriptRef.current = finalTranscript; // Update last stored transcript
		}
	}, [finalTranscript]);

	// When manually editing, reset the transcript to avoid unwanted additions
	const handleInputChange = (e) => {
		setInput(e.target.value);
		resetTranscript(); // Clear current recognition transcript
		lastFinalTranscriptRef.current = ""; // Reset last final transcript
	};

	if (!browserSupportsSpeechRecognition) {
		return <p>Your browser does not support speech recognition.</p>;
	}

	return (
		<div>
			<button className="px-4 py-2 bg-white/10 backdrop-blur-2xl text-white rounded-full hover:bg-purple-700 mb-5 flex items-center justify-between transition-all duration-300" onClick={() => navigate(-1)}>
				<span>←</span>
				<span>&nbsp; &nbsp;</span>
				<span>Back</span>
			</button>
			<form onSubmit={onSubmitHandler} className="flex flex-col min-h-[70vh] justify-center items-center">

				<div>
					<div className="relative">
						<img src={image} alt="image" className=" rounded sm:max-w-lg" />
						<span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? "w-full transition-all duration-[10s]" : "w-0"}`} />
					</div>
					<p className={!loading ? "opacity-0 text-white" : "opacity-100 text-white"}>
						Loading...
					</p>
				</div>
				{!isImageLoaded &&
					<div className="w-full max-w-xl flex justify-center items-center gap-4">
						<div className="flex w-full max-w-xl bg-white text-black text-sm p-0.5 rounded-full">
							<input onChange={handleInputChange} value={displayedText} type="text" placeholder="Enter a decription" className="flex-1 bg-transparent outline-none mx-4 max-sm:w-20" />
							<button className="bg-purple-700 hover:bg-purple-900 transition-colors text-white px-4 sm:px-10 py-3 rounded-full">Generate</button>
						</div>
						<div>
							{listening ? (
								<button
									onClick={(e) => {
										e.preventDefault(); // Prevent the default behavior (like submitting)
										SpeechRecognition.stopListening(); // Stop listening
									}}
									disabled={!listening}
									className="bg-purple-700 hover:bg-purple-900 transition-colors text-white px-4 py-4 rounded-full"
								>
									<FaCircleStop className="text-white text-base" />
								</button>
							) : (
								<button
									onClick={(e) => {
										e.preventDefault();
										SpeechRecognition.startListening({ continuous: true, language: "en-US" })
									}}
									disabled={listening}
									className="bg-purple-700 hover:bg-purple-900 transition-colors text-white px-4 py-4 rounded-full"
								>
									<FaMicrophone className="text-white text-base" />
								</button>
							)}

						</div>
					</div>
				}
				{isImageLoaded &&
					<div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
						<p onClick={() => { setIsImageLoaded(false) }} className="bg-transparent border bg-slate-500 text-white px-8 py-3 rounded-full cursor-pointer flex justify-center items-center hover:bg-white group transition-colors hover:text-black">Generate Another</p>
						<button className="bg-transparent border bg-slate-500 text-white p-4 rounded-full cursor-pointer flex justify-center items-center hover:bg-white group transition-colors" onClick={onSaveHandler}>
							<MdOutlineDataSaverOn className="text-white text-base group-hover:text-black transition-colors"/>
						</button>
						<a href={image} download className="flex justify-center items-center bg-purple-700 hover:bg-purple-900 transition-colors px-8 py-3 rounded-full cursor-pointer">Download</a>
					</div>
				}
			</form>
		</div>
	)
}

export default Result