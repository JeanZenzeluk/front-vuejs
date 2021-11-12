
export const setCredencials = (state, payload) => {
  state.credenciais = []
  state.credenciais.push(payload)
}
export const setUserToken = (state, token) => {
  state.userToken = token
}
export const setDeferred = (state, e) => {
  state.deferredPrompt = e
}
