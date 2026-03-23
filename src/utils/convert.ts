import X2JS from "x2js";

export function xml2json(xmlInner: string) {
    var x2js = new X2JS();
    var tradeObj = x2js.xml2js(xmlInner) as any;
    return tradeObj;
}
