import { useState, useEffect } from 'react'
import { nftContractAddress } from '../config.js'
import { ethers } from 'ethers'
import axios from 'axios'

import NFT from '../utils/jnft.json'
import Art from './art.js'

const mint = () => {
	const [mintedNFT, setMintedNFT] = useState(null)
	const [miningStatus, setMiningStatus] = useState(null)
	const [loadingState, setLoadingState] = useState(0)
	const [txError, setTxError] = useState(null)
	const [currentAccount, setCurrentAccount] = useState('')
	const [correctNetwork, setCorrectNetwork] = useState(false)

	// Checks if wallet is connected
	const checkIfWalletIsConnected = async () => {
		const { ethereum } = window
		if (ethereum) {
			console.log('Got the ethereum obejct: ', ethereum)
		} else {
			console.log('No Wallet found. Connect Wallet')
		}

		const accounts = await ethereum.request({ method: 'eth_accounts' })

		if (accounts.length !== 0) {
			console.log('Found authorized Account: ', accounts[0])
			setCurrentAccount(accounts[0])
		} else {
			console.log('No authorized account found')
		}
	}

	// Calls Metamask to connect wallet on clicking Connect Wallet button
	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId'})
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'
			const mumbaiChainId = '0x13881'
			const polygonChainId = '0x89'

			/*
			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			} */

			if (chainId !== polygonChainId) {
				alert('You are not connected to the Polygon Mainnet!')
				return
			}

			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

			console.log('Found account', accounts[0])
			setCurrentAccount(accounts[0])
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'
		const mumbaiChainId = '0x13881'
		const polygonChainId = '0x89'

		if (chainId !== polygonChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkCorrectNetwork()
	}, [])

	const getSVG = () => {
		let element = document.getElementById('div').innerHTML
		console.log(element)
		return element
	}

	const getAnswer = () => {
		let element = document.getElementById('answer').value
		element = capitalizeFirstLetters(element)
		console.log(element)
		return element
	}

	const getName = () => {
		let element = document.getElementById('name').value
		element = capitalizeFirstLetters(element)
		console.log(element)
		return element
	}

	const capitalizeFirstLetters = (sentence) => {
		return sentence.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
	}

	const showSVG = () => {
		let svg = getSVG()
		let answer = getAnswer()
		let name = getName()
	}


	// Creates transaction to mint NFT on clicking Mint Character button
	const mintCharacter = async () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				
				let svg = getSVG()
				let answer = getAnswer()
				let name = getName()

				let nftTx = await nftContract.createknft(svg, answer, name)
				console.log('Mining....', nftTx.hash)
				setMiningStatus(0)

				let tx = await nftTx.wait()
				setLoadingState(1)
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()

				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)

				getMintedNFT(tokenId)
				
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			setTxError(error.message)
		}
	}

	// Gets the minted NFT data
	const getMintedNFT = async (tokenId) => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum)
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					nftContractAddress,
					NFT.abi,
					signer
				)

				let tokenUri = await nftContract.tokenURI(tokenId)
				let data = await axios.get(tokenUri)
				let meta = data.data

				setMiningStatus(1)
				setMintedNFT(meta.image)
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log(error)
			setTxError(error.message)
		}
	}


	return (
		<div className='flex flex-col items-center pt-5 bg-[#f3f6f4] text-[#6a50aa] min-h-screen'>
			<div className='trasition hover:rotate-180 hover:scale-105 transition duration-500 ease-in-out'>
			</div>

			<h2 className='text-4xl font-bold mb-5 mt-5'>
				What is Art for You?
			</h2>

			<div>
				<Art />
			</div>

			{currentAccount === '' ? (
				<button
					className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={ connectWallet }
				>
					Connect Wallet
				</button>
				) : correctNetwork ? (
				<button
					className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={ mintCharacter }
				>
					Mint
				</button>
				) : (
				<div className='flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3'>
				
				<button
					className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={ mintCharacter }
				>
					Mint
				</button>


				<button
					className='text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out'
					onClick={ connectWallet }
				>
					Connect Wallet
				</button>
				
				<div>----------------------------------------</div>
				<div>We encountered some issues try to connect </div>
				<div>the wallet and mint an NFT</div>
				<div>----------------------------------------</div>
				</div>
			)}

			<div className='text-xl font-semibold mb-20 mt-4'>
				{
					// https://testnets.opensea.io/collection/what-is-art
				}
				<a
					//href={`https://rinkeby.rarible.com/collection/${nftContractAddress}`}
					href={`https://opensea.io/collection/what-is-art-v4`}
					target='_blank'
				>
					<span className='hover:underline hover:underline-offset-8 '>
						View Collection on OpenSea
					</span>
				</a>
			</div>
			{loadingState === 0 ? (
				miningStatus === 0 ? (
					txError === null ? (
						<div className='flex flex-col justify-center items-center mb-60'>
							<div className='text-lg font-bold'>
								Processing your transaction
							</div>

						</div>
					) : (
						<div className='text-lg text-red-600 font-semibold'>{txError}</div>
					)
				) : (
					<div></div>
				)
			) : (
				<div className='flex flex-col justify-center items-center'>
					<div className='font-semibold text-lg text-center mb-4'>
						So, what do you think?
					</div>
					<img
						src={mintedNFT}
						alt=''
						className='mb-60 h-60 w-60 rounded-lg shadow-2xl shadow-[#6a50aa] hover:scale-105 transition duration-500 ease-in-out'
					/>
				</div>
			)}
		</div>
	)
}

export default mint
