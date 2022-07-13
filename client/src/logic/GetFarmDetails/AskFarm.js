import { getCoffeERC20, infuraGetCoffeERC20 } from '../erc20';

const AskFarm = async (values) => {
  const erc20 = await getCoffeERC20();
  const erc20Infura = await infuraGetCoffeERC20();

  try {
    // const farmer = await erc20.callStatic.getFarmDetails(values.batchNo);
    const info = await erc20Infura.callStatic.getProcessData(values.batchNo);
    return { data: farmer, error: null };
  } catch (err) {
    // console.log('ERROR AT GETTING FARM DETAILS: ', error);
    return { data: null, error: err };
  }
};

export default AskFarm;
