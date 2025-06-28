import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { MdOutlineDataSaverOn } from "react-icons/md";

const EditImage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { editImage, saveImage } = useContext(AppContext);

    const [prompt, setPrompt] = useState("");
    const [editedImage, setEditedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [maskDataUrl, setMaskDataUrl] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);

    // originalImage from route state or uploaded image
    const originalImage = location.state?.image || uploadedImage;

    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const ctxRef = useRef(null);
    const drawing = useRef(false);
    const saveTimeout = useRef(null);

    const getMaskStorageKey = (imgSrc) => `savedMask_${imgSrc}`;

    useEffect(() => {
        const img = imageRef.current;
        const canvas = canvasRef.current;
        if (img && canvas) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            const ctx = canvas.getContext("2d");
            ctx.lineWidth = 20;
            ctx.lineCap = "round";
            ctx.strokeStyle = "white";
            ctxRef.current = ctx;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const currentImageSrc = editedImage || originalImage;
            if (!currentImageSrc) return;

            const savedMask = localStorage.getItem(getMaskStorageKey(currentImageSrc));
            if (savedMask) {
                const maskImage = new Image();
                maskImage.onload = () => {
                    ctx.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
                    setMaskDataUrl(savedMask);
                };
                maskImage.src = savedMask;
            } else {
                ctx.fillStyle = "rgba(0,0,0,0.5)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                setMaskDataUrl(null);
            }
        }
    }, [originalImage, editedImage]);

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

    const compressImageIfNeeded = async (imageData) => {
        // Only compress if the image is larger than 1MB
        if (imageData.length > 1000000) {
            return await compressBase64Image(imageData);
        }
        return imageData;
    }

    const onSaveHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!editedImage) {
                toast.error("No image to save");
                return;
            }

            // Compress the image before saving if it's too large
            const compressedImage = await compressImageIfNeeded(editedImage);

            await saveImage({
                image: compressedImage,
                prompt: prompt
            });

            toast.success("Image saved successfully");
        } catch (error) {
            toast.error(error.message || "Failed to save image");
            console.error("Save error:", error);
        } finally {
            setLoading(false);
        }
    }

    const startDrawing = (e) => {
        drawing.current = true;
        draw(e);
    };

    const endDrawing = () => {
        drawing.current = false;
        if (!ctxRef.current) return;
        ctxRef.current.beginPath();
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            const dataUrl = canvasRef.current.toDataURL("image/png");
            setMaskDataUrl(dataUrl);

            const currentImageSrc = editedImage || originalImage;
            if (currentImageSrc) {
                localStorage.setItem(getMaskStorageKey(currentImageSrc), dataUrl);
            }
        }, 500);
    };

    const draw = (e) => {
        if (!drawing.current) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!maskDataUrl) return toast.error("Draw a mask first.");

        setLoading(true);
        try {
            const result = await editImage(editedImage || originalImage, prompt, maskDataUrl);
            setEditedImage(result);
        } catch (error) {
            toast.error("Failed to edit image: " + error.message);
        }
        setLoading(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const currentImageSrc = editedImage || originalImage;
        if (currentImageSrc) {
            localStorage.removeItem(getMaskStorageKey(currentImageSrc));
        }

        setMaskDataUrl(null);
    };

    const downloadMask = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "mask.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    // New: Handle file upload input change
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image file.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setUploadedImage(reader.result);
            setEditedImage(null);
            setPrompt("");
            setMaskDataUrl(null);
        };
        reader.readAsDataURL(file);
    };

    // If no image (neither from state nor uploaded), show upload UI
    if (!originalImage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
                <div className="lg:hidden text-center">
                    <p className="text-white">Switch to desktop to edit images !</p>
                    <button
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-full text-white mt-4 shadow-md"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>

                <div className="flex-col items-center justify-center gap-6 hidden lg:flex">

                    <h2 className="text-white text-xl mb-4">Upload an image to start editing</h2>

                    <label className="relative cursor-pointer bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:from-purple-700 hover:to-purple-900 transition-all duration-300">
                        Choose Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>

                    <button
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 transition-all duration-200 rounded-full text-white mt-4 shadow-md"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button
                className="px-4 py-2 bg-white/10 backdrop-blur-2xl text-white rounded-full hover:bg-purple-700 mb-5 flex items-center justify-between transition-all duration-300"
                onClick={() => navigate(-1)}
            >
                <span>←</span>
                <span>&nbsp;&nbsp;</span>
                <span>Back</span>
            </button>

            <form
                onSubmit={handleEdit}
                className="flex flex-col min-h-[70vh] justify-center items-center"
            >
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="relative">
                        <img
                            ref={imageRef}
                            src={editedImage || originalImage}
                            alt="Editable"
                            className="rounded sm:max-w-lg"
                        />
                        <span
                            className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? "w-full transition-all duration-[10s]" : "w-0"
                                }`}
                        />
                        <p className={!loading ? "opacity-0 text-white" : "opacity-100 text-white"}>
                            {loading ? "Editing..." : ""}
                        </p>
                    </div>

                    {(originalImage || editedImage) && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative shadow-md w-fit">
                                <img
                                    src={editedImage || originalImage}
                                    alt="mask background"
                                    className="rounded sm:max-w-lg"
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="absolute top-0 left-0 cursor-crosshair sm:max-w-lg"
                                    onMouseDown={startDrawing}
                                    onMouseUp={endDrawing}
                                    onMouseMove={draw}
                                    onMouseLeave={endDrawing}
                                />
                            </div>

                            <div className="flex gap-4 mt-2">
                                <button
                                    type="button"
                                    onClick={clearCanvas}
                                    className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-800"
                                >
                                    Clear Drawing
                                </button>
                                <button
                                    type="button"
                                    onClick={downloadMask}
                                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-800"
                                >
                                    Download Mask
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-xl flex justify-center items-center gap-4 mt-8">
                    <div className="flex w-full max-w-xl bg-white text-black text-sm p-0.5 rounded-full">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your edit..."
                            className="flex-1 bg-transparent outline-none mx-4 max-sm:w-20"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-700 hover:bg-purple-900 transition-colors text-white px-4 sm:px-10 py-3 rounded-full"
                        >
                            {loading ? "Editing..." : "Edit"}
                        </button>
                    </div>
                </div>

                {editedImage && (
                    <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
                        <a
                            href={editedImage}
                            download="edited-image.jpg"
                            className="flex justify-center items-center bg-purple-700 hover:bg-purple-900 transition-colors px-8 py-3 rounded-full cursor-pointer"
                        >
                            Download
                        </a>
                        <button className="bg-transparent border bg-slate-500 text-white p-4 rounded-full cursor-pointer flex justify-center items-center hover:bg-white group transition-colors" onClick={onSaveHandler}>
                            <MdOutlineDataSaverOn className="text-white text-base group-hover:text-black transition-colors" />
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default EditImage;
