import callServer from '../util';
import { formatToDateTime } from '@/utils/dateUtil';
import { getStore, setStore } from '@/utils/cache/storage';
import { serverTime } from './public';
import moment from 'moment';

export function scheduling$branch$cathe$get() {
  return getStore('schedulingBranch');
}
export async function scheduling$branch$cathe$set() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  const json = {
    method: 'SchedulingBranch',
    finaltime: systime,
    operator: empid,
    info: {},
  };
  var info = await callServer(json);
  if (info) {
    const form = info.list;
    setStore('schedulingBranch', form);
    return true;
  } else {
    return false;
  }
}
export function scheduling$cathe$get() {
  return getStore('scheduling');
}
export async function scheduling$cathe$set() {
  const date = await serverTime();
  console.log('缓存号源日期：' + date);
  var forms = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = moment(date, 'YYYYMMDDHHmmss').toDate();
    currentDate.setDate(currentDate.getDate() + i);
    const form = await scheduling$day(moment(currentDate).format('YYYY-MM-DD'));
    forms.push(...form);
    try{
      //超级长的情况会失败
      setStore('scheduling', forms);
    }catch(err){
      console.log(err);
      continue;
    }
  }
  
  return true;
}
export async function scheduling$day(date: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'Scheduling',
    finaltime: systime,
    operator: empid,
    info: {
      scheduleInfo: {
        registDate: date,
      },
    },
  };
  var info = await callServer(json);
  if (info) {
    return info.list;
  } else {
    return null;
  }
}
export async function scheduling$date() {
  const sourceScheduleList = scheduling$cathe$get();
  // 存储已处理的 dayString，用于去重
  const processedDayStrings = new Set();
  // 临时数组存储结果
  const result: {
    regType: string;
    day: any;
    dayString: any;
    week: any;
    dayNumber: any;
    noon: any;
    holiday: string;
  }[] = [];

  // 遍历源排班数组
  sourceScheduleList.forEach(
    (item: { dayString: any; day: any; dayNumber: any; dayWeek: any; noon: any }) => {
      const { dayString, day, dayNumber, dayWeek, noon } = item;

      // 若该日期未处理过，则进行组装
      if (!processedDayStrings.has(dayString)) {
        // 标记该日期已处理
        processedDayStrings.add(dayString);
        // 组装目标结构
        result.push({
          regType: '1',
          day: day,
          dayString: dayString,
          week: dayWeek,
          dayNumber: dayNumber,
          noon: noon || null,
          holiday: '0',
        });
      }
    }
  );

  return result;
  //   const systime = formatToDateTime(new Date().getTime());
  //   var empid = getStore('system').empId;
  //   // var patientid = getStore('history').patientid;
  //   const json = {
  //     method: 'SchedulingDate',
  //     finaltime: systime,
  //     operator: empid,
  //     info: {},
  //   };
  //   var info = await callServer(json);
  //   if (info) {
  //     return info.list;
  //   } else {
  //     return null;
  //   }
}
export async function scheduling$branch() {
  return scheduling$branch$cathe$get();
  //   // 以前每次都取最新的，现在改为缓存取数
  //   const systime = formatToDateTime(new Date().getTime());
  //   var empid = getStore('system').empId;
  //   // var patientid = getStore('history').patientid;
  //   const json = {
  //     method: 'SchedulingBranch',
  //     finaltime: systime,
  //     operator: empid,
  //     info: {},
  //   };
  //   var info = await callServer(json);
  //   if (info) {
  //     return info.list;
  //   } else {
  //     return null;
  //   }
}

export async function scheduling$timer(branch: string, date: string, doctor: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  var isIns = getStore('media').type === '医保卡' ? 1 : 0;
  const json = {
    method: 'Scheduling',
    finaltime: systime,
    operator: empid,
    info: {
      scheduleType: '1',
      scheduleInfo: {
        scheduleId: null,
        registDate: date,
        branchCode: branch,
        doctorCode: doctor,
        isIns: isIns,
      },
    },
  };
  var info = await callServer(json);
  if (info) {
    console.log("test");
    return info.list;
  } else {
    return null;
  }
}
export async function scheduling$today(branch: string, doctor: string) {
  const date = await serverTime();
  const systime = moment(date, 'YYYYMMDDHHmmss');
  let sourceScheduleList;
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  var isIns = getStore('media').type === '医保卡' ? 1 : 0;
  if (getStore('machine').hospitalcode === 'bwjysq' && branch === '00007') {
    sourceScheduleList = await scheduling$timer(branch, systime.format('YYYY-MM-DD'), doctor||'');
  } else {
    sourceScheduleList = scheduling$cathe$get();
  }
  if(!sourceScheduleList || sourceScheduleList.length === 0) {
    console.log(`排班数据为空，branch=${branch}, doctor=${doctor}, date=${systime.format('YYYY-MM-DD HH:mm:ss')}`);
    return [];
  }
  var result = sourceScheduleList.filter(
    (item: { dayString: string; type: any; branchCode: any }) => {
      return item.branchCode === branch && item.dayString === systime.format('YYYY-MM-DD');
    }
  );
  if (doctor && doctor !== '') {
    result = result.filter((item: { doctorCode: any }) => {
      return item.doctorCode === doctor;
    });
  }
  if (getStore('machine').hospitalcode === 'bjjcpfyy' && isIns) {
    return result.filter((item: { isIns: any }) => {
      return item.isIns === isIns;
    });
  }
  var baseResult = result;
  result = result.filter((item: any) => {
    const { timeFlag, dayString } = item;
    if (!timeFlag) return []; // 无时间区间的直接过滤

    // 3. 分割timeFlag，获取开始时间和结束时间（格式：HH:mm）
    const [startTimeStr, endTimeStr] = timeFlag.split('-');
    if (!startTimeStr || !endTimeStr) return [];

    // 4. 拼接排班日期+起止时间，转为moment对象（保证日期一致，仅对比时间）
    const fullStartDate = moment(`${dayString} ${startTimeStr}:00`, 'YYYY-MM-DD HH:mm:ss');
    const fullEndDate = moment(`${dayString} ${endTimeStr}:00`, 'YYYY-MM-DD HH:mm:ss');

    // 5. 判断当前时间是否在[开始时间, 结束时间]区间内（包含边界）
    return systime.isBetween(fullStartDate, fullEndDate, null, '[]');
  });
  if (!result || result.length === 0) {
    console.log(
      `没有找到符合条件的排班信息，branch=${branch}, doctor=${doctor}, date=${systime.format(
        'YYYY-MM-DD HH:mm:ss'
      )}`
    );
    return [];
    //// 子步骤1：处理baseResult，提取每个条目对应的「时段开始时间」和「时间差」
    // const scheduleWithTimeDiff = baseResult
    //   .map((item: any) => {
    //     const { timeFlag, dayString } = item;
    //     if (!timeFlag) return null;

    //     const [startTimeStr, endTimeStr] = timeFlag.split('-');
    //     if (!startTimeStr || !endTimeStr) return null;

    //     // 拼接完整开始时间
    //     const fullStartDate = moment(`${dayString} ${startTimeStr}:00`, 'YYYY-MM-DD HH:mm:ss');
    //     // 计算与当前时间的时间差（毫秒级，未来时段为正数，已过期为负数）
    //     const timeDiff = fullStartDate.valueOf() - systime.valueOf();

    //     return {
    //       ...item,
    //       fullStartDate, // 时段开始时间对象
    //       timeDiff, // 与当前时间的差值
    //       timeFlag, // 保留时段标识，用于后续分组
    //     };
    //   })
    //   .filter((item: any) => item !== null && item.timeDiff > 0); // 过滤无效数据和已过期时段

    // // 子步骤2：若无未来时段，返回空数组
    // if (scheduleWithTimeDiff.length === 0) {
    //   console.log(
    //     `无任何未来排班时段，branch=${branch}, doctor=${doctor}, date=${systime.format(
    //       'YYYY-MM-DD HH:mm:ss'
    //     )}`
    //   );
    //   return [];
    // }

    // // 子步骤3：找到时间差最小的（最近的）未来时段
    // const minTimeDiff = Math.min(...scheduleWithTimeDiff.map((item: any) => item.timeDiff));
    // const nearestTimeFlag = scheduleWithTimeDiff.find(
    //   (item: any) => item.timeDiff === minTimeDiff
    // )?.timeFlag;

    // // 子步骤4：返回该时段的所有排班数据
    // const nearestSchedule = baseResult.filter((item: any) => item.timeFlag === nearestTimeFlag);
    // return nearestSchedule;
  }
  return result;
}

export async function scheduling$schedule(branch: string, date: string, doctor: string) {
  const systime = moment(await serverTime(), 'yyyyMMddHHmmss');
  var empid = getStore('system').empId;
  // var patientid = getStore('history').patientid;
  var isIns = getStore('media').type === '医保卡' ? 1 : 0;
  const sourceScheduleList = scheduling$cathe$get();
  var result = sourceScheduleList.filter((item: { branchCode: string }) => {
    return item.branchCode === branch;
  });
  if (date && date !== '') {
    result = result.filter((item: { dayString: any }) => {
      return item.dayString === date;
    });
  }
  if (doctor && doctor !== '') {
    result = result.filter((item: { doctorCode: any }) => {
      return item.doctorCode === doctor;
    });
  }
  if (getStore('machine').hospitalcode === 'bjjcpfyy' && isIns) {
    return result.filter((item: { isIns: any }) => {
      return item.isIns === isIns;
    });
  }

  // result = result.filter((item: any) => {
  //   const { timeFlag, dayString } = item;
  //   if (!timeFlag) return false; // 无时间区间的直接过滤

  //   // 3. 分割timeFlag，获取开始时间和结束时间（格式：HH:mm）
  //   const [startTimeStr, endTimeStr] = timeFlag.split('-');
  //   if (!startTimeStr || !endTimeStr) return false;

  //   // 4. 拼接排班日期+起止时间，转为moment对象（保证日期一致，仅对比时间）
  //   const fullStartDate = moment(`${dayString} ${startTimeStr}`, 'YYYY-MM-DD HH:mm');
  //   const fullEndDate = moment(`${dayString} ${endTimeStr}`, 'YYYY-MM-DD HH:mm');

  //   // 5. 判断当前时间是否在[开始时间, 结束时间]区间内（包含边界）
  //   return systime.isBetween(fullStartDate, fullEndDate, null, '[]');
  // });
  if (!result || result.length === 0) {
    console.log(`没有找到符合条件的排班信息，branch=${branch}, doctor=${doctor}, date=${date}`);
    return [];
  }
  return result;
}
export async function scheduling$primary(scheduleType: string, id: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'Scheduling',
    finaltime: systime,
    operator: empid,
    info: {
      scheduleType: scheduleType,
      id: id,
      scheduleInfo: {
        branchCode: null,
        doctorCode: null,
        registDate: null,
        isIns: 0,
      },
    },
  };
  var info = await callServer(json);
  if (info) {
    return info.list;
  } else {
    return null;
  }
}
////当日挂号
export async function regist$budget(scheduleId: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  var cardtype = getStore('media').type === '医保卡' ? 1 : 0;
  var menuCode = getStore('last').menuCode;
  if (menuCode === 'register.today' || menuCode === 'appointment') menuCode = '';
  const json = {
    method: 'RegistBudget',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      type: 0, //0当日 1预约
      isIns: cardtype,
      scheduleOrderno: null,
      menuCode: menuCode,
      scheduleInfo: {
        scheduleId: scheduleId,
        doctorCode: '',
        branchCode: '',
        registType: '',
        registDate: '',
        timeSpan: '',
      },
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}

////预约挂号
export async function regist$schedule(scheduleId: string) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  var cardtype = getStore('media').type === '医保卡' ? 1 : 0;
  const json = {
    method: 'RegistBudget',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      type: 1, //0当日 1预约
      isIns: cardtype,
      scheduleOrderno: null,
      scheduleInfo: {
        scheduleId: scheduleId,
        doctorCode: '',
        branchCode: '',
        registType: '',
        registDate: '',
        timeSpan: '',
      },
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
////取消预约
////预约挂号
export async function schedule$cancel(scheduleOrderno: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'ScheduleCancel',
    finaltime: systime,
    operator: empid,
    info: {
      scheduleOrderno: scheduleOrderno,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
////预约取号
export async function regist$scheduled(scheduleOrderno: number) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  var cardtype = getStore('media').type === '医保卡' ? 1 : 0;
  const json = {
    method: 'RegistBudget',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
      type: 0, //0当日 1预约
      isIns: cardtype,
      scheduleOrderno: scheduleOrderno,
      scheduleInfo: {},
    },
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}

export async function regist$cancel(hisOrder: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  const json = {
    method: 'RegistCancel',
    finaltime: systime,
    operator: empid,
    info: hisOrder,
  };
  var info = await callServer(json);
  if (info) {
    return true;
  } else {
    return false;
  }
}
export async function regist$divide(hisOrder: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'RegistDivide',
    finaltime: systime,
    operator: empid,
    info: hisOrder,
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function regist$commit(hisOrder: any) {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'RegistCommit',
    finaltime: systime,
    operator: empid,
    info: hisOrder,
  };
  var info = await callServer(json);
  if (info) {
    return info;
  } else {
    return null;
  }
}
export async function regist$Reserve() {
  const systime = formatToDateTime(new Date().getTime());
  var empid = getStore('system').empId;
  var patientid = getStore('history').patientid;
  const json = {
    method: 'RegistReserve',
    finaltime: systime,
    operator: empid,
    info: {
      patientId: patientid,
    },
  };
  var info = await callServer(json);
  if (info) {
    return info.item;
  } else {
    return null;
  }
}
