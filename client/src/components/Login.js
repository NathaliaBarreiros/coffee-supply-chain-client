import React from "react";
import { Button, Container, Paper, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/Styles";
import useProvider from "../hooks/useProvider";

const Login = () => {
	const {
		walletAddress,
		errorMessage,
		connButtonText,
		connectWalletHandler,
		handleClickMetamask,
	} = useProvider();

	return (
		<ThemeProvider theme={theme}>
			<Container
				sx={{
					maxWidth: "800px",
				}}
			>
				<Paper
					sx={{
						marginTop: "10rem",
						marginLeft: "2rem",
					}}
				>
					<Typography variant="h3" color="initial">
						Login
					</Typography>
					<Button onClick={connectWalletHandler} variant="outlined">
						{connButtonText}
					</Button>
					<div>
						<Typography variant="h5"> Address: {walletAddress}</Typography>
					</div>
					<Button onClick={handleClickMetamask} variant="outlined">
						Get Metamask
					</Button>
					{errorMessage}
				</Paper>
			</Container>
		</ThemeProvider>
	);
};

export default Login;
