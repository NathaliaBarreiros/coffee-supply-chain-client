import React from 'react';
import { ethers } from 'ethers';
import coffeeSupplychainABI from '../../contracts/CoffeeSupplyChain.json';

const CoffeeSupplyChainAddress = '0xa108A7C2e0417aF523eadFA4Cf628126BEFB0534';

const HandleSubmit = async (values) => {
  console.log(values);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = await provider.getSigner();
  const erc20 = new ethers.Contract(CoffeeSupplyChainAddress, coffeeSupplychainABI.abi, signer);
  await erc20.addProcessData(
    values.batchNo,
    values.procAddress,
    values.typeOfDrying,
    values.roastImageHash,
    values.roastTemp,
    values.typeOfRoast,
    values.roastDate,
    values.millDate,
    values.processorPrice
  );
};

export default HandleSubmit;
