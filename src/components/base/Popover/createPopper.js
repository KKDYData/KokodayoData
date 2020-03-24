import { createPopper } from '@popperjs/core'
import { mergeDeepWithKey, concat } from 'ramda'
import { PopupManager } from '../utils/popup/popup-manager'
import './popper.styl'


const concatValues = (k, l, r) => k == 'modifiers' ? concat(l, r) : r

const defaultOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
    {
      name: 'hide'
    },
    {
      name: 'computeStyles'
    },
    {
      name: 'addZIndex',
      fn: ({ state }) => {
        state.styles.popper.zIndex = PopupManager.nextZIndex()
      },
      phase: 'beforeWrite',
      enabled: true
    }
  ],
  placement: 'top',
}


const create = (target, tooltip, options) => {
  const { modifiers, placement, onFirstUpdate } = mergeDeepWithKey(concatValues, defaultOptions, options)
  // let popperInstance = null
  return () => createPopper(target, tooltip, {
    modifiers,
    placement,
    onFirstUpdate
  })

  // const show = () => {
  //   tooltip.setAttribute('data-show', '')
  //   createInstance()
  // }
  // const hide = () => {
  //   tooltip.removeAttribute('data-show')
  //   destroy()
  // }
  // const destroy = () => {
  //   if (popperInstance) {
  //     popperInstance.destroy()
  //     popperInstance = null
  //   }
  // }

  // return {
  //   popperInstance,
  //   show,
  //   hide,
  //   destroy
  // }
}

export {
  create
}
