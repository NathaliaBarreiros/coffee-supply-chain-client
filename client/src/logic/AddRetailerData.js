import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";

const initialValues = {
	batchNo: "",
	arrivalDateW: "",
	arrivalDateSP: "",
	warehouseName: "",
	warehouseAddress: "",
	salePointAddress: "",
	shipPriceSP: "",
	productPrice: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	arrivalDateW: Yup.date().required("Requerido"),
	arrivalDateSP: Yup.date().required("Requerido"),
	warehouseName: Yup.string().required("Requerido"),
	warehouseAddress: Yup.string().required("Requerido"),
	salePointAddress: Yup.string().required("Requerido"),
	shipPriceSP: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
	productPrice: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
});

const AddRetailerData = () => {
	const [retailerData, setRetailerData] = useState({
		batchNo: "-",
		arrivalDateW: "-",
		arrivalDateSP: "-",
		warehouseName: "-",
		warehouseAddress: "-",
		salePointAddress: "-",
		shipPriceSP: "-",
		productPrice: "-",
	});

	const [retailerRegistered, setRetailerRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneRetailer", (user, batchNo) => {
			console.log({ user, batchNo });
			setRetailerRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneRetailer");
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
		setRetailerData({
			batchNo: values["batchNo"],
			arrivalDateW: values["arrivalDateW"],
			arrivalDateSP: values["arrivalDateSP"],
			warehouseName: values["warehouseName"],
			warehouseAddress: values["warehouseAddress"],
			salePointAddress: values["salePointAddress"],
			shipPriceSP: values["shipPriceSP"],
			productPrice: values["productPrice"],
		});
		await erc20.addRetailerData(
			values["batchNo"],
			values["arrivalDateW"],
			values["arrivalDateSP"],
			values["warehouseName"],
			values["warehouseAddress"],
			values["salePointAddress"],
			values["shipPriceSP"],
			values["productPrice"]
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
												<Typography>Add Retailer Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="arrivalDateW"
													label="Arrival Date at Warehouse"
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="arrivalDateSP"
													label="Arrival Date at Sale Point"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="warehouseName"
													label="Warehouse Name"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="warehouseAddress"
													label="Warehouse Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="Sale Point Address"
													label="Sale Point Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="shipPriceSP"
													label="Shipment Price"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="productPrice"
													label="Product Price"
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

export default AddRetailerData;
