import URLParse from 'url-parse'

export const isCrossOrigin = (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('url is required and should be string')
  }
  if (!/^data:/.test(url)) {
    let parsedUrl = new URLParse(url)
    return parsedUrl.origin !== window.location.origin
  }
  return false
}

