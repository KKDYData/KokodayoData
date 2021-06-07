import { KIcon } from './Icon'

// components.d.ts
declare module 'vue' {
  export interface GlobalComponents {
    KIcon: typeof KIcon
  }
}

export {}
