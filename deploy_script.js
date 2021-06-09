const ethers = require('ethers')
// const { Watcher } = require('@eth-optimism/watcher')
const { getContractFactory } = require('@eth-optimism/contracts')

const factory = (name, ovm = false) => {
  const artifact = require(`./build/${name}.json`)
  return new ethers.ContractFactory(artifact.abi, artifact.bytecode)
}

// const factory__L2_UniswapV2ERC20 = factory('UniswapV2ERC20', true)
const factory__L2_UniswapV2Factory = factory('UniswapV2Factory', true)
const factory__L2_UniswapV2Pair = factory('UniswapV2Pair', true)

async function main() {
  // L2 messenger address is always the same.
  const l2MessengerAddress = '0x4200000000000000000000000000000000000007'
  const l2RpcProvider = new ethers.providers.JsonRpcProvider('https://testnet1.optimism.tokamak.network')

  const key = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  const l2Wallet = new ethers.Wallet(key, l2RpcProvider)

  // Tool that helps watches and waits for messages to be relayed between L1 and L2.
  // const watcher = new Watcher({
  //   l2: {
  //     provider: l2RpcProvider,
  //     messengerAddress: l2MessengerAddress
  //   }
  // });


  console.log('Deploying L2 UniswapV2Factory...')
  const L2_UniswapV2Factory = await factory__L2_UniswapV2Factory.connect(l2Wallet).deploy(
    l2MessengerAddress,
  )
  const l2FactoryHash = await L2_UniswapV2Factory.deployTransaction.wait()
  console.log('L2UniswapV2Factory Contract address: ', l2FactoryHash.contractAddress);

  console.log('Deploying L2 UniswapV2Pair...')
  const L2_UniswapV2Pair = await factory__L2_UniswapV2Pair.connect(l2Wallet).deploy(
  )
  const l2PairHash = await L2_UniswapV2Pair.deployTransaction.wait();
  console.log('L2UniswapV2Pair Contract address: ', l2PairHash.contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
