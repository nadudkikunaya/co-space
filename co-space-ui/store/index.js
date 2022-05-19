export const state = () => ({
  isLoading: true,
  isBackgroundLoading: false,
})

export const mutations = {
  isLoading(state, value) {
    state.isLoading = value
  },
  isBackgroundLoading(state, value) {
    state.isBackgroundLoading = value
  },
}
