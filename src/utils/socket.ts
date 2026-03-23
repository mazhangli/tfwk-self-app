let Socket = '' as any;
let setIntervalWesocketPush = null as any;
let uri = '';
/**
 * 建立websocket连接
 * @param {string} url ws地址
 */
export const createSocket = (url:string) => {
  uri = url;
  Socket && Socket.close();
  if (!Socket) {
    console.log('建立websocket连接');
    Socket = new WebSocket(url);
    Socket.onopen = onopenWS;
    Socket.onmessage = onmessageWS;
    Socket.onerror = onerrorWS;
    Socket.onclose = oncloseWS;
  } else {
    console.log('websocket已连接');
  }
  return Socket;
};

/**打开WS之后发送心跳 */
const onopenWS = () => {
  console.log('websocket已连接');
};

/**连接失败重连 */
const onerrorWS = () => {
  Socket.close();
  clearInterval(setIntervalWesocketPush);
  console.log('连接失败重连中');
  if (Socket.readyState !== 3) {
    Socket = null;
    createSocket(uri);
  }
};

/**WS数据接收统一处理 */
const onmessageWS = (e:any) => {
  console.log(e.data);
  window.dispatchEvent(
    new CustomEvent('onmessageWS', {
      detail: {
        data: e.data,
      },
    })
  );
};

/**
 * 发送数据但连接未建立时进行处理等待重发
 * @param {any} message 需要发送的数据
 */
const connecting = (message:any) => {
  setTimeout(() => {
    if (Socket.readyState === 0) {
      connecting(message);
    } else {
      Socket.send(JSON.stringify(message));
    }
  }, 1000);
};

/**
 * 发送数据
 * @param {any} message 需要发送的数据
 */
export const sendWSPush = (message:any) => {
  console.log(message);
  if (Socket !== null && Socket.readyState === 3) {
    Socket.close();
    createSocket(uri);
  } else if (Socket.readyState === 1) {
    Socket.send(message);
  } else if (Socket.readyState === 0) {
    connecting(message);
  }
};

/**断开重连 */
export const oncloseWS = () => {
  clearInterval(setIntervalWesocketPush);
  console.log('websocket已断开....正在尝试重连');
  if (Socket.readyState !== 2) {
    Socket = null;
    createSocket(uri);
  }
};
// /**发送心跳
//  * @param {number} time 心跳间隔毫秒 默认5000
//  * @param {string} ping 心跳名称 默认字符串ping
//  */
// export const sendPing = (time = 5000, ping = 'ping') => {
//   clearInterval(setIntervalWesocketPush);
//   Socket.send(ping);
//   setIntervalWesocketPush = setInterval(() => {
//     Socket.send(ping);
//   }, time);
// };
