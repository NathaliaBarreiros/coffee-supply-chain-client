import {
	FormControlLabel,
	FormGroup,
	Input,
	Switch,
	TextField,
	Typography,
	Button,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

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
			<Button onClick={askOwner} type="submit">
				Get Owner
			</Button>
		</div>
	);
};

export default CreateUserAdmin;
