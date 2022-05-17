import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { create } from "ipfs-http-client";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import DateTimePicker from "../components/FormsUI/DateTimePicker";
import typeDrying from "../data/typeDrying.json";
import typeRoasting from "../data/typeRoasting.json";

import coffeeSupplychainABI from "../contracts/CoffeeSupplyChain.json";

import PreviewImage from "../components/PreviewImage";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const initialValues = {
	batchNo: "",
	procAddress: "",
	typeOfDrying: "",
	// roastImageHash: "",
	roastImageHash: undefined,
	roastTemp: "",
	typeOfRoast: "",
	roastDate: "",
	millDate: "",
	processorPrice: "",
};

const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
const FILE_SIZE = 650 * 1024;

const valSchema = Yup.object().shape({
	batchNo: Yup.string()
		.required("Requerido")
		.max(42, "La direccion debe tener maximo 42 caracteres")
		.min(42),
	procAddress: Yup.string().required("Requerido"),
	typeOfDrying: Yup.string().required("Requerido"),
	// roastImageHash: Yup.string().required("Requerido"),
	roastImageHash: Yup.mixed()
		.required("requerido")
		.test(
			"fileSize",
			"File too large",
			(value) => value === null || (value && value.size <= FILE_SIZE)
		)
		.test(
			"type",
			"Invalid file format selection",
			(value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
		),
	roastTemp: Yup.string().required("Requerido"),
	typeOfRoast: Yup.string().required("Requerido"),
	roastDate: Yup.date().required("Requerido"),
	millDate: Yup.date().required("Requerido"),
	processorPrice: Yup.number()
		.typeError("Por favor ingrese un precio correcto")
		.required("Requerido"),
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

	const [images, setImages] = useState([]);

	let ipfs;
	try {
		ipfs = create({
			url: "https://ipfs.infura.io:5001/api/v0",
			// headers: {
			// 	authorization,
			// },
		});
		//console.log(authorization);
		//console.log("CONECTED");
		//console.log("ipfs", ipfs);
	} catch (error) {
		console.error("IPFS error ", error);
		ipfs = undefined;
	}

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

		const file = values["roastImageHash"];
		const result = await ipfs.add(file);

		const url = `https://ipfs.infura.io/ipfs/${result.path}`;
		console.log("url: ", url, "url stype: ", typeof url);

		const uniquePaths = new Set([
			...images.map((image) => image.path),
			result.path,
		]);

		const uniqueImages = [...uniquePaths.values()].map((path) => {
			return [
				...images,
				{
					cid: result.cid,
					path: result.path,
				},
			].find((image) => image.path === path);
		});

		// setImages([
		// 	...images,
		// 	{
		// 		cid: result.cid,
		// 		path: result.path,
		// 	},
		// ]);
		setImages(uniqueImages);

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
			// roastImageHash: values["roastImageHash"],
			roastImageHash: url,
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
			// values["roastImageHash"],
			url,
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
				{/* <Container maxWidth="md"> */}
				<div>
					<Container maxWidth="md">
						<Formik
							initialValues={initialValues}
							validationSchema={valSchema}
							onSubmit={(values) => {
								handleSubmit(values);
							}}
						>
							{({
								dirty,
								isValid,
								setTouched,
								setFieldValue,
								touched,
								errors,
								values,
							}) => {
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
												{/* <TextfieldWrapper
													name="roastImageHash"
													label="Roasting Image Hash"
												/> */}
												<label>
													Roasting Image Hash:{" "}
													<div>
														<input
															name="roastImageHash"
															// label="Profile Hash"
															type="file"
															onChange={(event) => {
																setTouched({
																	...touched,
																	roastImageHash: true,
																});
																setFieldValue(
																	"roastImageHash",
																	event.target.files[0]
																);
															}}
														></input>
														{touched.roastImageHash && errors.roastImageHash ? (
															<small>{errors.roastImageHash}</small>
														) : null}
													</div>
												</label>
												{values.roastImageHash ? (
													<PreviewImage
														className={{ margin: "auto" }}
														width={100}
														height={100}
														file={values.roastImageHash}
													/>
												) : null}

												<div>
													{images.map((image, index) => (
														<img
															alt={`Uploaded #${index + 1}`}
															src={"https://ipfs.infura.io/ipfs/" + image.path}
															style={{ maxWidth: "200px", margin: "14px" }}
															key={image.cid.toString() + index}
														/>
													))}
												</div>
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
					</Container>
				</div>
				{/* </Container> */}
			</Grid>
		</Grid>
	);
};

export default AddProcessData;
