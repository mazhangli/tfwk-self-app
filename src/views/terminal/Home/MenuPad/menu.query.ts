import { menu } from '@/trans/server/self/machine';
import { getStore } from '@/utils/cache/storage';
import { ref, toRaw } from 'vue';

const grid = { col: 4, row: 6, gutter: '5px' };
const padding = { left: 100, right: 100, top: 20, bottom: 20 };
interface areaMete {
  name: String;
  menu: any;
  area: string;
  grid: string;
}

const getGrid = (): any => {
  var _grid = getStore('machine').grid || grid;
  if (_grid === undefined || _grid === null) throw new Error('menu grid view is undefined');
  return _grid;
};
const getAreabyStore = (): areaMete[][] => {
  var to = getStore('menu');
  //console.log(to);
  return getArea(to);
};

const getArea = (menus: any[]): areaMete[][] => {
  var page = 0;
  var _grid = getGrid();
  // _grid.push([]);
  const pageCount = _grid.row * _grid.col;
  //console.log('pageCount', pageCount);
  var items: areaMete[] = [];
  var result: areaMete[][] = [];
  var item: areaMete;

  menus.forEach((el) => {
    if (el.children && el.children.length > 0) el.type = 'main';
    if (el.type === 'main') {
      item = {
        name: el.menuname,
        menu: el,
        area: 'grid-area:' + el.menucode.replaceAll('.', '').toUpperCase() + ';',
        grid: el.menucode.replaceAll('.', '').toUpperCase(),
      };
    } else if (el.type === 'query') {
      item = {
        name: el.menuname,
        menu: el,
        area: 'grid-area:' + el.menucode.replaceAll('.', '').toUpperCase() + ';',
        grid: el.menucode.replaceAll('.', '').toUpperCase(),
      };
    } else {
      //console.log(el);
      throw new Error('menu type is undefined');
    }
    push(result, item);
  });
  return result;
};
const push = function (total: any, el: any) {
  var _grid = getGrid();
  var so = false;
  if (!el || !el.menu) return;
  switch (el.menu.type) {
    case 'main':
      so = false;
      for (var row = 0; row < _grid.row; row++) {
        if (!total[row]) total[row] = [];
        if (!total[row + 1]) total[row + 1] = [];
        for (var col = 0; col < _grid.col; col++) {
          if (total[row] && total[row][col]) {
            continue;
          } else {
            if (row % 2 === 0) {
              total[row][col] = el;
              total[row + 1][col] = el;
              so = true;
              break;
            }
          }
        }
        if (so) break;
      }
      break;
    default:
      so = false;
      for (var row = 0; row < _grid.row; row++) {
        if (!total[row]) total[row] = [];
        if (!total[row + 1]) total[row + 1] = [];
        for (var col = 0; col < _grid.col; col++) {
          if (total[row] && total[row][col]) {
            if (row % 2 === 0) {
              if (total[row + 1] && total[row + 1][col]) {
                continue;
              } else {                
                total[row + 1][col] = el;
                so = true;
                break;
              }
            }
          } else {
            total[row][col] = el;
            so = true;
            break;
          }
        }
        if (so) break;
      }
      break;
  }
};

const getAreaTemplate = (to: any): string[] => {
  var _grid = getGrid();
  var gridStyle = [
    'grid-template-columns: repeat(' + to[0].length + ', 1fr);',
    'grid-template-rows: repeat(' + (to.length + 1) + ', 1fr);',
    'place-content: center center;',
  ];
  var hospital = getStore('machine').hospitalcode;
  if (hospital && hospital === 'mhzyy') {
    gridStyle = [
      'grid-template-columns: repeat(' + to[0].length + ', 5rem);',
      'grid-template-rows: repeat(' + (to.length + 1) + ', 2.5rem);',
      'place-content: center center;',
    ];
  }

  var template = 'grid-template-areas: ';
  for (var i = 0; i < to.length; i++) {
    template += "'";
    for (var j = 0; j < to[0].length; j++) {
      if (to[i][j] && to[i][j].grid) template += to[i][j].grid + ' ';
      else template += '. ';
    }
    template += "' ";
  }
  gridStyle.push(template);
  return gridStyle;

  // var _grid = getGrid();
  // //console.log('debug',to ,_grid);
  // var gridStyle = [
  //   'grid-template-columns: repeat(' + _grid.col + ', 1fr)',
  //   'grid-template-rows: repeat(' + _grid.row + ', 1fr);',
  // ];
  // var template = 'grid-template-areas: ';
  // for(var i = 0; i < _grid.row; i++){
  //   template += "'";
  //   for(var j = 0; j < _grid.col; j++){
  //     //console.log(i, j);
  //     // if(to[i][j] && to[i][j].grid)
  //     //   template += to[i][j].grid + " ";
  //     // else
  //     //   template += ". ";
  //     if(to[i * _grid.col + j] && to[i * _grid.col + j].grid)
  //       template += to[i * _grid.col + j].grid + " ";
  //     else
  //       template += ". ";
  //   }
  //   template += "' ";
  // }
  // gridStyle.push(template);
  // return gridStyle;
};
const getMenusCompress = (to: any): any[] => {
  var _grid = getGrid();
  var array: any[] = [];

  to.forEach((item: any) => {
    item.forEach((s: any) => {
      array.push(s);
    });
  });
  return array;
  ////console.log('array', array.slice(0, array.length - 1));
  //return array.slice(0, array.length - 1);
};
export { getArea, getAreabyStore, getAreaTemplate, getMenusCompress };
