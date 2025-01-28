import { ERC20Contract } from '../abi'
import { ethers } from 'ethers'
import tokenSymbol from '../images/coin.svg'
import { TTokenERC20Data } from './types'
import { appConfig } from '../config'

type TGetTokenERC20Data = (
  tokenAddress: string,
  chainId: string
) => Promise<TTokenERC20Data>

const getTokenERC20Data: TGetTokenERC20Data = async (
  tokenAddress,
  chainId
) => {
  try {
    const jsonRPCUrl = appConfig.JSONRpcUrl[chainId]
    console.log({ jsonRPCUrl })
    const provider = new ethers.providers.JsonRpcProvider(jsonRPCUrl)
    console.log({ provider })

    const contractInstance = new ethers.Contract(tokenAddress, ERC20Contract, provider)
    console.log({ ERC20Contract, contractInstance })

    let symbol = await contractInstance.symbol()
    console.log({ symbol })
    let decimals = await contractInstance.decimals()

    // ERROR COMES FROM HERE
    console.log({ decimals })

    return {
      symbol,
      decimals,
      description: '',
      image: tokenSymbol
    }
  } catch (err) {
    // @ts-ignore
    console.log({ err })
    return {
      symbol: 'ERC20 Token',
      decimals: 18, description: '',
      image: tokenSymbol
    }
  }
}

export default getTokenERC20Data