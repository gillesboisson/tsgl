export interface IResize{
  readonly width: number,
  readonly height: number,
  resize(width:number, height:number):void;
}