
const main = async() => {
    const nftContractFactory = await ethers.getContractFactory('jnft')
    console.log("Deploying contract factory...")
    const nftContract = await nftContractFactory.deploy()
    await nftContract.deployed()
    console.log("Contract deployed to: ", nftContract.address)
}

const runMain = async() => {
    try {
        await main()
        process.exit(0)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

runMain()


// npx hardhat run --network rinkeby scripts/deploy.js
