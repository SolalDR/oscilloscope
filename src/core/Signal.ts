import Oscilloscope from "./Oscilloscope";
import { IVector2 } from "./math/Vector2"

interface SignalConstructor {
  f?: Function
  state?: Object
  color?: string
  lineWidth?: number
  visible?: boolean
  id?: number
}

export default class Signal {
  private func: Function
  state: Object
  lineWidth: number
  color: string
  visible: boolean
  id: number

  constructor({
    f = () => {},
    id = 0,
    state = {},
    color = "black",
    lineWidth = 1,
    visible = true
  }: SignalConstructor = {}) {
    this.id = id;
    this.func = f.bind(this);
    this.state = state;
    this.color = color;
    this.lineWidth = lineWidth;
    this.visible = visible;
  }

  getAt(x: Number) {
    return this.func(x, this.state)
  }

  draw(osc: Oscilloscope) {
    if (!this.visible) return;

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
  }
}