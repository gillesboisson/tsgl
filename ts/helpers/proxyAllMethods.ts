import { unProxyAllMethods } from './unProxyAllMethods';
export function proxyAllMethods(
  target: any,
  callback: (funcName: string, args: any) => any,
  callsLimit?: number,
  callWhenFinished?: (target: any) => void,
) {
  for (const i in target)
    if (target[i].apply !== undefined) {
      target['__' + i] = target[i];
      target[i] = function() {
        callback(i, arguments);
        const res = this['__' + i].apply(this, arguments);
        if (callsLimit !== undefined) {
          callsLimit--;
          if (callsLimit <= 0) {
            unProxyAllMethods(target);
            if (callWhenFinished !== undefined) callWhenFinished(target);
          }
        }
        return res;
      };
    }
}
