import { getCoffeERC20, infuraGetCoffeERC20 } from '../erc20';

const AskGrainInspection = async (values) => {
  const erc20 = getCoffeERC20();
  const erc20Infura = await infuraGetCoffeERC20();

  try {
    // const info = await erc20.callStatic.getGrainData(values.batchNo);
    const info = await erc20Infura.callStatic.getHarvestData(values.batchNo);
    return { data: info, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export default AskGrainInspection;
