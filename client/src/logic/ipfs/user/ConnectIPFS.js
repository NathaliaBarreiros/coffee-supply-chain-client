import React from 'react';
import { create } from 'ipfs-http-client';

const ConnectIPFS = () => {
  let ipfs;
  try {
    // ipfs = create({
    //   url: 'https://ipfs.infura.io:5001/api/v0',
    // });
    return {
      conection: create({
        url: 'https://ipfs.infura.io:5001/api/v0',
      }),
      error: null,
    };
  } catch (err) {
    ipfs = undefined;
    return { conection: null, error: err };
  }
};

export default ConnectIPFS;
