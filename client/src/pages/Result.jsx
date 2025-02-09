import { useContext, useState } from "react"
import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"

const Result = () => {

	const [image, setImage] = useState(assets.sample_img_1)
	const [isImageLoaded, setIsImageLoaded] = useState(false)
	const [loading, setLoading] = useState(false)
	const [input, setInput] = useState("")

	const { generateImage } = useContext(AppContext);

	const onSubmitHandler = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (input) {
			const image = await generateImage(input)
			if (image) {
				setIsImageLoaded(true)
				setImage(image);
			}
		}
		setLoading(false);
	}

	return (
		<form onSubmit={onSubmitHandler} className="flex flex-col min-h-[80vh] justify-center items-center">
			<div>
				<div className="relative">
					<img src={image} alt="image" className="max-w-md rounded" />
					<span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? "w-full transition-all duration-[10s]" : "w-0"}`} />
				</div>
				<p className={!loading ? "opacity-0 text-white" : "opacity-100 text-white"}>
					Loading...
				</p>
			</div>
			{!isImageLoaded &&
				<div className="flex w-full max-w-xl bg-white text-black text-sm p-0.5 mt-10 rounded-full">
					<input onChange={e => setInput(e.target.value)} type="text" placeholder="Enter prompt" className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20" />
					<button className="bg-[#5500FF] text-white px-10 sm:px-16 py-3 rounded-full">Generate</button>
				</div>
			}
			{isImageLoaded &&
				<div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
					<p onClick={() => { setIsImageLoaded(false) }} className="bg-transparent border bg-slate-500 text-white px-8 py-3 rounded-full cursor-pointer">Generate Another</p>
					<a href={image} download className="bg-zinc-900 px-8 py-3 rounded-full cursor-pointer">Download</a>
				</div>
			}
		</form>
	)
}

export default Result