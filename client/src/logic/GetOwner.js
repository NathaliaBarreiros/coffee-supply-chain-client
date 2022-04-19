import {
	FormControlLabel,
	FormGroup,
	Input,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";

const CoffeeSupplyChainAddress = "0xB103004b86BC26dCB6eB0e87C5B9877929d68298";
const SupplyChainUserAddress = "0x9719E9dC77A7eDD3825844c77a68c896d4a7BB2b";

const CreateUserAdmin = () => {
	const [owner, setOwner] = useState();

	const askOwner = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const erc20User = new ethers.Contract(
			SupplyChainUserAddress,
			supplychainUserABI.abi,
			provider
		);
		const ownerAddress = await erc20User.owner();
		setOwner(ownerAddress);
		console.log(owner);
	};

	return (
		<div>
			<button onClick={askOwner} type="submit">
				Get Owner
			</button>
		</div>
	);
};

export default CreateUserAdmin;
