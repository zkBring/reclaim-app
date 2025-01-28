type TCustomClaimApps = Record<string, string>

export const customClaimApps: TCustomClaimApps = {
}

export const customClaimAppsForToken: TCustomClaimApps = {
}

type TAppConfig = {
  JSONRpcUrl: {
    [key: string]: string
  }
}

export const appConfig: TAppConfig = {
  JSONRpcUrl: {
    '8453': 'https://developer-access-mainnet.base.org'
  }
}