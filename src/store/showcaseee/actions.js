/*
export function someAction (context) {
}
*/
setCredencials: ({ commit }, payload) => {
            commit('setCredencials', payload);
        },
        logout: () => {
            window.localStorage.clear('vuex');
        },
        setUserToken: ({ commit }, token) => {
            commit('setUserToken', token)
        },
        setDeferred: ({ commit }, e) => {
            commit('setDeferred', e)
        }
