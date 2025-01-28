import {
  getMultiQRCampaignData
} from './api'
import axios from 'axios'
import { TError } from './types'
import { TApi } from './types'
import mobile from 'is-mobile'

import getTokenData from './get-token-data'
import { ethers } from 'ethers'

export default async function getLinkByMultiQR(
  multiscanQRId: string,
  multiscanQREncCode: string,
  api: TApi,
  linkRedirectCallback?: (
    location: string,
    tokenAmount: string,
    symbol: string,
    image: string
  ) => void,
  linkRedirectMobileCallback?: (
    location: string,
    tokenAmount: string,
    symbol: string,
    image: string
  ) => void,
  errorCallback?: (error_name: TError) => void,
) {
  try {
    const { data: campaignData } = await getMultiQRCampaignData(
      multiscanQRId,
      multiscanQREncCode,
      api
    )

    const {
      reclaimVerificationURL,
      campaign
    } = campaignData

    const tokenData = await getTokenData(
      campaign.token_address,
      campaign.chain_id
    )

    const tokenAmount = ethers.utils.formatUnits(campaign.token_amount, tokenData.decimals)
    console.log({ tokenAmount })

    if (reclaimVerificationURL) {
      if (mobile()) {
        // show button
        linkRedirectMobileCallback(
          reclaimVerificationURL,
          tokenAmount,
          tokenData.symbol,
          tokenData.image
        )
      } else {
        // show qr
        linkRedirectCallback(
          window.location.href,
          tokenAmount,
          tokenData.symbol,
          tokenData.image
        )
      }
    }
    

  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      if (err.message === 'Network Error') {
        if (!window.navigator.onLine) {
          errorCallback('qr_no_connection')
        } else {
          errorCallback('qr_error')
        }
      } else if (err.response?.status === 404) {
        errorCallback('qr_not_found')
      } else if (err.response?.status === 500) {
        errorCallback('qr_error')
      } else if (err.response?.status === 403) {

        const { data } = err.response

        if (data.error.includes("Claim is over.")) {
          errorCallback('qr_campaign_finished')
        } else if (data.error.includes("Claim has not started yet.")) {
          errorCallback('qr_campaign_not_started')
        } else if (data.error.includes("No more claims available.")) {
          errorCallback('qr_no_links_to_share')
        } else if (data.error.includes("Dispenser is not active")) {
          errorCallback('qr_campaign_not_active')
        } else if (data.errors.includes("RECEIVER_NOT_WHITELISTED")) {
          errorCallback('qr_campaign_not_eligible')
        } else {
          errorCallback('qr_error')
        }
      }
    } else {
      if (err && err.code === "INVALID_ARGUMENT") {
        errorCallback('qr_incorrect_parameter')
        return
      }
      errorCallback('qr_error')
    }
    console.error(err)
  }
} 
