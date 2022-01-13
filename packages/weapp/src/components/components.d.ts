import { DefineComponent } from 'vue'
import { KIcon } from './Icon'

// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    KIcon: typeof KIcon
    'page-container': DefineComponent<{
      show?: boolean
      duration?: number
      zIndex?: number
      position?: 'top' | 'bottom' | 'center' | 'right'
      'close-on-slideDown'?: boolean
    }>
  }
}

export {}
