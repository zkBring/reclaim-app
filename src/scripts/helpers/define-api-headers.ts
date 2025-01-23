import { TApi } from '../types'

const {
  API_KEY_DEV,
  API_KEY_PROD
} = process.env

console.log({
  API_KEY_DEV,
  API_KEY_PROD
})

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