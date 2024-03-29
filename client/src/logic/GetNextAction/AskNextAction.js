import { getCoffe1ERC20 } from '../erc20';

const AskNextAction = async (values) => {
  try {
    const erc20 = getCoffe1ERC20();
    const info = await erc20.callStatic.getNextAction(values.batchNo);
    return { data: info, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};

export default AskNextAction;
