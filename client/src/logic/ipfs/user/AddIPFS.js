import React, { useState } from 'react';
import ConnectIPFS from './ConnectIPFS';

const AddIPFS = async (values) => {
  const [images, setImages] = useState([]);
  // if (ConnectIPFS.connection != null) {
  if (!values.profileHash || values.profileHash.length === 0) {
    console.log('Seleccione un archivo');
  }

  const file = values.profileHash;
  const ipfs = ConnectIPFS.connection;
  const result = await ipfs.add(file);
  const url = `https://ipfs.infura.io/ipfs/${result.path}`;
  console.log('url: ', url);

  setImages([
    ...images,
    {
      cid: result.cid,
      path: result.path,
    },
  ]);

  return { imgs: images, res: result, path: url };
  // }
  // const err = ConnectIPFS.error;
  // console.log(ConnectIPFS.error);
  //return { imgs: null, res: null, path: null, error: err };
};

export default AddIPFS;
