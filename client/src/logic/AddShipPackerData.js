import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";
import transportTypeP from "../data/transportTypeP.json";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";

const initialValues = {
	batchNo: "",
	transportTypeP: "",
	pickupDateP: "",
	shipPriceP: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	transportTypeP: Yup.string().required("Requerido"),
	pickupDateP: Yup.date().required("Requerido"),
	shipPriceP: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
});

const AddShipPackerData = () => {
	const [shipPackerData, setShipPackerData] = useState({
		batchNo: "-",
		transportTypeP: "-",
		pickupDateP: "-",
		shipPriceP: "-",
	});

	const [shipPackerRegistered, setShipPackerRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneShippingPacker", (user, batchNo) => {
			console.log({ user, batchNo });
			setShipPackerRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneShippingPacker");
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
		setShipPackerData({
			batchNo: values["batchNo"],
			transportTypeP: values["transportTypeP"],
			pickupDateP: values["pickupDateP"],
			shipPriceP: values["shipPriceP"],
		});
		await erc20.addShipPackerData(
			values["batchNo"],
			values["transportTypeP"],
			values["pickupDateP"],
			values["shipPriceP"]
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
												<Typography>Add Shipment to Packer Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="transportTypeP"
													label="Transportation Type"
													options={transportTypeP}
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="pickupDateP"
													label="Pick Up Date at Agglomerator"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="shipPriceP"
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

export default AddShipPackerData;
