import React from "react";
import Login from "./components/Login";

import AddUsersAdmin from "./logic/AddUsersAdmin";
import GetOwner from "./logic/GetOwner";
import AddFarmDetails from "./logic/AddFarmDetails";

import FormUser from "./logic/FormUser";

import UpdateUser from "./logic/UpdateUser";

import GetUser from "./logic/GetUser";

import AddHarvestData from "./logic/AddHarvestData";

import AddProcessData from "./logic/AddProcessData";

import AddGrainData from "./logic/AddGrainData";

import AddAgglomData from "./logic/AddAgglomData";

import AddShipPackerData from "./logic/AddShipPackerData";

import AddPackData from "./logic/AddPackData";

import AddShipRetailerData from "./logic/AddShipRetailerData";

import AddRetailerData from "./logic/AddRetailerData";

import GetFarmDetails from "./logic/GetFarmDetails";

import supplychainStorageABI from "./contracts/SupplyChainStorage.json";
import supplychainUserABI from "./contracts/SupplyChainUser.json";
import coffeeSupplychainABI from "./contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534";
const SupplyChainUserAddress = "0x8c3ADb90d52223eAf8C5BeD5a6D44da08d4b0BaE";

function App() {
	return (
		<div>
			<Login />
			<GetOwner />
			<AddUsersAdmin />
			<UpdateUser />
			<AddFarmDetails />
			<GetUser />
			<AddHarvestData />
			<AddProcessData />
			<AddGrainData />
			<AddAgglomData />
			<AddShipPackerData />
			<AddPackData />
			<AddShipRetailerData />
			<AddRetailerData />
			<GetFarmDetails />
		</div>
	);
}

export default App;
