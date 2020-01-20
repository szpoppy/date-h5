/**
 * 新建一个时间对象
 * @param date 时间传入，支持 GMT
 * @param isWipe 是否去除时分秒
 * @return 返回新的时间对象（local）
 */
declare function parse(date?: boolean | number | string | Date, isWipe?: boolean): Date;
/**
 * 将date格式化为formatStr的格式
 * @param date
 * @param formatStr
 */
declare function get(date?: boolean | number | string | Date, formatStr?: string): string | object;
/**
 * date1 和 date2之间的时间差
 * @param date1
 * @param date2
 * @param formatStr 格式化
 */
declare function diff(date1: Date | string, date2: Date | string, formatStr?: string): string | object;
/**
 * 对ms毫秒数格式化输出
 * @param ms
 * @param formatStr
 */
declare function diff(ms: number, formatStr?: string): string | object;
/**
 * 在date上增加时间
 * @param n
 * @param date
 * @param formatStr
 */
declare function append(n: string | number, date: number | string | Date, formatStr?: string): string | object;
declare const _default: {
    parse: typeof parse;
    get: typeof get;
    diff: typeof diff;
    append: typeof append;
};
export default _default;
