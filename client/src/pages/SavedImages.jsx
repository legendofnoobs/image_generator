import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const SavedImages = () => {
    const { token } = useContext(AppContext);
    const [savedImages, setSavedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // https://image-generator-t526.vercel.app
    // http://localhost:4000

    useEffect(() => {
        const fetchSavedImages = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:4000/api/image/saved", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        token,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    setSavedImages(data.savedImages);
                } else {
                    toast.error(data.message || "Failed to fetch saved images");
                }
            } catch (error) {
                console.error("Error fetching saved images:", error);
                toast.error("Error fetching saved images");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchSavedImages();
        }
    }, [token]);

    const unsaveImage = async (imageId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/image/unsave/${imageId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    token,
                },
            });

            const data = await response.json();

            if (data.success) {
                setSavedImages((prev) => prev.filter((img) => img._id !== imageId));
                toast.success("Image unsaved successfully");
            } else {
                toast.error(data.message || "Failed to unsave image");
            }
        } catch (error) {
            toast.error("Error unsaving image");
            console.error("Unsave error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-50  m-auto mb-20">
            <button className="px-4 py-2 bg-white/10 backdrop-blur-2xl text-white rounded-full hover:bg-purple-600 mb-5 flex items-center justify-between transition-all duration-300" onClick={()=>navigate(-1)}>
                <span>←</span>
                <span>&nbsp; &nbsp;</span>
                <span>Back</span>
            </button>
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <Loader/>
                </div>
            ) : (
                <div className="flex flex-col gap-4 m-auto">
                    {savedImages.length > 0 ? (
                        savedImages.map((image) => (
                            <div
                                key={image._id}
                                className="flex flex-col sm:flex-row items-center border border-zinc-400 gap-x-4 p-3 rounded-lg bg-zinc-800 hover:scale-105 duration-300 transition-all cursor-default max-w-4xl w-full m-auto"
                            >
                                <img src={image.image} alt="Saved" className="sm:w-56 w-full h-auto rounded-lg" />
                                <div className="flex flex-col justify-between gap-2 text-white mt-2 sm:mt-0 w-full h-full">
                                    <p className="text-white break-words"><span className="font-bold">The Prompt:</span> <br />{image.prompt}</p>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => unsaveImage(image._id)}
                                            className="text-red-500 border border-red-500 p-2 rounded-lg hover:bg-red-500 hover:text-white duration-300 transition-all"
                                        >
                                            Unsave
                                        </button>
                                        <a
                                            href={image.image}
                                            download={`image-${image._id}.jpg`}
                                            className="text-blue-500 border border-blue-500 p-2 rounded-lg hover:bg-blue-500 hover:text-white duration-300 transition-all"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white pl-4">No saved images found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SavedImages;
