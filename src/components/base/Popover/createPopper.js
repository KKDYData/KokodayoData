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
      name: 'preventOverflow',
      options: {
        padding: 8,
      },
    },
    {
      name: 'flip',
      options: {
        fallbackPlacements: ['top', 'right', 'bottom'],
      }
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
}

export {
  create
}
