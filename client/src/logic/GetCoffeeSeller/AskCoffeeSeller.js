import { infuraGetCoffe1ERC20 } from '../erc20';

const AskCoffeeSeller = async (values) => {
  
  try {
    const erc20Infura = await infuraGetCoffe1ERC20();
    const info = await erc20Infura.callStatic.getCoffeeSellData(values.batchNo);
    return { data: info, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export default AskCoffeeSeller;
