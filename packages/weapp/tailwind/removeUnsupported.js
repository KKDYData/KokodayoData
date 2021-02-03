const postcss = require("postcss")

function isSupportedProperty(prop, val = null) {
  const rules = supportedProperties[prop]
  if (!rules) return false

  if (val) {
    // if (val.endsWith('vh') || val.endsWith('vw') || val.endsWith('em')) {
    //   return false
    // }

    if (Array.isArray(rules)) {
      return rules.includes(val)
    }
  }

  return true
}

/**
 * @param {string} selector
 */
function isSupportedRule(selector) {
  if (
    selector.endsWith(":hover") ||
    selector.includes("\\") ||
    selector.includes(":not")
  ) {
    return false
  }

  return true
}

module.exports = postcss.plugin(
  "postcss-taro-tailwind",
  (options = { debug: true }) => {
    return root => {
      root.walkRules(rule => {
        if (rule.parent.name === "media") {
          rule.parent.remove()
        }

        if (!isSupportedRule(rule.selector)) {
          rule.remove()
        }

        if (/\*,?/.test(rule.selector)) {
          const replaceStr = /\*,/.test(rule.selector) ? "root, " : "root"
          rule.selector = rule.selector.replace(/\*,?/, replaceStr)
        }

        rule.walkDecls(decl => {
          if (decl.prop === "visibility") {
            switch (decl.value) {
              case "hidden":
                decl.replaceWith(decl.clone({ value: "collapse" }))
                return
            }
          }

          if (decl.prop === "vertical-align") {
            switch (decl.value) {
              case "middle":
                decl.replaceWith(decl.clone({ value: "center" }))
                return
            }
          }

          // allow using rem values (default unit in tailwind)
          if (decl.value.includes("rem")) {
            options.debug &&
              console.log(
                "replacing rem value",
                decl.prop,
                decl.value,
                "=>",
                "" + parseFloat(decl.value) * 16
              )
            decl.value = "" + parseFloat(decl.value) * 16 + "px"
          }

          if (
            !isSupportedProperty(decl.prop, decl.value) &&
            !/^--/.test(decl.prop)
          ) {
            options.debug && console.log("removing ", decl.prop, decl.value)
            rule.removeChild(decl)

            if (rule.selector.includes("spin")) {
              console.log("x", rule.nodes)
            }

            if (rule.nodes.length === 0) {
              rule.remove()
            }
          }
        })
      })
    }
  }
)

const supportedProperties = {
  "align-content": true,
  "align-items": true,
  "align-self": true,
  background: true,
  "background-color": true,
  "background-image": true,
  "background-position": true,
  "background-repeat": ["repeat", "repeat-x", "repeat-y", "no-repeat"],
  "background-size": true,
  "border-bottom-color": true,
  "border-bottom-left-radius": true,
  "border-bottom-right-radius": true,
  "border-bottom-width": true,
  "border-color": true,
  "border-left-color": true,
  "border-left-width": true,
  "border-radius": true,
  "border-right-color": true,
  "border-right-width": true,
  "border-style": true,
  "border-top-color": true,
  "border-top-left-radius": true,
  "border-top-right-radius": true,
  "border-top-width": true,
  "border-width": true,
  "box-shadow": true,
  "clip-path": true,
  color: true,
  display: true,
  flex: true,
  "flex-direction": true,
  "flex-grow": true,
  "flex-shrink": true,
  "flex-wrap": true,
  font: true,
  "font-family": true,
  "font-size": true,
  "font-style": ["italic", "normal"],
  "font-weight": true,
  gap: true,
  "grid-auto-flow": true,
  "grid-column": true,
  "grid-column-end": true,
  "grid-column-start": true,
  "grid-row": true,
  "grid-row-end": true,
  "grid-row-start": true,
  "grid-template-columns": true,
  "grid-template-rows": true,
  height: true,
  "horizontal-align": ["left", "center", "right", "stretch"],
  "justify-content": true,
  "letter-spacing": true,
  "line-height": true,
  margin: true,
  "margin-bottom": true,
  "margin-left": true,
  "margin-right": true,
  "margin-top": true,
  "max-height": true,
  "max-width": true,
  "min-height": true,
  "min-width": true,
  "object-fit": true,
  "object-position": true,
  opacity: true,
  overflow: true,
  "overflow-wrap": true,
  padding: true,
  "padding-bottom": true,
  "padding-left": true,
  "padding-right": true,
  "padding-top": true,
  "placeholder-color": true,
  position: true,
  scale: true,
  "text-align": ["left", "center", "right"],
  "text-decoration": ["none", "line-through", "underline"],
  "text-transform": ["none", "capitalize", "uppercase", "lowercase"],
  "transform-origin": true,
  transition: true,
  "transition-duration": true,
  "transition-property": true,
  "transition-timing-function": true,
  translate: true,
  "vertical-align": ["top", "center", "bottom", "stretch"],
  visibility: ["visible", "collapse"],
  "white-space": true,
  width: true,
  "word-break": true,
  "z-index": true,
  animation: true,
  "transition-delay": true,
  transform: true
}
