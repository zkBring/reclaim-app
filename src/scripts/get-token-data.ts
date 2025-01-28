import axios from 'axios'
import { TError } from './types'
import { TApi } from './types'
import mobile from 'is-mobile'
import getTokenERC20Data from './get-erc20-token'

export default async function getTokenData (
  tokenAddress: string,
  chainId: string
) {
  const tokenData = getTokenERC20Data(
    tokenAddress,
    chainId
  )

  return tokenData
} 
