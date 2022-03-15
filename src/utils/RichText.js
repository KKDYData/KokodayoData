export function convert(text, index = 0, tagName) {
  let matchingTag = []
  const content = []
  let normalText = ''
  let i = index
  let isEndTag = false

  while (i < text.length) {
    const cur = text[i]
    if (cur === '<') {
      // 准备转移到子节点处理
      if (normalText) {
        content.push(normalText)
        normalText = ''
      }
      matchingTag.push(cur)
    } else if (cur === '>' && matchingTag.length) {
      const curTagName = matchingTag.slice(1).join('')
      if (curTagName !== '/') {
        // 判断是否是tag
        if (['@', '$'].includes(curTagName[0])) {
          // 创建子节点
          const node = convert(text, i + 1, curTagName)
          content.push(node)
          matchingTag = []

          // 从子节点结束的位置继续
          i = node.length
        } else {
          // <文本>
          content.push('<' + curTagName + '>')
          matchingTag = []
        }
      } else {
        isEndTag = true
        // 结束节点
        break
      }
    } else if (matchingTag.length) {
      matchingTag.push(cur)
    } else {
      normalText += cur
    }

    i++
  }

  if (tagName && !isEndTag) throw new Error('parse text error')

  if (normalText) content.push(normalText)

  return RichTextNode.create(tagName ?? '@root', content, {}, i) //createNode(tagName ?? 'root', content, {}, i)
}

const typeMap = {
  '@': 'rich-color',
  $: 'rich-style',
}

class RichTextNode {
  /**
   * @type {string}
   */
  tagName

  /**
   * @type {string}
   */
  tagType

  /**
   * @type {(RichTextNode | string)[]}
   */
  children
  config

  /**
   * @type {number}
   */
  length

  /**
   * @param tagName {string}
   * @param children {(RichTextNode | string)[]}
   * @param config {Record<string, any>}
   * @param length {number}
   */
  constructor(tagName, children, config, length) {
    this.tagName = tagName.slice(1)
    this.tagType = tagName[0]
    this.children = children
    this.config = config
    this.length = length
  }

  toHtml() {
    return (
      `<span class="${typeMap[this.tagType]} ${this.tagName}">` +
      this.children.reduce((res, v) => {
        const text =
          typeof v === 'string' ? v.replaceAll('\\n', '<br />') : v.toHtml()
        return res + text
      }, '') +
      '</span>'
    )
  }

  static create(tagName, children, config, length) {
    return new RichTextNode(tagName, children, config, length)
  }
}
