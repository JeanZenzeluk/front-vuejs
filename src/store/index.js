import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      credenciais: [],
      userToken: null,
      deferredPrompt: null
    },
    getters: {
      getCredencials: state => {
        return state.credenciais
      },
      getUserToken: state => state.userToken,
      getDeferred: state => state.deferredPrompt
    },
    mutations: {
      setCredencials: (state, payload) => {
        state.credenciais = []
        state.credenciais.push(payload)
      },
      setUserToken (state, token) {
        console.log('Chamou setUserToken com token: ' + token)
        state.userToken = token
      },
      setDeferred (state, e) {
        state.deferredPrompt = e
      }
    },
    actions: {
      setCredencials: ({ commit }, payload) => {
        commit('setCredencials', payload)
      },
      logout: () => {
        console.log('Chamou logout')
        window.localStorage.clear('vuex')
      },
      setUserToken: ({ commit }, token) => {
        console.log('Chamou setUserToken com token: ' + token)
        commit('setUserToken', token)
      },
      setDeferred: ({ commit }, e) => {
        commit('setDeferred', e)
      }
    }
    // modules: {
    // showcase
    // },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    // strict: process.env.DEV
  })

  return Store
}
