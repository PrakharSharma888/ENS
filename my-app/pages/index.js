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
    <>
    
    </>
  )
}
