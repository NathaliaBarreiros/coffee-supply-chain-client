import { ethers } from 'ethers';
import coffeeSupplyChainABI from '../contracts/CoffeeSupplyChain.json';
import supplyChainUserABI from '../contracts/SupplyChainUser.json';

export const getCoffeWriterERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(window.coffeAddress, coffeeSupplyChainABI.abi, signer);
};

export const getUserWriterERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(window.userAddress, supplyChainUserABI.abi, signer);
};

export const getCoffeERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(window.coffeAddress, coffeeSupplyChainABI.abi, provider);
};

export const getUserERC20 = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return new ethers.Contract(window.userAddress, supplyChainUserABI.abi, provider);
};

export const infuraGetCoffeERC20 = () => {
  const provider = new ethers.providers.InfuraProvider('rinkeby', process.env.REACT_APP_INFURA_PROJECT_ID);

  return new ethers.Contract(window.coffeAddress, coffeeSupplyChainABI.abi, provider);
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
