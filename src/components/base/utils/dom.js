const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/

const trim = (string) => (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')

const camelCase = (name) => {
  return name.replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}

export const on = (element, event, handler) => {
  if (element && event && handler) {
    element.addEventListener(event, handler, false)
  }
}

export const off = (element, event, handler) => {
  if (element && event) {
    element.removeEventListener(event, handler, false)
  }
}

export const once = (element, event, fn) => {
  const listener = function (...args) {
    if (fn) {
      fn.apply(this, ...args)
    }
    off(element, event, listener)
  }
  on(element, event, listener)
}


export const hasClass = (element, cls) => {
  if (!element || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (element.classList) {
    return element.classList.contains(cls)
  } else {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

export const addClass = (element, cls) => {
  if (!element) return
  let curClass = element.className
  const classes = (cls || '').split(' ')

  for (let i = 0;i < classes.length;i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (element.classList) {
      element.classList.add(clsName)
    } else if (!hasClass(element, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!element.classList) {
    element.className = curClass
  }
}

export const removeClass = (el, cls) => {
  if (!el || !cls) return
  const classes = cls.split(' ')
  let curClass = ' ' + el.className + ' '

  for (let i = 0;i < classes.length;i++) {
    const clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

export const getStyle = (element, styleName) => {
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }

  if (element.style[styleName]) return element.style[styleName]
  else {
    const computed = document.defaultView.getComputedStyle(element, '')
    return computed ? computed[styleName] : null
  }
}


export const setStyle = (element, styleName, value) => {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    Object.keys(styleName).forEach(key => {
      if (styleName[key]) setStyle(element, key, styleName[key])
    })
  } else {
    styleName = camelCase(styleName)
    element.style[styleName] = value
  }
}

export const isScroll = (el, vertical) => {
  const determinedDirection = vertical !== null || vertical !== undefined
  const overflow = determinedDirection
    ? vertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')
    : getStyle(el, 'overflow')

  return overflow.match(/(scroll|auto)/)
}

export const getScrollContainer = (el, vertical) => {
  let parent = el
  while (parent) {
    if ([window, document, document.documentElement].includes(parent)) {
      return window
    }
    if (isScroll(parent, vertical)) {
      return parent
    }
    parent = parent.parentNode
  }

  return parent
}

export const isInContainer = (el, container) => {
  const elRect = el.getBoundingClientRect()
  let containerRect

  if ([window, document, document.documentElement, null, undefined].includes(container)) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  } else {
    containerRect = container.getBoundingClientRect()
  }

  return elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
}

