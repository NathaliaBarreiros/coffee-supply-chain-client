import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";
import typeDrying from "../data/typeDrying.json";
import typeRoasting from "../data/typeRoasting.json";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const initialValues = {
	batchNo: "",
	procAddress: "",
	typeOfDrying: "",
	roastImageHash: "",
	roastTemp: "",
	typeOfRoast: "",
	roastDate: "",
	millDate: "",
	processorPrice: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	procAddress: Yup.string().required("Requerido"),
	typeOfDrying: Yup.string().required("Requerido"),
	roastImageHash: Yup.string().required("Requerido"),
	roastTemp: Yup.string().required("Requerido"),
	typeOfRoast: Yup.string().required("Requerido"),
	roastDate: Yup.date().required("Requerido"),
	millDate: Yup.date().required("Requerido"),
	processorPrice: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Required"),
});

const AddProcessData = () => {
	const [processData, setProcessData] = useState({
		batchNo: "-",
		procAddress: "-",
		typeOfDrying: "-",
		roastImageHash: "-",
		roastTemp: "-",
		typeOfRoast: "-",
		roastDate: "-",
		millDate: "-",
		processorPrice: "-",
	});
	const [processRegistered, setProcessRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneProcessing", (user, batchNo) => {
			console.log({ user, batchNo });
			setProcessRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneProcessing");
		};
	}, []);

	const handleSubmit = async (values) => {
		console.log(values);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = await provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		setProcessData({
			batchNo: values["batchNo"],
			procAddress: values["procAddress"],
			typeOfDrying: values["typeOfDrying"],
			roastImageHash: values["roastImageHash"],
			roastTemp: values["roastTemp"],
			typeOfRoast: values["typeOfRoast"],
			roastDate: values["roastDate"],
			millDate: values["millDate"],
			processorPrice: values["processorPrice"],
		});
		await erc20.addProcessData(
			values["batchNo"],
			values["procAddress"],
			values["typeOfDrying"],
			values["roastImageHash"],
			values["roastTemp"],
			values["typeOfRoast"],
			values["roastDate"],
			values["millDate"],
			values["processorPrice"]
		);
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				<Container maxWidth="md">
					<div>
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
											<Grid item xs={12}>
												<Typography>Add Process Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="procAddress"
													label="Processor Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="typeOfDrying"
													label="Type Of Drying"
													options={typeDrying}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="roastImageHash"
													label="Roasting Image Hash"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="roastTemp"
													label="Roasting Temperature"
												/>
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="typeOfRoast"
													label="Type Of Roasting"
													options={typeRoasting}
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker name="roastDate" label="Roast Date" />
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker name="millDate" label="Mill Date" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="processorPrice"
													label="Processor Price"
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

export default AddProcessData;
