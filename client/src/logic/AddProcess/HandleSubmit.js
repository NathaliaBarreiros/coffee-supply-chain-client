import { getCoffeWriterERC20 } from '../erc20';

const HandleSubmit = async (values, ipfs) => {
  const file = values.roastImageHash;
  const result = await ipfs.add(file);
  const url = `https://ipfs.infura.io/ipfs/${result.path}`;

  const erc20 = await getCoffeWriterERC20();
  await erc20.addProcessData(
    values.batchNo,
    values.procAddress,
    values.typeOfDrying,
    // values.roastImageHash,
    url,
    values.roastTemp,
    values.typeOfRoast,
    values.roastDate,
    values.millDate,
    values.processorPrice
  );
};

export default HandleSubmit;
