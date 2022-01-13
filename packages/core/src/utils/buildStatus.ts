export const buildStatusArray =
  (toCh: (s: string) => string | null) => (status: Record<string, any>) => {
    return Object.entries(status)
      .map(([key, value]) => {
        const label = toCh(key)
        if (!label) return
        else return { key, value, label }
      })
      .filter(
        (
          el
        ): el is {
          key: string
          value: any
          label: string
        } => !!el
      )
  }
