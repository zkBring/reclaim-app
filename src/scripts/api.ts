import axios from 'axios'
import { TApi } from './types'
import { defineApiURL, defineApiHeaders } from './helpers'

const getMultiQRData = (
  multiscanQRId: string,
  scanId: string,
  scanIdSig: string,
  api: TApi
) => {
  const serverUrl = defineApiURL(api)
  const headers = defineApiHeaders(
    api
  )
  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop/multiscan-qrs/${multiscanQRId}`, {
    scan_id: scanId,
    scan_id_sig: scanIdSig
  }, { headers })
}

const popReclaimLink = (
  multiscanQRId: string,
  reclaimSessionId: string,
  api: TApi
) => {
  const serverUrl = defineApiURL(api)
  const headers = defineApiHeaders(
    api
  )
  return axios.post(`${serverUrl}/api/v2/dashboard/dispensers/pop-reclaim/multiscan-qrs/${multiscanQRId}`, {
    reclaim_session_id: reclaimSessionId
  }, { headers })
}


const getMultiQRCampaignData = (
  multiscanQRId: string,
  multiscanQREncCode: string,
  api: TApi
) => {
  const headers = defineApiHeaders(
    api
  )
  const serverUrl = defineApiURL(api)
  return axios.get(`${serverUrl}/api/v2/claimer/dispensers/multiscan-qrs/${multiscanQRId}/campaign`,
    {
      headers,
      params: {
        multiscanQREncCode: multiscanQREncCode
      }
    }
  )
}

export {
  getMultiQRData,
  getMultiQRCampaignData,
  popReclaimLink
}

