import React, { useState } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Container, Grid, Typography } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import coffeeSupplyChainABI from "../contracts/CoffeeSupplyChain.json";
const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";

const initialValues = {
	batchNo: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string().required("Requerido"),
});

const GetFarmDetails = () => {
	const [farmInfo, setFarmInfo] = useState({
		registrationNo: "",
		farmName: "",
		latitude: "",
		longitude: "",
		farmAddress: "",
	});

	const askFarm = async (values) => {
		console.log("FARM DETAILS");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		// const account = await window.ethereum.request({
		// 	method: "eth_requestAccounts",
		// });
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplyChainABI.abi,
			signer
		);

		try {
			const farmer = await erc20.callStatic.getFarmDetails(values["batchNo"]);
			console.log(farmer);
			setFarmInfo({
				registrationNo: farmer["registrationNo"],
				farmName: farmer["farmName"],
				latitude: farmer["latitude"],
				longitude: farmer["longitude"],
				farmAddress: farmer["farmAddress"],
			});
		} catch (error) {
			console.log("ERROR AT GETTING FARM DETAILS: ", error);
		}
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
								askFarm(values);
							}}
						>
							{({ dirty, isValid }) => {
								return (
									<Form>
										<Grid container spacing={2}>
											<Grid item xs={12}>
												<TextfieldWrapper name="batchNo" label="Batch No" />
											</Grid>
											<Grid item xs={12}>
												<Button
													fullWidth
													variant="contained"
													disabled={!dirty || !isValid}
													type="submit"
												>
													{" "}
													GET FARM DETAILS
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

export default GetFarmDetails;
