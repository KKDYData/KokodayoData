export const getKey = (keys: Record<string, string>) => (key: string) =>
  keys[key] ? keys[key] : key
export const getKeyWithNull = (keys: Record<string, string>) => (key: string) =>
  keys[key] ? keys[key] : null
