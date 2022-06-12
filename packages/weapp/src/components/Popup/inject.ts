import { inject, InjectionKey, provide, reactive, Ref } from 'vue'

const PopupInjectionKey: InjectionKey<{
  id: string | number
  show: boolean
  el: HTMLElement | null
}> = Symbol('ItemInjectionKey')

export const providePopupState = () => {
  const state = reactive({
    id: '',
    show: false,
    el: null,
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
