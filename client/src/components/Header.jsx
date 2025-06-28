import { useContext } from "react"
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

			<h1 className="text-4xl max-w-[300px] sm:text-7xl sm:max-w-[890px] mx-auto mt-20 text-center text-white">Use Your Imagination to Create and Edit Faces</h1>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center mt-8">
				<button className="sm:text-lg text-white bg-purple-700 w-full px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10 hover:bg-purple-900 transition-colors" onClick={() => navigate("/docs")}>
					Documentation
				</button>
				<button className="sm:text-lg text-white bg-purple-700 w-full px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10 hover:bg-purple-900 transition-colors" onClick={onClickHandler}>
					Generate Face
				</button>
				{user && (
					<>
						<button className="sm:text-lg text-white bg-purple-700 w-full px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10 hover:bg-purple-900 transition-colors" onClick={() => navigate("/edit")}>
							Upload, Edit Images
						</button>
						<button className="sm:text-lg text-white bg-purple-700 w-full px-12 py-2.5 flex items-center justify-center gap-2 rounded-full relative z-10 hover:bg-purple-900 transition-colors" onClick={() => navigate("/saved")}>
							Show Saved Images
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default Header