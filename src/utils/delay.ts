
// utils/delay.ts
export function useTimeout() {
    let timer: any = null
  
    const delay = (delayTime: number, callback: () => void) => {
      clear()
      timer = setTimeout(callback, delayTime)
    }
  
    const clear = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    }
  
    return { delay, clear }
  }