// utils/asyncDelay.ts
export function delay(time: number): Promise<void>
export function delay<T>(time: number, callback: () => T): Promise<T>
export function delay<T>(time: number, callback?: () => T): Promise<void | T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (callback) {
        resolve(callback())
      } else {
        resolve()
      }
    }, time)
  })
}
