const { MerkleTree } = require('merkletreejs')
const ethers = require('ethers');
const crypto = require('crypto');
const keccack256 = require('keccak256');
const SHA256 = require('crypto-js/sha256')

// reference: https://medium.com/@ItsCuzzo/using-merkle-trees-for-nft-whitelists-523b58ada3f9

const whiteListAddresses = [];

console.log('Generating wallet address list.');
for (let i = 0; i < 10; i++) {
  const id = crypto.randomBytes(32).toString('hex');
  const privateKey = "0x"+id;
  const wallet = new ethers.Wallet(privateKey);
  whiteListAddresses.push(wallet.address);
}

console.log('List generated.');

/*
* Leaf Nodes — These nodes sit at the very bottom of the tree and their value is the result of the original data being
*  hashed according to a specified hash function. There are as many leaf nodes in a tree for as many pieces of original
*  data that require hashing. E.g. If 7 pieces of data need to be hashed, there will be 7 leaf nodes
*
* **/
const leafNodes = whiteListAddresses.map(addr => keccack256(addr));

/*
* Merkle Trees are a tree-like structure where every node on the tree is represented by a value that is the result of
*  some cryptographic hash function. Hash functions are 1-way, meaning it is easy to produce an output from an input,
*  but computationally infeasible to determine an input from an output.
* **/
const merkleTree = new MerkleTree(leafNodes, keccack256, { sortPairs: true });

console.log(merkleTree.toString())

const merkleTreeHexRoot = merkleTree.getHexRoot();

const claimingAddress = leafNodes[1]
const claimingAddressHexProof = merkleTree.getHexProof(claimingAddress);
const merkleTreeClaimingAddressVerification = merkleTree.verify(claimingAddressHexProof, claimingAddress, merkleTreeHexRoot);

console.log(`Verifying address. Is wallet registered: ${merkleTreeClaimingAddressVerification}`)

console.log('Generating new unregistered wallet')
const id = crypto.randomBytes(32).toString('hex');
const privateKey = "0x"+id;
const unregisteredWallet = new ethers.Wallet(privateKey).wallet;

const merkleTreeUnregisteredAddressVerification = merkleTree.verify(claimingAddressHexProof, unregisteredWallet, merkleTreeHexRoot);
console.log(`Verifying address. Is wallet registered: ${merkleTreeUnregisteredAddressVerification}`)
