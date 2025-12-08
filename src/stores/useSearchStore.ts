import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
  state: () => ({
    query: '',
  }),
  actions: {
    setQuery(value: string) {
      this.query = value
    },
  },
})
