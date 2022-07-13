import { getCoffeWriterERC20 } from '../erc20';

const HandleSubmit = (values) => {
  const erc20 = getCoffeWriterERC20();
  return erc20.addShipPackerData(
    values.batchNo,
    values.transportTypeP,
    String(values.pickupDateTimeP),
    values.shipPriceP
  );
};

export default HandleSubmit;
