import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import CheckboxWrapper from "../components/FormsUI/Checkbox";
import ButtonWrapper from "../components/FormsUI/Button";
import role from "../data/roles.json";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";

const CoffeeSupplyChainAddress = "0xB103004b86BC26dCB6eB0e87C5B9877929d68298";
const SupplyChainUserAddress = "0x9719E9dC77A7eDD3825844c77a68c896d4a7BB2b";

const INITIAL_FORM_USER_STATE = {
	userAddress: "",
	name: "",
	contactNo: "",
	role: "",
	isActive: false,
	profileHash: "",
};

const FORM_USER_VALIDATION = Yup.object().shape({
	userAddress: Yup.string()
		.required("Requerido")
		.max(42, "Las direcciones de Metamask tienen un maximo de 42 caracteres")
		.min(42),

	name: Yup.string().required("Requerido").min(2, "Ingresa el nombre completo"),
	contactNo: Yup.string().required("Requerido"),
	role: Yup.string().required("Requerido"),
	isActive: Yup.boolean().required("requerido"),
	profileHash: Yup.string(),
});

const AddUsersAdmin = () => {
	const [userInfo, setUserInfo] = useState({
		userAddress: "-",
		name: "-",
		contactNo: "-",
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
		erc20.on(
			"UserUpdate",
			(user, name, contactNo, role, isActive, profileHash) => {
				console.log("EVENTO: ");
				console.log({ user, name, contactNo, role, isActive, profileHash });
				setUserRegistered((currentData) => [
					...currentData,
					{
						user,
						name,
						contactNo,
						role,
						isActive,
						profileHash,
					},
				]);
			}
		);
		return () => {
			erc20.removeAllListeners("UserUpdate");
		};
	}, []);

	const handleSubmit = async (values) => {
		//console.log(values);
		console.log(values["userAddress"]);
		console.log(values["name"]);
		console.log(values["role"]);
		console.log(values["contactNo"]);
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
			contactNo: values["contactNo"],
			role: values["role"],
			isActive: values["isActive"],
			profileHash: values["profileHash"],
		});
		await erc20.updateUserForAdmin(
			values["userAddress"],
			values["name"],
			values["contactNo"],
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
												<TextfieldWrapper name="contactNo" label="Contact No" />
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
												<ButtonWrapper
													disabled={!dirty || !isValid}
													type="submit"
												>
													Submit
												</ButtonWrapper>
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
