import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";
import typeSeeds from "../data/typeSeeds.json";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const initialValues = {
	batchNo: "",
	coffeeFamily: "",
	typeOfSeed: "",
	fertilizerUsed: "",
	harvestDate: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	coffeeFamily: Yup.string().required("Requerido"),
	typeOfSeed: Yup.string().required("Requerido"),
	fertilizerUsed: Yup.string().required("Requerido"),
	harvestDate: Yup.date().required("Requerido"),
});
const AddHarvestData = () => {
	const [harvestData, setHarvestData] = useState({
		batchNo: "-",
		coffeeFamily: "-",
		typeOfSeed: "-",
		fertilizerUsed: "-",
		harvestDate: "-",
	});

	const [harvestRegistered, setHarvestRegistered] = useState([]);

	useEffect(() => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplychainABI.abi,
			signer
		);
		erc20.on("DoneHarvesting", (user, batchNo) => {
			console.log({ user, batchNo });
			setHarvestRegistered((currentData) => [
				...currentData,
				{
					user,
					batchNo,
				},
			]);
		});
		return () => {
			erc20.removeAllListeners("DoneHarvesting");
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
		setHarvestData({
			batchNo: values["batchNo"],
			coffeeFamily: values["coffeeFamily"],
			typeOfSeed: values["typeOfSeed"],
			fertilizerUsed: values["fertilizerUsed"],
			harvestDate: values["harvestDate"],
		});
		await erc20.addHarvestData(
			values["batchNo"],
			values["coffeeFamily"],
			values["typeOfSeed"],
			values["fertilizerUsed"],
			values["harvestDate"]
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
												<Typography>Add Harvest Data</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="coffeeFamily"
													label="Coffee Family"
												/>
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="typeOfSeed"
													label="Type Of Seed"
													options={typeSeeds}
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="fertilizerUsed"
													label="Fertilizer Used"
												/>
											</Grid>
											<Grid item xs={6}>
												<DateTimePicker
													name="harvestDate"
													label="Harvest Date"
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

export default AddHarvestData;
