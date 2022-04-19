import { useState, useMemo, useCallback } from "react";

const adminAddress = "0x9E733B413600444663EF0FFd8116A279D8C07D7D";

const useProvider = () => {
	const [errorMessage, setErrorMessage] = useState(null);
	const [walletAddress, setWalletAddress] = useState(null);
	const [connButtonText, setConnButtonText] = useState("Connect Wallet");
	const [isAdmin, setIsAdmin] = useState(null);

	const connectWalletHandler = async () => {
		if (window.ethereum && window.ethereum.isMetaMask) {
			console.log("Metamask Here!");
			try {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});
				accountChangedHandler(accounts[0]);
				setConnButtonText("Wallet Connected");
				adminHandler(accounts[0]);
			} catch (error) {
				setErrorMessage(error.message);
			}
		} else {
			console.log("Need to install MetaMask");
			setErrorMessage("Please install MetaMask browser extension to interact");
		}
	};

	const accountChangedHandler = (newAccount) => {
		setWalletAddress(newAccount);
	};

	const adminHandler = (newAccount) => {
		if (newAccount.toString().toUpperCase() === adminAddress.toUpperCase()) {
			setIsAdmin(true);
		} else {
			setIsAdmin(false);
		}
	};

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	};

	const handleClickMetamask = () => {
		window.open("https://metamask.io/download/");
	};

	// listen for account changes
	window.ethereum.on("accountsChanged", accountChangedHandler);

	window.ethereum.on("chainChanged", chainChangedHandler);

	window.removeEventListener("accountsChanged", accountChangedHandler);
	window.removeEventListener("chainChanged", chainChangedHandler);

	// console.log(isAdmin);

	return {
		walletAddress,
		errorMessage,
		connButtonText,
		connectWalletHandler,
		handleClickMetamask,
		isAdmin,
	};
};

export default useProvider;
