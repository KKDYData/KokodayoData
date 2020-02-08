import localforage from 'localforage'

const localStore = () => localforage.createInstance({
  name: 'testDB'
})

export {
  localStore
}
