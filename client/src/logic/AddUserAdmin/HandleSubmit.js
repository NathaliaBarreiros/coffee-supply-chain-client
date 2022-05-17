import { useState } from 'react';
import { getUserWriterERC20 } from '../erc20';
import ConnectIPFS from '../ipfs/user/ConnectIPFS';

const HandleSubmit = async (values, ipfs) => {
  // const [images, setImages] = useState([]);

  if (!values.profileHash || values.profileHash.length === 0) {
    console.log('No se ha seleccionado ningún archivo');
    values.profileHash = '';
    const erc20 = await getUserWriterERC20();
    await erc20.updateUserForAdmin(
      values.userAddress,
      values.name,
      values.email,
      values.role,
      values.isActive,
      values.profileHash
    );
  } else {
    const file = values.profileHash;
    // const ipfs = ConnectIPFS.connection;
    const result = await ipfs.add(file);
    const url = `https://ipfs.infura.io/ipfs/${result.path}`;
    console.log('url: ', url);

    // setImages([
    //   ...images,
    //   {
    //     cid: result.cid,
    //     path: result.path,
    //   },
    // ]);
    const erc20 = await getUserWriterERC20();
    await erc20.updateUserForAdmin(values.userAddress, values.name, values.email, values.role, values.isActive, url);
  }
};

export default HandleSubmit;
