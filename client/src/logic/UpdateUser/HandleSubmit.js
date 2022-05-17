import { getUserWriterERC20 } from '../erc20';

const HandleSubmit = async (values, ipfs) => {
  if (!values.profileHash || values.profileHash.length === 0) {
    console.log('No se ha seleccionado ningún archivo');
    values.profileHash = '';
    const erc20 = await getUserWriterERC20();
    await erc20.updateUser(values.name, values.email, values.role, values.isActive, values.profileHash);
  } else {
    const file = values.profileHash;
    const result = await ipfs.add(file);
    const url = `https://ipfs.infura.io/ipfs/${result.path}`;
    const erc20 = await getUserWriterERC20();
    await erc20.updateUser(values.name, values.email, values.role, values.isActive, url);
  }
};

export default HandleSubmit;
