import { getCoffeWriter1ERC20 } from '../erc20';

const HandleSubmit = (values) => {
  const erc20 = getCoffeWriter1ERC20();
  return erc20.addProcessData(
    values.batchNo,
    [String(values.processorAddress), String(values.processorLat), String(values.processorLng)],
    values.typeOfDrying,
    values.humidityAfterDrying,
    values.roastImageHash,
    [values.roastTemp, values.typeOfRoast],
    [String(values.roastDate), String(values.millDate)],
    values.processorPricePerKilo,
    values.processBatchWeight
  );
};

export default HandleSubmit;
