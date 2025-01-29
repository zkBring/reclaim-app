import { HashRoute, routeLocation, Router } from 'vanilla-routing'
import computeScanAddress from './compute-scan-address'
import getRedirectLink from './get-redirect-link'
import { TApi, TError } from './types'
import QRCodeStyling from 'qr-code-styling'
import getReclaimRedirectLink from './get-reclaim-redirect-link'
const templateLoading = document.getElementById("loader")
const templateDesktop = document.getElementById("desktop")
const templateMobile = document.getElementById("mobile")
const templateInstructionPopup = document.getElementById("popup")

const templateError = document.getElementById("error")
const content = document.querySelector(".content")
import createPreviewPopup from './create-preview-popup'


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
        (
          location,
          tokenAmount,
          symbol,
          image
        ) => {
          content.innerHTML = ''
          const renderContent = () => {
             // @ts-ignore          
            const templateClone = templateDesktop.content.cloneNode(true).querySelector('.container')

            console.log('renderijng...')
            // @ts-ignore          
            const popupTemplateClone = templateInstructionPopup.content.cloneNode(true).querySelector('.popup')
            const buttonInstruction = templateClone.querySelector('.button_instruction')

            const buttonQR = templateClone.querySelector('.button_qr')

            const buttonQRCallback = () => {
              const popup = templateClone.querySelector('.popup_qr')
              popup.classList.add('popup_open')
              const qrContainer = templateClone.querySelector('.qr')
              qrContainer.innerHTML = ''
              const qr = new QRCodeStyling({
                width: 222,
                height: 222,
                data: location,
                cornersSquareOptions: {
                  color: "#FFF",
                  type: 'square'
                },
                cornersDotOptions: {
                  color: "#FFF",
                  type: 'square'
                },
                dotsOptions: {
                  color: "#FFF",
                  type: "square"
                },
                backgroundOptions: {
                  color: "#000"
                },
                imageOptions: {
                  margin: 5,
                  imageSize: 0.5,
                  crossOrigin: 'anonymous',
                }
              })

              const closeButton = popup.querySelector('.button_close')
              closeButton.addEventListener('click', () => {
                popup.classList.remove('popup_open')
              })
              qr.append(qrContainer)
            }

            const buttonInstructionCallback = () => {
              popupTemplateClone.classList.add('popup_open')
              const closeButton = popupTemplateClone.querySelector('.button_close')
              closeButton.addEventListener('click', () => {
                popupTemplateClone.classList.remove('popup_open')
              })
            }

            buttonQR.addEventListener('click', buttonQRCallback)
            buttonInstruction.addEventListener('click', buttonInstructionCallback)
            templateClone.append(popupTemplateClone)
            content.innerHTML = ''
            content.append(templateClone)
          }

          const previewPopup = createPreviewPopup(
            tokenAmount,
            symbol,
            image,
            renderContent
          )

          content.append(previewPopup)
        },


        // for mobile application
        (
          location,
          tokenAmount,
          symbol,
          image
        ) => {
          content.innerHTML = ''

          const renderContent = () => {
            // @ts-ignore          
            const templateClone = templateMobile.content.cloneNode(true).querySelector('.container')
            // @ts-ignore          
            const popupTemplateClone = templateInstructionPopup.content.cloneNode(true).querySelector('.popup')
            const buttonInstruction = templateClone.querySelector('.button_instruction')
            const buttonProof = templateClone.querySelector('.button_redirect')

            const buttonInstructionCallback = () => {
              popupTemplateClone.classList.add('popup_open')
              const closeButton = popupTemplateClone.querySelector('.button_close')
              closeButton.addEventListener('click', () => {
                popupTemplateClone.classList.remove('popup_open')
              })
            }

            const buttonProofCallback = () => {
              window.location.href = location
            }
            
            buttonProof.addEventListener('click', buttonProofCallback)
            buttonInstruction.addEventListener('click', buttonInstructionCallback)
            templateClone.append(popupTemplateClone)
            content.innerHTML = ''
            content.append(templateClone)
          }

          const previewPopup = createPreviewPopup(
            tokenAmount,
            symbol,
            image,
            renderContent
          )
          
          content.append(previewPopup)
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
  }, {
    pathname: '/reclaim/:multiscanQRId/:reclaimSessionId/:multiscanQREncCode/verification-complete',
    element: () => {
      content.innerHTML = ''
      const location = routeLocation()
      const { params: {
        multiscanQRId,
        reclaimSessionId,
        multiscanQREncCode
      } } = location


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
