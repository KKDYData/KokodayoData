import { defineStore } from 'pinia'

export const usePopupStore = defineStore('popupStore', {
  state: (): {
    comp: any
    props: Record<any, any>
    height: string
  } => ({
    comp: 'view',
    props: {},
    height: '60vh',
  }),
})
