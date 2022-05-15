'use strict';
let ipfsApi = null;
if(process.env.INFURA_PROJECT_ID && process.env.INFURA_PROJECT_SECRET) {
  const tokenIpfs = `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`;

  ipfsApi = require("ipfs-http-client").create({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
    token: tokenIpfs,
  });

} else {
  console.log("Disable IPFS");
}

module.exports = ipfsApi;
