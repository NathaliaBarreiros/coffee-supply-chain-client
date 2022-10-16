import { ethers } from 'ethers';
// import coffeeSupplyChainABI from '../contracts/CoffeeSupplyChain.json';
// import supplyChainUserABI from '../contracts/SupplyChainUser.json';

import coffeeSupplyChain1ABI from '../contracts/CoffeeSupplyChain1.json';
import coffeeSupplyChain2ABI from '../contracts/CoffeeSupplyChain2.json';
import supplyChainUser1ABI from '../contracts/SupplyChainUser1.json';

// export const getCoffeWriterERC20 = () => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   return new ethers.Contract(window.coffeAddress, coffeeSupplyChainABI.abi, signer);
// };

export const getCoffeWriter1ERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(window.coffeAddress1, coffeeSupplyChain1ABI.abi, signer);
};

export const getCoffeWriter2ERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(window.coffeAddress2, coffeeSupplyChain2ABI.abi, signer);
};

// export const getUserWriterERC20 = () => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   const signer = provider.getSigner();
//   return new ethers.Contract(window.userAddress, supplyChainUserABI.abi, signer);
// };

export const getUserWriterERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(window.userAddress, supplyChainUser1ABI.abi, signer);
};

// export const getCoffeERC20 = () => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   return new ethers.Contract(window.coffeAddress, coffeeSupplyChainABI.abi, provider);
// };

export const getCoffe1ERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(window.coffeAddress1, coffeeSupplyChain1ABI.abi, provider);
};

export const getCoffe2ERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(window.coffeAddress2, coffeeSupplyChain2ABI.abi, provider);
};

// export const getUserERC20 = () => {
//   const provider = new ethers.providers.Web3Provider(window.ethereum);
//   return new ethers.Contract(window.userAddress, supplyChainUserABI.abi, provider);
// };

export const getUserERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(window.userAddress, supplyChainUser1ABI.abi, provider);
};

// INFURA
export const infuraGetUserERC20 = () => {
  const provider = new ethers.providers.InfuraProvider('goerli', process.env.REACT_APP_INFURA_PROJECT_ID);
  return new ethers.Contract(window.userAddress, supplyChainUser1ABI.abi, provider);
};

export const infuraGetCoffe1ERC20 = () => {
  const provider = new ethers.providers.InfuraProvider('goerli', process.env.REACT_APP_INFURA_PROJECT_ID);
  return new ethers.Contract(window.coffeAddress1, coffeeSupplyChain1ABI.abi, provider);
};

export const infuraGetCoffe2ERC20 = () => {
  const provider = new ethers.providers.InfuraProvider('goerli', process.env.REACT_APP_INFURA_PROJECT_ID);
  return new ethers.Contract(window.coffeAddress2, coffeeSupplyChain2ABI.abi, provider);
};

export const getArgsEvent = (tx, eventName) => {
  let args = [];
  if (tx.events !== undefined)
    tx.events.map((itemEvent) => {
      if (itemEvent.event !== undefined && itemEvent.event === eventName) args = { ...itemEvent.args };
      return null;
    });
  return args;
};
