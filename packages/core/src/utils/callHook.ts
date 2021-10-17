export function callHook(hook: Function | undefined, ...args: any[]) {
  if (hook) {
    return hook(...args)
  }
}
