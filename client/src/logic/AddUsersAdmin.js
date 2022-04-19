import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import CheckboxWrapper from "../components/FormsUI/Checkbox";
import ButtonWrapper from "../components/FormsUI/Button";
import roles from "../data/roles.json";

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
								console.log(values);
								// console.log(values["city"]);
							}}
						>
							<Form>
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<Typography>Add User Details</Typography>
									</Grid>
									<Grid item xs={6}>
										<TextfieldWrapper name="userAddress" label="User Address" />
									</Grid>
									<Grid item xs={6}>
										<TextfieldWrapper name="name" label="Name" />
									</Grid>
									<Grid item xs={6}>
										<TextfieldWrapper name="contactNo" label="Contact No" />
									</Grid>
									<Grid item xs={6}>
										<SelectWrapper name="roles" label="Roles" options={roles} />
									</Grid>
									<Grid item xs={6}>
										<TextfieldWrapper name="profileHash" label="Profile Hash" />
									</Grid>
									<Grid item xs={6}>
										<CheckboxWrapper
											name="isActive"
											legend="Activity"
											label="Active User"
										/>
									</Grid>
									<Grid item xs={12}>
										<ButtonWrapper>Submit</ButtonWrapper>
									</Grid>
								</Grid>
							</Form>
						</Formik>
					</div>
				</Container>
			</Grid>
		</Grid>

		// 	<h2>AddUsersAdmin</h2>
		// 	<p>{userInfo.userAddress}</p>
		// 	<p>{userInfo.name}</p>
		// 	<p>{userInfo.contactNo}</p>
		// 	<p>{userInfo.role}</p>
		// 	<p>{userInfo.isActive.toString()}</p>
		// 	<p>{userInfo.profileHash}</p>
		// </div>
	);
};

export default AddUsersAdmin;
