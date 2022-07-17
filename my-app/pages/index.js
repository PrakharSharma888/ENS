import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import web3modal from 'web3modal'
import { ethers, providers } from 'ethers'
import { useRef, useState, useEffect } from 'react'

export default function Home() {

  const web3ModalRef = useRef()
  const [walletConnected, setWalletConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [ENS, setENS] = useState("")

  const setENSOrAddress = async (address, web3Provider) =>{
    const _ens = await web3Provider.lookupAddress(address)
    if(_ens){
      setENS(_ens)
    }
    else{
      setAddress(address)
    }
  }

  const getSignerOrProvider = async(signer = false) =>{
    try {

        const provider = await web3ModalRef.current.connect()
        const web3Provider = await providers.Web3Provider(provider)

        const { chainId } = await web3Provider.getNetwork()
        if(chainId !== 4){
          window.alert("Change to Rinkeby!");
        }
        if(signer){
          const signer = await web3Provider.getSigner()
          const address = await signer.getAddress()
          await setENSOrAddress(address,web3Provider)
          return signer;
        }
        return web3Provider

    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () =>{
    try {
      
      await getSignerOrProvider(true)
      setWalletConnected(true)

    } catch (error) {
      console.log(error)
    }
  }

  const renderButton = () =>{
    if(walletConnected){
      return (
        <div>Wallet Connected!</div>
      );
    }
    else{
      return(
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet!
        </button>
      );
    }
  }

  useEffect(()=>{
    if(!walletConnected){

      web3ModalRef.current = new web3modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false
      });
      connectWallet();
    }
    
  })

  return (
    <div>
      <Head>
        <title>ENS Dapp</title>
        <meta name="description" content="ENS-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to the ENS Show!</h1>
        </div>
        <div className={styles.description}>
          This must be your address oe your ENS name
        </div>
        {renderButton}
      </div>
      <div>
        <image className={styles.image} src='./ens.png'/>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Prakhar Sharma
      </footer>
    </div>
  )
}
