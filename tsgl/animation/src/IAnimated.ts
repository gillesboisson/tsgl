export interface IAnimated {
  animationStart(): void;
  animationEnd(time: number): void;
  animationUpdate(time: number, elapsedTime: number): void;
}
