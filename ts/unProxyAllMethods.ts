export function unProxyAllMethods(target: any) {
  for (var i in target)
    if (target[i].apply !== undefined && target['__' + i] !== undefined && target['__' + i].apply !== undefined) {
      target[i] = target['__' + i];
    }
}
