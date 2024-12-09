type TCheckQRId = (
  multiscanQRId: string
) => false | {
  scanID: string
  scanIDSig: string
}

const checkIfMultiscanIsPresented: TCheckQRId = (multiscanQRId) => {
  if (!window.localStorage) { return false }
  const multiscanQRIdData = window.localStorage.getItem(multiscanQRId)
  if (!multiscanQRIdData) { return false }
  const multiscanQRIdDataParsed = JSON.parse(multiscanQRIdData)
  return multiscanQRIdDataParsed
}

export default checkIfMultiscanIsPresented
