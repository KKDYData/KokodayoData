import { curry } from 'ramda'
const clickOutSideRow = curry((target, todo, e) => {
  const isContain = target.contains(e.target)

  if (!isContain) {
    todo()
  }
})

export {
  clickOutSideRow
}
