export interface EmscriptenModuleExtended extends EmscriptenModule {
  _realloc: (ptr: number, byteLength: number) => number;
  UTF8ToString(ptr: number, length: number): string;
}

export class EmscriptenModuleLoader {
  constructor(protected moduleOptions: any = {}, protected moduleName: string = 'Module') {}

  protected _module: EmscriptenModuleExtended;

  load(moduleJSsath: string): Promise<EmscriptenModuleExtended> {
    const w: any = window;
    return new Promise((resolve) => {
      const onInit = () => {
        this._module = w[this.moduleName];
        this._hookModule();
        this.runtimeInitialize();
        resolve(this._module);
      };

      w[this.moduleName] = {
        onRuntimeInitialized: onInit,

        ...this.moduleOptions,
      };

      var my_awesome_script = document.createElement('script');
      my_awesome_script.setAttribute('src', moduleJSsath);
      document.head.appendChild(my_awesome_script);
    });
  }

  _hookModule() {
    //this._module.realloc = this._module.cwrap('_realloc','number',['number','number']);
  }

  protected runtimeInitialize(): void {}
}

export function setupExtendedModule(module: EmscriptenModule): EmscriptenModuleExtended {
  (<any>window).throwWasmError = (messagePtr: number) => {
    throw new Error('WASM runtime Error : ' + (<EmscriptenModuleExtended>module).UTF8ToString(messagePtr, 1024));
  };

  return module as EmscriptenModuleExtended;
}
