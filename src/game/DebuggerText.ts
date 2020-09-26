import { SimpleText, SimpleTextFont } from '../2d/SimpleText';

export class DebuggerText extends SimpleText {
  static _defaultInstance: DebuggerText;
  static init(font: SimpleTextFont): DebuggerText {
    this._defaultInstance = new DebuggerText(font);
    this._defaultInstance.upperCaseOnly = true;
    return this._defaultInstance;
  }

  static get defaultInstance(): DebuggerText {
    if (!this._defaultInstance) throw new Error('DebuggerText : default instance not initialized');
    return this._defaultInstance;
  }

  public clear() {
    this._text = '';
  }

  public log(text: string) {
    this.text += text + '\n';
  }
}
