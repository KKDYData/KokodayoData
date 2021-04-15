export function isEmptyStr(str: string) {
  if (str == 'undefined' || !str || !/[^\s]/.test(str)) {
    return true
  } else {
    return false
  }
}
