import { sin, tri, squ } from "./helper"
import Screen from "./Screen"
import Axes from './Axes'
import { IVector2 } from './math/Vector2'
import Signal from "./Signal"
import PWM from "./PWM";

export default class Oscilloscope {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  signals: Array<Signal|PWM> = []
  screen: Screen
  axes: Axes

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')!
    this.screen = new Screen({
      width: window.innerWidth *2,
      height: window.innerHeight *2,
    })
    this.axes = new Axes()

    this.draw()
  }

  addSignal(signal: Signal|PWM) {
    this.signals.push(signal)
  }

  draw() {
    this.canvas.width = this.canvas.width;  
    this.axes.draw(this)
    this.signals.forEach(signal => {
      signal.draw(this)
    })
  }
}