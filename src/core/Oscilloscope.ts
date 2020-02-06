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

    // this.addSignal(new Signal({
    //   f: function(x: number, {freq, amp, threshold}: any) {
    //     return sin({ freq, x, amp, threshold })
    //   },
    //   state: {
    //     freq: 110,
    //     amp: 1,
    //     threshold: 0.5,
    //   },
    //   color: 'blue',
    //   lineWidth: 1,
    //   visible: true
    // }))
// 
    // this.addSignal(new Signal({
    //   f: function(x: number, {freq, amp}: any) {
    //     return tri({ freq, x, amp })
    //   },
    //   state: {
    //     freq: 2,
    //     amp: 1
    //   },
    //   color: 'green',
    //   lineWidth: 1,
    //   visible: false
    // }))
// 
    // this.addSignal(new Signal({
    //   f: function(x: number, {freq, amp}: any) {
    //     return squ({ freq, x, amp })
    //   },
    //   state: {
    //     freq: 2,
    //     amp: 1
    //   },
    //   color: 'pink',
    //   lineWidth: 1,
    //   visible: false
    // }))
// 
    // this.addSignal(new Signal({
    //   f: function(x: number, {signals}: any) {
    //     return signals.reduce((acc: number, signal: Signal) => {
    //       return acc + signal.getAt(x)
    //     }, 0)
    //   },
    //   state: {
    //     signals: [this.signals[0], this.signals[1], this.signals[2]]
    //   },
    //   color: 'violet',
    //   lineWidth: 2,
    //   visible: false
    // }))

    // const pwm = new PWM({
    //   color: 'blue',
    //   lineWidth: 2,
    //   resolution: 8,
    //   prescaler: 64,
    //   signal: this.signals[0] as Signal
    // })

    // this.addSignal(pwm)
    // window.pwm = pwm;

    this.draw()
  }

  addSignal(signal: Signal|PWM) {
    this.signals.push(signal)
  }

  drawSin() {
    this.context.strokeStyle = "red"
    const firstY = sin({ x: 0 })
    this.context.moveTo(0, firstY)
    this.context.beginPath();    

    var lastX = 0
    for(var i=1; i<this.screen.width; i++) {
      const x: number = this.screen.getCoordsFromCanvas({
        x: i,
        y: 0
      }).x

      const canvasCoords: IVector2 = this.screen.getCanvasCoords({
        x: x, 
        y:  sin({ freq: this.freq, x: x, amp: 1 }) + sin({ freq: this.freq * 1.242, x: x, amp: 1 })  + sin({ freq: this.freq * 0.4245, x: x, amp: 4 })
      })
      
      this.context.lineTo(canvasCoords.x, canvasCoords.y)
      lastX = canvasCoords.x
    }
    this.context.stroke()
  }

  draw() {
    this.canvas.width = this.canvas.width;  
    this.axes.draw(this)
    this.signals.forEach(signal => {
      signal.draw(this)
    })
  }
}