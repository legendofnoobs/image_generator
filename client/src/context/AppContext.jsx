/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props)=>{
	const [showLogin, setShowLogin] = useState(false);
	const [user, setUser] = useState(false);
	const [token, setToken] = useState(localStorage.getItem('token'));
	const [credit, setCredit] = useState(false)
	
	// const backendUrl = "http://localhost:4000";
	const backendUrl = "http://image-generator-t526.vercel.app";

	const navigate = useNavigate();

	const loadCreditData = async () => {
		try{
			const {data} = await axios.get(backendUrl + "/api/user/credits", {headers: {token}})
			if(data.success) {
				setCredit(data.credits);
				setUser(data.user);
			}
		}catch(error){
			console.log(error);
			toast.error(error.message);
		}
	}

	const generateImage = async (prompt)=>{
		try{
			const {data} = await axios.post(backendUrl + "/api/image/generate-image", {prompt}, {headers: {token}});
			if(data.success) {
                loadCreditData();
				return data.resultImage
            }else{
				toast.error(data.message);
				loadCreditData()
				if(data.creditBalance === 0){
					navigate('/buyCredit')
				}
			}
		}catch(error){
			toast.error(error.message);
		}
	}

	const saveImage = async (imageData) => {
		try {
			const {data} = await axios.post(
				backendUrl + "/api/image/save", 
				imageData, 
				{headers: {token}}
			);
			
			if (data.success) {
				loadCreditData();
				return data;
			}
		} catch (error) {
			toast.error(error.message);
			throw error;
		}
	}

	const logout = () =>{
		localStorage.removeItem('token');
        setToken("");
        setUser(null);
	}

	useEffect(()=>{
		if(token){
			loadCreditData();
		}
	},[token])

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
		loadCreditData,
		logout,
		generateImage,
		saveImage,
	}
	return(
		<AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
	)

}

export default AppContextProvider;