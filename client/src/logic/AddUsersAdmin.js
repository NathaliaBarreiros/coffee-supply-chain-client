import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import CheckboxWrapper from "../components/FormsUI/Checkbox";
import ButtonWrapper from "../components/FormsUI/Button";
import role from "../data/roles.json";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const INITIAL_FORM_USER_STATE = {
	userAddress: "",
	name: "",
	email: "",
	role: "",
	isActive: false,
	profileHash: "",
};

const FORM_USER_VALIDATION = Yup.object().shape({
	userAddress: Yup.string()
		.required("Requerido")
		.max(42, "Las direcciones de Metamask tienen un máximo de 42 caracteres")
		.min(42),

	name: Yup.string().required("Requerido").min(2, "Ingresa el nombre completo"),
	email: Yup.string().email("Email inválido").required("Requerido"),
	role: Yup.string().required("Requerido"),
	isActive: Yup.boolean().required("requerido"),
	profileHash: Yup.string(),
});

const AddUsersAdmin = () => {
	const [userInfo, setUserInfo] = useState({
		userAddress: "-",
		name: "-",
		email: "-",
		role: "-",
		isActive: false,
		profileHash: "-",
	});
	const [userRegistered, setUserRegistered] = useState([]);

	useEffect(() => {
		// listener del evento "UserUpdate", cuando ya se registra en la blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			SupplyChainUserAddress,
			supplychainUserABI.abi,
			signer
		);
		erc20.on("UserUpdate", (user, name, email, role, isActive, profileHash) => {
			console.log("EVENTO: ");
			console.log({ user, name, email, role, isActive, profileHash });
			setUserRegistered((currentData) => [
				...currentData,
				{
					user,
					name,
					email,
					role,
					isActive,
					profileHash,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("UserUpdate");
		};
	}, []);

	const handleSubmit = async (values) => {
		//console.log(values);
		console.log(values["userAddress"]);
		console.log(values["name"]);
		console.log(values["role"]);
		console.log(values["email"]);
		console.log(values["isActive"]);
		console.log(values["profileHash"]);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		//await provider.send("eth_requestAccounts", []);
		const signer = await provider.getSigner();
		const erc20 = new ethers.Contract(
			SupplyChainUserAddress,
			supplychainUserABI.abi,
			signer
		);
		setUserInfo({
			userAddress: values["userAddress"],
			name: values["name"],
			email: values["email"],
			role: values["role"],
			isActive: values["isActive"],
			profileHash: values["profileHash"],
		});
		await erc20.updateUserForAdmin(
			values["userAddress"],
			values["name"],
			values["email"],
			values["role"],
			values["isActive"],
			values["profileHash"]
		);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Container maxWidth="md">
					<div>
						<Formik
							initialValues={{
								...INITIAL_FORM_USER_STATE,
							}}
							validationSchema={FORM_USER_VALIDATION}
							onSubmit={(values) => {
								handleSubmit(values);
							}}
						>
							{({ dirty, isValid }) => {
								return (
									<Form>
										<Grid container spacing={2}>
											<Grid item xs={12}>
												<Typography>Add User Details</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="userAddress"
													label="User Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="name" label="Name" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="email" label="Email" />
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="role"
													label="Role"
													options={role}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="profileHash"
													label="Profile Hash"
												/>
											</Grid>
											<Grid item xs={6}>
												<CheckboxWrapper
													name="isActive"
													legend="Activity"
													label="Active User"
												/>
											</Grid>
											<Grid item xs={12}>
												<Button
													fullWidth
													variant="contained"
													disabled={!dirty || !isValid}
													type="submit"
												>
													{" "}
													SUBMIT
												</Button>
											</Grid>
										</Grid>
									</Form>
								);
							}}
						</Formik>
					</div>
				</Container>
			</Grid>
		</Grid>
	);
};

export default AddUsersAdmin;
