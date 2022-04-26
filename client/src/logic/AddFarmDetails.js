import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikField from "../components/FormikMUI/FormikField";
import { Button, Container, Grid, Typography } from "@mui/material";
import { ethers } from "ethers";
import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const initialValues = {
	registrationNo: "",
	farmName: "",
	latitude: "",
	longitude: "",
	farmAddress: "",
};

const valSchema = Yup.object().shape({
	registrationNo: Yup.string().required("Requerido"),
	farmName: Yup.string().required("Requerido"),
	latitude: Yup.string().required("Requerido"),
	longitude: Yup.string().required("Requerido"),
	farmAddress: Yup.string().required("Requerido"),
});

const AddFarmDetails = () => {
	const [farmDetails, setFarmDetails] = useState({
		registrationNo: "-",
		farmName: "-",
		latitude: "-",
		longitude: "-",
		farmAddress: "-",
	});

	const [farmRegisteredData, setFarmRegisteredData] = useState([]);

	useEffect(() => {
		// escucho el evento con erc20.on("Evento"), en este caso el evento regresa el user que hizo la tx y el # del batch creado
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("SetFarmDetails", (user, batchNo) => {
			console.log({ user, batchNo });
			setFarmRegisteredData((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("SetFarmDetails");
		};
	}, []);

	const handleSubmit = async (values) => {
		console.log(values);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		await provider.send("eth_requestAccounts", []);
		const signer = await provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		setFarmDetails({
			registrationNo: values["registrationNo"],
			farmName: values["farmName"],
			latitude: values["latitude"],
			longitude: values["longitude"],
			farmAddress: values["farmAddress"],
		});
		await erc20.addFarmDetails(
			values["registrationNo"],
			values["farmName"],
			values["latitude"],
			values["longitude"],
			values["farmAddress"]
		);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Container maxWidth="md">
					<div>
						<Typography variant="h6">Add Farm Details</Typography>
						<Formik
							initialValues={initialValues}
							validationSchema={valSchema}
							onSubmit={(values) => {
								handleSubmit(values);
							}}
						>
							{({ dirty, isValid }) => {
								return (
									<Form>
										<Grid container spacing={2}>
											<Grid item xs={6}>
												<FormikField
													name="registrationNo"
													label="Registration No"
													required
												/>
											</Grid>
											<Grid item xs={6}>
												<FormikField
													name="farmName"
													label="Farm Name"
													required
												/>
											</Grid>
											<Grid item xs={6}>
												<FormikField
													name="latitude"
													label="Latitude"
													required
												/>
											</Grid>
											<Grid item xs={6}>
												<FormikField
													name="longitude"
													label="Longitude"
													required
												/>
											</Grid>
											<Grid item xs={6}>
												<FormikField
													name="farmAddress"
													label="Farm Address"
													required
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

export default AddFarmDetails;
