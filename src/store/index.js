import { createStore } from 'vuex'

export default createStore({
  state: {
    theme: ''
  },
  mutations: {
    setTheme(state, theme) {
      // console.log(theme);
      state.theme = theme
      window.localStorage.setItem('theme', theme)
    },
    getTheme(state) {
      let theme = window.localStorage.getItem('theme') || 'light'
      state.theme = theme
      // console.log(theme);
    }
  },
  actions: {
  },
  modules: {
  }
})
