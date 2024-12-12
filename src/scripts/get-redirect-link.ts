import { ethers } from 'ethers'
import {
  getMultiQRData,
  getMultiQRCampaignData
} from './api'
import * as wccrypto from '@walletconnect/utils/dist/esm'
import axios from 'axios'
import { TError } from './types'
import { TApi } from './types'
import mobile from 'is-mobile'

import { customClaimApps, customClaimAppsForToken } from '../config'

export default async function getLinkByMultiQR(
  multiscanQRId: string,
  multiscanQREncCode: string,
  api: TApi,
  linkRedirectCallback?: (location: string) => void,
  errorCallback?: (error_name: TError) => void,
) {
  try {
    const { data: campaignData } = await getMultiQRCampaignData(
      multiscanQRId,
      multiscanQREncCode,
      api
    )

    const {
      reclaimVerificationURL
    } = campaignData

    if (reclaimVerificationURL) {
      if (mobile()) {
        window.location.href = reclaimVerificationURL
      } else {
        linkRedirectCallback(window.location.href)
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
