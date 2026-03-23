import { nextTick, ref, watch } from 'vue';
export function create(wait: number): NodeJS.Timer {
  var timer = setInterval(() => {
    nextTick(() => {});
  }, 1000);

  function stop(): void {
    timer && window.clearTimeout(timer);
  }

  function pause(): void {}

  return timer;
}


