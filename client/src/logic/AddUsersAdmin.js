import React, { useState, useEffect } from "react";
import { create, CID } from "ipfs-http-client";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Container, Typography, Button } from "@mui/material";
import TextfieldWrapper from "../components/FormsUI/Textfield";
import SelectWrapper from "../components/FormsUI/Select";
import CheckboxWrapper from "../components/FormsUI/Checkbox";
import ButtonWrapper from "../components/FormsUI/Button";
import role from "../data/roles.json";
import { ethers } from "ethers";
import supplychainUserABI from "../contracts/SupplyChainUser.json";

import PreviewImage from "../components/PreviewImage";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

const INITIAL_FORM_USER_STATE = {
	userAddress: "",
	name: "",
	email: "",
	role: "",
	isActive: true,
	//profileHash: "",
	profileHash: null,
};

const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg", "image/gif"];
const FILE_SIZE = 650 * 1024;

const FORM_USER_VALIDATION = Yup.object().shape({
	userAddress: Yup.string()
		.required("Requerido")
		.max(42, "Las direcciones de Metamask tienen un máximo de 42 caracteres")
		.min(42),

	name: Yup.string().required("Requerido").min(2, "Ingresa el nombre completo"),
	email: Yup.string().email("Email inválido").required("Requerido"),
	role: Yup.string().required("Requerido"),
	isActive: Yup.boolean().required("requerido"),
	//profileHash: Yup.string(),
	profileHash: Yup.mixed()
		//.required("requerido")
		//.nullable()

		.test(
			"fileSize",
			"File too large",
			(value) => value === null || (value && value.size <= FILE_SIZE)
		)
		.test(
			"type",
			"Invalid file format selection",
			(value) =>
				// console.log(value);
				!value || (value && SUPPORTED_FORMATS.includes(value?.type))
		),
});

const AddUsersAdmin = () => {
	const [userInfo, setUserInfo] = useState({
		userAddress: "-",
		name: "-",
		email: "-",
		role: "-",
		isActive: true,
		profileHash: "-",
	});
	const [userRegistered, setUserRegistered] = useState([]);
	const [images, setImages] = useState([]);
	const [url, setUrl] = useState("");

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
		// listener del evento "UserUpdate", cuando ya se registra en la blockchain
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const erc20 = new ethers.Contract(
			SupplyChainUserAddress,
			supplychainUserABI.abi,
			signer
		);
		erc20.on("UserUpdate", (user, name, email, role, isActive, profileHash) => {
			console.log("EVENTO: ");
			console.log("data", { user, name, email, role, isActive, profileHash });
			setUserRegistered((currentData) => [
				...currentData,
				{
					user,
					name,
					email,
					role,
					isActive,
					profileHash,
				},
			]);
		});

		return () => {
			erc20.removeAllListeners("UserUpdate");
		};
	}, []);

	const handleSubmit = async (values) => {
		console.log(values);

		//const uploadIPFS = async (values) => {
		if (!values["profileHash"] || values["profileHash"].length === 0) {
			console.log("No files selected!");
			values["profileHash"] = "";
			console.log(
				"profileHashHandler",
				values["profileHash"],
				"type: ",
				typeof values["profileHash"]
			);

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = await provider.getSigner();
			const erc20 = new ethers.Contract(
				SupplyChainUserAddress,
				supplychainUserABI.abi,
				signer
			);
			setUserInfo({
				userAddress: values["userAddress"],
				name: values["name"],
				email: values["email"],
				role: values["role"],
				isActive: values["isActive"],
				profileHash: values["profileHash"],
				//profileHash: url,
			});
			console.log("userinfo: ", userInfo);
			await erc20.updateUserForAdmin(
				values["userAddress"],
				values["name"],
				values["email"],
				values["role"],
				values["isActive"],
				values["profileHash"]
				//url
			);
		} else {
			console.log(
				"profileHashHandler",
				values["profileHash"],
				"type: ",
				typeof values["profileHash"]
			);
			const file = values["profileHash"];
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

			console.log(
				"profileHashHandler",
				values["profileHash"],
				"type: ",
				typeof values["profileHash"]
			);
			// console.log("images: ", images);

			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = await provider.getSigner();
			const erc20 = new ethers.Contract(
				SupplyChainUserAddress,
				supplychainUserABI.abi,
				signer
			);
			setUserInfo({
				userAddress: values["userAddress"],
				name: values["name"],
				email: values["email"],
				role: values["role"],
				isActive: values["isActive"],
				//profileHash: values["profileHash"],
				profileHash: url,
			});
			console.log("userinfo: ", userInfo);
			await erc20.updateUserForAdmin(
				values["userAddress"],
				values["name"],
				values["email"],
				values["role"],
				values["isActive"],
				//values["profileHash"]
				url
			);
		}
		//};

		// sino NO DEJA LEER PROPIEDADES DE NULL
		// if (values["profileHash"] === null) {
		// 	// console.log(
		// 	// 	"type of profile hash submit handler",
		// 	// 	typeof values["profileHash"]
		// 	// );
		// 	values["profileHash"] = "";
		// }

		// const provider = new ethers.providers.Web3Provider(window.ethereum);
		// //await provider.send("eth_requestAccounts", []);
		// const signer = await provider.getSigner();
		// const erc20 = new ethers.Contract(
		// 	SupplyChainUserAddress,
		// 	supplychainUserABI.abi,
		// 	signer
		// );
		// setUserInfo({
		// 	userAddress: values["userAddress"],
		// 	name: values["name"],
		// 	email: values["email"],
		// 	role: values["role"],
		// 	isActive: values["isActive"],
		// 	profileHash: values["profileHash"],
		// 	//profileHash: url,
		// });
		// console.log("userinfo: ", userInfo);
		// await erc20.updateUserForAdmin(
		// 	values["userAddress"],
		// 	values["name"],
		// 	values["email"],
		// 	values["role"],
		// 	values["isActive"],
		// 	values["profileHash"]
		// 	//url
		// );
	};

	return (
		<Grid container>
			<Grid item xs={12}>
				{/* <Container maxWidth="md"> */}
				<div>
					<Container maxWidth="md">
						<Formik
							initialValues={{
								...INITIAL_FORM_USER_STATE,
							}}
							validationSchema={FORM_USER_VALIDATION}
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
												<Typography>Add User Details</Typography>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper
													name="userAddress"
													label="User Address"
												/>
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="name" label="Name" />
											</Grid>
											<Grid item xs={6}>
												<TextfieldWrapper name="email" label="Email" />
											</Grid>
											<Grid item xs={6}>
												<SelectWrapper
													name="role"
													label="Role"
													options={role}
												/>
											</Grid>
											{/* <Grid item xs={6}>
											<TextfieldWrapper
												name="profileHash"
												label="Profile Hash"
											/>
										</Grid> */}

											<Grid item xs={6}>
												<label>
													Profile Hash:{" "}
													<div>
														<input
															name="profileHash"
															// label="Profile Hash"
															type="file"
															onChange={(event) => {
																setTouched({
																	...touched,
																	profileHash: true,
																});
																setFieldValue(
																	"profileHash",
																	event.target.files[0]
																);
															}}
														></input>
														{touched.profileHash && errors.profileHash ? (
															<small>{errors.profileHash}</small>
														) : null}
													</div>
												</label>
												{values.profileHash ? (
													<PreviewImage
														className={{ margin: "auto" }}
														width={100}
														height={100}
														file={values.profileHash}
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
												<CheckboxWrapper
													name="isActive"
													legend="Activity"
													label="Active User"
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

export default AddUsersAdmin;
