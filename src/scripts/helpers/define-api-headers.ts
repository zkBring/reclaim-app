import { TApi } from '../types'
import {
  devApiKey,
  apiKey
} from '../../config'
type TDefineApiHeaders = (
  api: TApi
) => Record<string, string>

const defineApiHeaders: TDefineApiHeaders = (
  api
) => {
  const headers: Record<string, string> = {}

  if (api === 'dev') {
    headers['authorization'] = `Bearer ${devApiKey}`
  } else {
    headers['authorization'] = `Bearer ${apiKey}`
  }

  return headers
}

export default defineApiHeaders