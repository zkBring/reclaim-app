import { TApi } from '../types'

const {
  API_KEY_DEV,
  API_KEY_PROD
} = process.env

type TDefineApiHeaders = (
  api: TApi
) => Record<string, string>

const defineApiHeaders: TDefineApiHeaders = (
  api
) => {
  const headers: Record<string, string> = {}

  if (api === 'dev') {
    headers['authorization'] = `Bearer ${API_KEY_DEV}`
  } else {
    headers['authorization'] = `Bearer ${API_KEY_PROD}`
  }

  return headers
}

export default defineApiHeaders