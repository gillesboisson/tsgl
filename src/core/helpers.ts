export function interceptMethod(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  target: any,
  methodName: string,
  func: (funcName: string, args: IArguments) => void,
  condition = true,
): void {
  if (condition === false) return;
  // eslint-disable-next-line @typescript-eslint/ban-types
  const targetFunc: Function = target[methodName];
  target[methodName] = function () {
    // eslint-disable-next-line prefer-rest-params
    func(methodName, arguments);
    // eslint-disable-next-line prefer-rest-params
    targetFunc.apply(target, arguments);
  };
}

export function interceptMethods(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  target: any,
  methodNames: string[],
  func: (funcName: string, args: IArguments) => void,
): void {
  methodNames.forEach((methodName) => interceptMethod(target, methodName, func));
}
