import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";
import transportTypeR from "../data/transportTypeR.json";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";

const initialValues = {
	batchNo: "",
	transportTypeR: "",
	pickupDateR: "",
	shipPriceR: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La dirección debe tener maximo 42 caracteres")
		.min(42),
	transportTypeR: Yup.string().required("Requerido"),
	pickupDateR: Yup.date().required("Requerido"),
	shipPriceR: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
});

const AddShipRetailerData = () => {
	const [shipRetailerData, setShipRetailerData] = useState({
		batchNo: "-",
		transportTypeR: "-",
		pickupDateR: "-",
		shipPriceR: "-",
	});

	const [shipRetailerRegistered, setShipRetailerRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneShippingRetailer", (user, batchNo) => {
			console.log({ user, batchNo });
			setShipRetailerRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneShippingRetailer");
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
		setShipRetailerData({
			batchNo: values["batchNo"],
			transportTypeR: values["transportTypeP"],
			pickupDateR: values["pickupDateP"],
			shipPriceR: values["shipPriceP"],
		});
		await erc20.addShipRetailerData(
			values["batchNo"],
			values["transportTypeR"],
			values["pickupDateR"],
			values["shipPriceR"]
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
												<Typography>Add Shipment to Retailer Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="transportTypeR"
													label="Transportation Type"
													options={transportTypeR}
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="pickupDateR"
													label="Pick Up Date at Packer"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="shipPriceR"
													label="Shipment Price"
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

export default AddShipRetailerData;
