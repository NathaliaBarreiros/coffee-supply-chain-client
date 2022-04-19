import React from "react";
import Login from "./components/Login";

import AddUsersAdmin from "./logic/AddUsersAdmin";
import GetOwner from "./logic/GetOwner";

import supplychainStorageABI from "./contracts/SupplyChainStorage.json";
import supplychainUserABI from "./contracts/SupplyChainUser.json";
import coffeeSupplychainABI from "./contracts/CoffeeSupplyChain.json";

const CoffeeSupplyChainAddress = "0xB103004b86BC26dCB6eB0e87C5B9877929d68298";
const SupplyChainUserAddress = "0x9719E9dC77A7eDD3825844c77a68c896d4a7BB2b";

function App() {
	return (
		<div>
			<Login />
			<GetOwner />
			<AddUsersAdmin />
		</div>
	);
}

export default App;
