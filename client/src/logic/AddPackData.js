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
	packAddress: "",
	arrivalDateP: "",
	packDate: "",
	packPrice: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	packAddress: Yup.string().required("Requerido"),
	arrivalDateP: Yup.date().required("Requerido"),
	packDate: Yup.date().required("Requerido"),
	packPrice: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
});

const AddPackData = () => {
	const [packData, setPackData] = useState({
		batchNo: "-",
		packAddress: "-",
		arrivalDateP: "-",
		packDate: "-",
		packPrice: "-",
	});

	const [packRegistered, setPackRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DonePackaging", (user, batchNo) => {
			console.log({ user, batchNo });
			setPackRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DonePackaging");
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
		setPackData({
			batchNo: values["batchNo"],
			packAddress: values["packAddress"],
			arrivalDateP: values["arrivalDateP"],
			packDate: values["packDate"],
			packPrice: values["packPrice"],
		});
		await erc20.addPackData(
			values["batchNo"],
			values["packAddress"],
			values["arrivalDateP"],
			values["packDate"],
			values["packPrice"]
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
												<Typography>Add Packer Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="packAddress"
													label="Packer Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="arrivalDateP"
													label="Arrival Date at Packer"
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="packDate"
													label="Packaging Date"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="packPrice"
													label="Packer Price"
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

export default AddPackData;
