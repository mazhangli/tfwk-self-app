import { Info } from "@/trans/server/self/logger";

/**
 * 存储localStorage
 */
export const setStore = (name: string, content: string| object) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
	if(name ==="reportPrinter"){
        var _obj = JSON.parse(content);
        Info("printer.state", _obj.state, _obj.info);
    }
}

/**
 * 获取localStorage
 */
export const getStore = (name: string): any => {
	if (!name) return;
	var content = window.localStorage.getItem(name);
	try{
		content = JSON.parse(content as string);
		return content;
	}catch(e){
		return content
	}
	
}

/**
 * 删除localStorage
 */
export const removeStore = (name: string) => {
	if (!name) return;
	window.localStorage.removeItem(name);
}
