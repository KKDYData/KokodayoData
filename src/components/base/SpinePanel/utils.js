import { loadImg } from '@/utils'

const baseFetch = url => fetch(url, {
  method: 'GET',
  mode: 'cors'
})

const fetchPic = (url) => baseFetch(url).then(res => res.blob())
  .then(res => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (err) => {
      console.error(err)
      reject(err)
    }
    reader.readAsDataURL(res)
  }))
  .then(base64 => {
    return loadImg(base64)
  })

const fetchText = url => baseFetch(url).then(res => res.text())

const fetchBuffer = url => baseFetch(url).then(res => res.arrayBuffer())

export {
  fetchPic,
  fetchText,
  fetchBuffer
}
