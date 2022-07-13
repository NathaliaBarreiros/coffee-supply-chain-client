import { getCoffeERC20, infuraGetCoffeERC20 } from '../erc20';

const AskShipRetailer = async (values) => {
  const erc20 = await getCoffeERC20();
  const erc20Infura = await infuraGetCoffeERC20();

  try {
    // const info = await erc20.callStatic.getShipRetailerData(values.batchNo);
    const info = await erc20Infura.callStatic.getHarvestData(values.batchNo);
    return { data: info, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export default AskShipRetailer;
