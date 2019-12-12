export function interceptMethod(
  target: any,
  methodName: string,
  func: (funcName: string, args: IArguments) => void,
  condition = true,
) {
  if (condition === false) return;
  const targetFunc: Function = target[methodName];
  target[methodName] = function() {
    func(methodName, arguments);
    targetFunc.apply(target, arguments);
  };
}

export function interceptMethods(
  target: any,
  methodNames: string[],
  func: (funcName: string, args: IArguments) => void,
) {
  methodNames.forEach((methodName) => interceptMethod(target, methodName, func));
}
