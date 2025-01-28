
export default function createPreviewPopup (
  tokenAmount: string,
  symbol: string,
  image: string,
  onclick: () => void
) {
  const previewPopup = document.getElementById('preview')
  // @ts-ignore          
  const templateClone = previewPopup.content.cloneNode(true).querySelector('.preview')
  const symbolElement = templateClone.querySelector('.preview__symbol')
  const amountElement = templateClone.querySelector('.preview__amount')
  const imageElement = templateClone.querySelector('.preview__image')
  const buttonElement = templateClone.querySelector('.preview__button')

  symbolElement.innerText = symbol
  amountElement.innerText = tokenAmount
  imageElement.src = image

  buttonElement.onclick = onclick
  return templateClone
}
