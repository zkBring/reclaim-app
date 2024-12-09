import { HashRoute, routeLocation, Router } from 'vanilla-routing'
import computeScanAddress from './compute-scan-address'
import getRedirectLink from './get-redirect-link'
import getReclaimRedirectLink from './get-reclaim-redirect-link'
import { TApi, TError } from './types'
import createQRX from '@qr-x/vanilla'
const templateLoading = document.getElementById("loader")
const templateRedirect = document.getElementById("redirect")
const templateQR = document.getElementById("qr")

const templateError = document.getElementById("error")
const content = document.querySelector(".content")


const createErrorScreen = (
  error: TError
) => {

  console.log({ error })

  // @ts-ignore
  const errorScreen = templateError.content.cloneNode(true).querySelector('.error')
  const titleElement = errorScreen.querySelector('.error__title')

  switch (error) {
    case 'qr_campaign_finished':
      titleElement.innerText = 'Campaign is finished'
      break
    case 'qr_campaign_not_active':
      titleElement.innerText = 'QR campaign is paused'
      break
    case 'qr_campaign_not_started':
      titleElement.innerText = 'Campaign has not started yet'
      break
    case 'qr_error':
      titleElement.innerText = 'Something went wrong'
      break
    case 'qr_incorrect_parameter':
      titleElement.innerText = 'Wrong request'
      break
    case 'qr_no_connection':
      titleElement.innerText = 'Seems you\'re offline'
      break
    case 'qr_no_links_to_share':
      titleElement.innerText = 'No links to share'
      break
    case 'qr_not_found':
      titleElement.innerText = 'Asset does not exist'
      break
    default:
      titleElement.innerText = 'Something went wrong'
  }

  return errorScreen
}


const routes = [
  {
    pathname: '/mqr/:qrSecret/:qrEncCode',
    element: () => {
      content.innerHTML = ''
      const location = routeLocation()
      const { params: { qrEncCode, qrSecret } } = location
      computeScanAddress(
        qrSecret,
        qrEncCode,
        (location.search.api as TApi) || '',
        (redirectURL) => {
          content.innerHTML = ''
          //console.log(redirectURL)
          Router.go(redirectURL)
        }
      )

      return document.createElement('div')
    }
  },
  {
    pathname: '/scan/:multiscanQRId/:scanId/:scanIdSig/:multiscanQREncCode',
    element: () => {
      content.innerHTML = ''
      const location = routeLocation()
      const { params: {
        multiscanQRId,
        multiscanQREncCode
      }} = location

      getRedirectLink(
        multiscanQRId,
        multiscanQREncCode,
        (location.search.api as TApi) || '',
        (location) => {
          content.innerHTML = ''
          // @ts-ignore          
          const templateClone = templateQR.content.cloneNode(true).querySelector('.qr')
          const qrContainer = templateClone.querySelector('.qr__item')
          const qr = createQRX({
            data: location,
            shapes: {
              body: 'square',
              eyeball: 'square',
              eyeframe: 'square',
            },
          })
          qrContainer.appendChild(qr)

          console.log(location)
          content.append(templateClone)
        },
        (error) => {
          content.innerHTML = ''
          const errorElement = createErrorScreen(
            error
          )
          content.append(errorElement)
        }
      )

      content.innerHTML = ''
      // @ts-ignore
      const templateClone = templateLoading.content.cloneNode(true).querySelector('.loader')
      return templateClone
    }
  }, ,
  {
    pathname: '/reclaim/:multiscanQRId/:reclaimSessionId/:multiscanQREncCode/verification-complete',
    element: () => {
      content.innerHTML = ''
      const location = routeLocation()
      const { params: {
        multiscanQRId,
        reclaimSessionId,
        multiscanQREncCode
      } } = location

      const reclaimProof = ""

      getReclaimRedirectLink(
        multiscanQRId,
        reclaimSessionId,
        multiscanQREncCode,
        (location.search.api as TApi) || '',
        (location) => {
          content.innerHTML = ''
          // @ts-ignore          
          const templateClone = templateRedirect.content.cloneNode(true).querySelector('.redirect')
          const link = templateClone.querySelector('.redirect__link')
          link.setAttribute('href', location)
          console.log(location)
          content.append(templateClone)
        },
        (error) => {
          content.innerHTML = ''
          const errorElement = createErrorScreen(
            error
          )
          content.append(errorElement)
        }
      )

      content.innerHTML = ''
      // @ts-ignore
      const templateClone = templateLoading.content.cloneNode(true).querySelector('.loader')
      return templateClone
    }
  }
]

HashRoute(routes)
