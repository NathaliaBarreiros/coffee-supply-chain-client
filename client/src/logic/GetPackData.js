import React, { useState } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Container, Grid, Typography } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import supplychainUserABI from "../contracts/SupplyChainUser.json";
import coffeeSupplyChainABI from "../contracts/CoffeeSupplyChain.json";
const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const initialValues = {
	batchNo: "",
};

const valSchema = Yup.object().shape({
	batchNo: Yup.string().required("Requerido"),
});

const GetPackData = () => {
	const [packInfo, setPackInfo] = useState({
		packAddress: "",
		arrivalDateP: "",
		packDate: "",
		packPrice: "",
	});
	const askPacker = async (values) => {
		console.log("PACKER INFO");
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			CoffeeSupplyChainAddress,
			coffeeSupplyChainABI.abi,
			signer
		);

		try {
			const info = await erc20.callStatic.getFarmDetails(values["batchNo"]);
			console.log(info);
			setPackInfo({
				packAddress: info["packAddress"],
				arrivalDateP: info["arrivalDateP"],
				packDate: info["packDate"],
				packPrice: info["packPrice"],
			});
		} catch (error) {
			console.log("ERROR AT GETTING PACKER INFO: ", error);
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
								askPacker(values);
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
													GET PACKAGING DATA
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

export default GetPackData;
