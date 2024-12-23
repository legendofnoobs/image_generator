import { useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { useContext } from "react"
import { AppContext } from "../context/AppContext"

const Description = () => {
	const navigate = useNavigate()

	const {user, setShowLogin} = useContext(AppContext)

	const onClickHandler = () => {
		if (user) {
			navigate("/result")
		}else{
			setShowLogin(true)
		}
	}
	return (
		<div className="flex flex-col items-center justify-center mt-24 p-6 md:px-28">
			<h1 className="text-3xl sm:text-4xl font-semibold mb-2">Create AI Images</h1>
			<p className="text-gray-500 mb-8">Turn your imagination into visuals</p>
			<div className="flex flex-col gap-5 md:gap-14 md:flex-row items-center mb-16">
				<img src={assets.sample_img_1} alt="sample" className="w-80 xl:w-96 rounded-lg"/>
				<div>
					<h2 className="text-3xl font-medium max-w-lg mb-4">Introducing the AI-Powered Text to Image Generator</h2>
					<p className="text-gray-600 mb-4">Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.</p>
					<p className="text-gray-600">Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don’t yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!</p>
				</div>
			</div>
			<div className="flex flex-col gap-5 items-center mb-16">
				<h2 className="text-3xl sm:text-4xl font-semibold mb-2">See the Magic</h2>
				<button className="sm:text-lg text-white bg-black w-auto mt-1 px-12 py-2.5 flex items-center justify-center gap-2 rounded-full" onClick={onClickHandler}>
					Generate Images
					<img src={assets.star_group} alt="star group" className="h-6"/>
				</button>
			</div>
		</div>
	)
}

export default Description