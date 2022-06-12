export const truncate = (s: string, line: number, len: number) => {
  const end = line * len - 3
  if (end > s.length) return s
  const res = s.slice(0, end) + '...'
  return res
}
