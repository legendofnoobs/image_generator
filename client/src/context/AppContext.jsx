/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
	const [showLogin, setShowLogin] = useState(false);
	const [user, setUser] = useState(false);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [credit, setCredit] = useState(false);

	// const backendUrl = "http://localhost:4000";
	// const backendUrl = "https://image-generator-t526.vercel.app";
	const backendUrl = import.meta.env.VITE_BACKEND_URL

	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			// Fetch user info if token exists
			const fetchUser = async () => {
				try {
					const { data } = await axios.get(backendUrl + "/api/user/auth", {
						headers: { token },
					});
					if (data.success) {
						setCredit(data.credits);
						setUser(data.user);
					} else {
						setUser(null);
						setCredit(false);
					}
				} catch (error) {
					setUser(null);
					setCredit(false);
					console.log(error);
				}
			};
			fetchUser();
		} else {
			setUser(null);
			setCredit(false);
		}
	}, [token]);

	const generateImage = async (prompt) => {
		try {
			const { data } = await axios.post(
				backendUrl + "/api/image/generate-image",
				{ prompt },
				{ headers: { token } }
			);
			if (data.success) {
				// loadCreditData();
				return data.resultImage;
			} else {
				toast.error(data.message);
				// loadCreditData()
				if (data.creditBalance === 0) {
					navigate("/buyCredit");
				}
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const saveImage = async (imageData) => {
		try {
			const { data } = await axios.post(
				backendUrl + "/api/image/save",
				imageData,
				{ headers: { token } }
			);

			if (data.success) {
				// loadCreditData();
				return data;
			}
		} catch (error) {
			toast.error(error.message);
			throw error;
		}
	};

	const editImage = async (image, prompt, mask) => {
		try {
			const { data } = await axios.post(
				backendUrl + "/api/image/edit",
				{ image, prompt, mask },
				{ headers: { token } }
			);

			if (data.success) {
				return data.resultImage;
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			toast.error(error.message);
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken("");
		setUser(null);
		navigate("/");
	};

	useEffect(() => {
		if (token) {
			// loadCreditData();
		}
	}, [token]);

	const value = {
		user,
		setUser,
		showLogin,
		setShowLogin,
		backendUrl,
		token,
		setToken,
		credit,
		setCredit,
		// loadCreditData,
		logout,
		generateImage,
		saveImage,
		editImage,
	};
	return (
		<AppContext.Provider value={value}>{props.children}</AppContext.Provider>
	);
};

export default AppContextProvider;
