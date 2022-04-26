import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikField from "../components/FormikMUI/FormikField";
import { Button, Container, Grid, Typography } from "@mui/material";
import FormikSelect from "../components/FormikMUI/FormikSelect";
import FormikCheckbox from "../components/FormikMUI/FormikCheckbox";

const initialValues = {
	userAddress: "",
	name: "",
	email: "",
	role: "",
	isActive: false,
	profileHash: "",
};

const valSchema = Yup.object().shape({
	userAddress: Yup.string()
		.required("Requerido")
		.max(42, "Las direcciones de Metamask tienen un maximo de 42 caracteres")
		.min(42),

	name: Yup.string().required("Requerido").min(2, "Ingresa el nombre completo"),
	email: Yup.string().required("Requerido"),
	role: Yup.string().required("Requerido"),
	isActive: Yup.boolean().required("requerido"),
	profileHash: Yup.string(),
});

const role = [
	{
		label: "FARMER",
		value: "FARMER",
	},
	{
		label: "PROCESSOR",
		value: "PROCESSOR",
	},
	{
		label: "GRAIN_INSPECTOR",
		value: "GRAIN_INSPECTOR",
	},
	{
		label: "AGGLOMERATOR",
		value: "AGGLOMERATOR",
	},
	{
		label: "SHIPPER_PACKER",
		value: "SHIPPER_PACKER",
	},
	{
		label: "PACKER",
		value: "PACKER",
	},
	{
		label: "SHIPPER_RETAILER",
		value: "SHIPPER_RETAILER",
	},
	{
		label: "RETAILER",
		value: "RETAILER",
	},
];

const FormUser = () => {
	const handlerSubmit = (values) => {
		console.log(JSON.stringify(values));
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Container maxWidth="md">
					<div>
						<Typography variant="h6">Add User Details</Typography>
						<Formik
							initialValues={initialValues}
							validationSchema={valSchema}
							onSubmit={handlerSubmit}
						>
							{({ dirty, isValid }) => {
								return (
									<Form>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<FormikField
													name="userAddress"
													label="User Address"
													required
												/>
											</Grid>
											<Grid item xs={6}>
												<FormikField name="name" label="Name" required />
											</Grid>

											<Grid item xs={6}>
												<FormikField name="email" label="Contact No" required />
											</Grid>

											<Grid item xs={6}>
												<FormikSelect
													name="role"
													items={role}
													label="Role"
													required
												/>
											</Grid>

											<Grid item xs={6}>
												<FormikCheckbox
													name="isActive"
													label="Active User"
													legend="Activity"
													required
												/>
											</Grid>

											<Grid item xs={6}>
												<FormikField name="profileHash" label="Profile Hash" />
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

export default FormUser;
