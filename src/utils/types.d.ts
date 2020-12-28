// 为simple/index.js写全局类型声明，在types.d.ts中添加如下代码
declare module "simple" {
    let service: any;
    export function service(): void;
    export default service;
}