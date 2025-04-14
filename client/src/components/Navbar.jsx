// import { Link, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import {assets} from "../assets/assets"
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import logo from "../assets/designer1.png"


const Navbar = () => {

	// const {user, setShowLogin, logout, credit} = useContext(AppContext)
	const {user, setShowLogin, logout} = useContext(AppContext)

	// const navigate = useNavigate();

	return (
		<header className="flex items-center justify-between py-4 z-10 relative">
			<Link to={`/`}>
				<img src={logo} alt="logo" className="w-16"/>
			</Link>

			<div>
				{user ? (
					<div className="flex items-center gap-2 sm:gap-3">
						{/* <button onClick={()=>navigate("/buyCredit")} className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-200">
							<img src={assets.credit_star} alt="creditsStar"/>
							<p className="text-sm sm:text-xs font-medium text-gray-600">Credits Left: {credit}</p>
						</button> */}
						<p className="text-white max-sm:hidden pl-4">Hi, {user.name}</p>
						<div className="relative group">
							<img src={assets.profile_icon} alt="user" className="w-10 drop-shadow"/>
							<div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
								<ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
									<li onClick={logout} className="py-1 px-2 cursor-pointer">
										Logout
									</li>
								</ul>
							</div>
						</div>
					</div>
				) : (
				<div className="flex items-center gap-2 sm:gap-5">
					{/* <p className="cursor-pointer" onClick={()=>navigate("/buyCredit")}>Pricing</p> */}
					<button className="bg-purple-700 text-white px-7 py-2 sm:px-10 text-sm rounded-full" onClick={()=>setShowLogin(true)}>Login</button>
				</div>
				)}
			</div>
		</header>
	)
}

export default Navbar