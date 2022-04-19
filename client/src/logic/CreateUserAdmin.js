import {
	FormControlLabel,
	FormGroup,
	Input,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import useDetectProvider from "../hooks/useDetectProvider";

const adminAddress = "0x9E733B413600444663EF0FFd8116A279D8C07D7D";
const CreateUserAdmin = () => {
	const [walletAddress, requestAccount] = useDetectProvider();
	const [userInfoAdmin, setUserInfoAdmin] = useState({
		userAddress: "",
		userNAme: "",
		userContactNo: "",
		userRole: "",
		userIsActive: false,
		userProfileHash: "",
	});

	console.log(walletAddress.toUpperCase());
	if (walletAddress.toUpperCase()) {
		return "yes";
	} else {
		return "no";
	}

	// const isEqual = () =>
	// 	walletAddress.toUpperCase() === adminAddress.toUpperCase() ? "YES" : "NO";
	// console.log(isEqual());

	return (
		<div>
			<Typography variant="h6" color="initial">
				ADMIN
			</Typography>
			<FormGroup>
				<TextField
					id="userAddress"
					label="User Address"
					variant="filled"
				></TextField>
				<Input fullWidth placeholder="User Name"></Input>
				<Input fullWidth placeholder="User Contact No"></Input>
				<Input fullWidth placeholder="User Role"></Input>
				<FormControlLabel control={<Switch />} label="User is Active" />
				{/* <Switch /> */}
				<Input fullWidth placeholder="User Profile Hash"></Input>
			</FormGroup>
		</div>
	);
};

export default CreateUserAdmin;
