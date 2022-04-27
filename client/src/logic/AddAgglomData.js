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
	agglomAddress: "",
	agglomDate: "",
	storagePrice: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	agglomAddress: Yup.string().required("Requerido"),
	agglomDate: Yup.date().required("Requerido"),
	storagePrice: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
});

const AddAgglomData = () => {
	const [agglomData, setAgglomData] = useState({
		batchNo: "-",
		agglomAddress: "-",
		agglomDate: "-",
		storagePrice: "-",
	});

	const [agglomRegistered, setAgglomRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneAgglomeration", (user, batchNo) => {
			console.log({ user, batchNo });
			setAgglomRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneAgglomeration");
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
		setAgglomData({
			batchNo: values["batchNo"],
			agglomAddress: values["agglomAddress"],
			agglomDate: values["agglomDate"],
			storagePrice: values["storagePrice"],
		});
		await erc20.addAgglomData(
			values["batchNo"],
			values["agglomAddress"],
			values["agglomDate"],
			values["storagePrice"]
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
												<Typography>Add Agglomeration Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="agglomAddress"
													label="Agglomertor Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="agglomDate"
													label="Agglomeration Date"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="storagePrice"
													label="Storage
                                                    Price"
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

export default AddAgglomData;
