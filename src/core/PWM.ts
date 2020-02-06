import Signal from './Signal';
import Oscilloscope from './Oscilloscope';
import { IVector2 } from "./math/Vector2"

interface PWMConstructor {
  prescaler?: number
  resolution?: number
  clocking?: number
  signal?: Signal
  visible?: boolean
  color?: string
  lineWidth?: number
  id?: number
}

export default class PWM  {
  id: number
  resolution: number // bit
  prescaler: number
  clocking: number
  visible: boolean
  color: string
  lineWidth: number
  signal: Signal

  constructor({
    id = 1,
    clocking = 16000000, // 16MHz
    prescaler = 64,      // n^2
    resolution = 8,
    visible = true,
    color = 'black',
    lineWidth = 1,
    signal = new Signal(),
  }: PWMConstructor = {}) {
    this.id = id;
    this.resolution = resolution;
    this.clocking = clocking;
    this.prescaler = prescaler;
    this.visible = visible;
    this.color = color;
    this.lineWidth = lineWidth;
    this.signal = signal;
  }

  get freq(): number {
    return this.clocking/this.prescaler/Math.pow(2, this.resolution)
  }

  get period() {
    return 1/this.freq
  }

  getAt(x: number): number {
    const deltaX: number = x % this.period
    if (deltaX < this.getModulationAt(x) * this.period) {
      return 1;
    } 
    return 0;
  }

  getModulationAt(x: number) {
    const tX = x - x % this.period
    var y: number = this.signal.getAt(tX);
    const alpha = y - y % (1/Math.pow(2, this.resolution))
    return alpha;
  }

  draw(osc: Oscilloscope) {
    if (!this.visible || !this.signal) return;
    
    const { screen, context } = osc;
    const { root } = screen

    context.strokeStyle = this.color
    context.lineWidth = this.lineWidth


    const startX = root.x
    const startY = this.getAt(startX)

    context.moveTo(startX, startY)
    context.beginPath()

    for(var i=1; i<screen.width; i++) {
      const { x }: {x: number} = screen.getCoordsFromCanvas({ x: i, y: 0 });

      const canvasCoords: IVector2 = screen.getCanvasCoords({
        x: x, 
        y: this.getAt(x)
      })

      context.lineTo(canvasCoords.x, canvasCoords.y)
    }

    context.stroke();

    this.drawFlat(osc);
  }

  drawFlat(osc: Oscilloscope) {
    if (!this.visible || !this.signal) return;
    
    const { screen, context } = osc;
    const { root } = screen

    context.strokeStyle = 'red'
    context.lineWidth = this.lineWidth


    const startX = root.x
    const startY = this.getModulationAt(startX)

    context.moveTo(startX, startY)
    context.beginPath()

    for(var i=1; i<screen.width; i++) {
      const { x }: {x: number} = screen.getCoordsFromCanvas({ x: i, y: 0 });

      const canvasCoords: IVector2 = screen.getCanvasCoords({
        x: x, 
        y: this.getModulationAt(x)
      })

      context.lineTo(canvasCoords.x, canvasCoords.y)
    }

    context.stroke();
  }
}