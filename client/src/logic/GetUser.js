import { Button } from "@mui/material";
import React, { useState } from "react";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";
const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const GetUser = () => {
	const [userInfo, setUserInfo] = useState({
		//userAddress: "",
		name: "",
		email: "",
		role: "",
		isActive: "",
		profileHash: "",
	});
	const askUser = async () => {
		console.log("USER");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const account = await window.ethereum.request({
			method: "eth_requestAccounts",
		});
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			SupplyChainUserAddress,
			supplychainUserABI.abi,
			signer
		);
		console.log(typeof account);
		console.log(account[0]);

		try {
			const user = await erc20.callStatic.getUser(account[0]);
			console.log(user);
			setUserInfo({
				//userAddress: user["userAddress"],
				name: user["name"],
				email: user["email"],
				role: user["role"],
				isActive: user["isActive"],
				profileHash: user["profileHash"],
			});
			console.log("AQUI", userInfo);
		} catch (error) {
			console.log("ERROR AT GETTING USER: ", error);
		}
	};
	return (
		<div>
			<Button type="submit" variant="contained" onClick={askUser}>
				GET USER
			</Button>
		</div>
	);
};

export default GetUser;
