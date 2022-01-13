import { inject, InjectionKey, provide, reactive } from 'vue'

const PopupInjectionKey: InjectionKey<{
  id: string | number
  show: boolean
}> = Symbol('ItemInjectionKey')

export const providePopupState = () => {
  const state = reactive({
    id: '',
    show: false,
  })
  provide(PopupInjectionKey, state)
  return state
}

export const usePopupState = () => {
  const state = inject(PopupInjectionKey)
  const setPopupId = (id: string | number) => {
    if (!state) return
    state.id = id
    state.show = true
  }

  return { setPopupId, state }
}
