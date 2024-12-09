import { TApi } from "../types"
import {
  dashboardServerUrl,
  devDashboardServerUrl,
  testnetsDashboardServerUrl
} from "../../config"

type TDefineApiURL = (
  apiType: TApi
) => string

const defineApiURL: TDefineApiURL = (apiType) => {
  switch (apiType) {
    case 'dev':
      return devDashboardServerUrl
    case 'testnets':
      return testnetsDashboardServerUrl
    default:
      return dashboardServerUrl
  }
}

export default defineApiURL
