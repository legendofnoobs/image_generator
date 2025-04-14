import { useContext } from "react"
//import { assets } from "../assets/assets"
import { AppContext } from "../context/AppContext"
import { useNavigate } from "react-router-dom"

const Header = () => {

	const navigate = useNavigate()

	const { user, setShowLogin } = useContext(AppContext)

	const onClickHandler = () => {
		if (user) {
			navigate("/result")
		} else {
			setShowLogin(true)
		}
	}

	return (
		<div className="flex flex-col justify-center items-center text-center my-20">

			{/* <div className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-b-neutral-500">
				<p>Best text to image generator</p>
				<img src={assets.star_icon} alt="star icon"/>
			</div> */}
			<h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[890px] mx-auto mt-20 text-center text-white">Use Your Imagination to Create and Edit Faces</h1>

			{/* <p className="mx-auto mt-10 text-center max-w-xl">Unleash your creativity with AI. Turn your imagination into visual art in seconds – just type, and watch the magic happen.</p> */}

			<button className="sm:text-lg text-white bg-purple-700 w-auto mt-8 px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10" onClick={onClickHandler}>
				Generate Images
			</button>
			{user &&
				<button className="sm:text-lg text-white bg-purple-700 w-auto mt-4 px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10" onClick={() => navigate("/saved")}>
					Show Saved Images
				</button>
			}

			{/* <div className="flex flex-wrap justify-center mt-16 gap-3">
				{Array(6).fill('').map((item, index)=>{
					return(
						<img src={index % 2 === 0 ? assets.sample_img_2: assets.sample_img_1} alt="image" key={index} width={70} className="rounded hover:scale-105 duration-300 cursor-pointer max-sm:w-10"/>
					)
				})}
			</div> */}
			{/* <p className="mt-2 text-neutral-600">Generated images from Forenis</p> */}
		</div>
	)
}

export default Header