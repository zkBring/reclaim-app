import { TApi } from "../types"
const {
  API_URL_PROD,
  API_URL_DEV,
  API_URL_TESTNETS
} = process.env

type TDefineApiURL = (
  apiType: TApi
) => string

const defineApiURL: TDefineApiURL = (apiType) => {
  switch (apiType) {
    case 'dev':
      return API_URL_DEV
    case 'testnets':
      return API_URL_TESTNETS
    default:
      return API_URL_PROD
  }
}

export default defineApiURL
