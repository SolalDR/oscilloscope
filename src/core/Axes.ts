import Oscilloscope from "./Oscilloscope";

export interface AxesConstructor {
  x?: IAxe
  y?: IAxe
}

export interface IAxe {
  label: string
  unit: string
}

export default class Axes {
  x: IAxe
  y: IAxe

  constructor({
    x = { label: 'time', unit: 's' },
    y = { label: 'volt', unit: 'v' },
  }: AxesConstructor = {}) {
    this.x = x
    this.y = y
  }


  draw(oscilloscope: Oscilloscope) {
    const { context, screen } = oscilloscope;
    const { width, height, pixelsUnit, root, origin } = screen

    context.strokeStyle = "black"
    context.lineWidth = 2
    const originCoords = screen.getCanvasCoords(screen.origin)
    
    context.beginPath();
    context.moveTo(originCoords.x, 0)
    context.lineTo(originCoords.x, height)
    context.moveTo(0, originCoords.y)
    context.lineTo(width, originCoords.y)

    const graduationXCount = width / pixelsUnit.x
    for(var i=0; i<graduationXCount; i++) {
      const {x, y} = screen.getCanvasCoords({ 
        x: screen.root.x + i - (screen.root.x - screen.origin.x) % 1, 
        y: screen.origin.y 
      })
      context.moveTo(x, y - 20)
      context.lineTo(x, y + 20)
    }

    const graduationYCount = screen.height / pixelsUnit.y
    for(var i=0; i<graduationYCount; i++) {
      const {x, y} = screen.getCanvasCoords({ 
        y: root.y + i - (root.y - origin.y) % 1, 
        x: origin.x
      })
      context.moveTo(x - 20, y)
      context.lineTo(x + 20, y)
    }

    context.font = "30px Arial";
    context.fillText(`${this.y.label} (${this.y.unit})`, originCoords.x + 40, 50)
    context.fillText(`${this.x.label} (${this.x.unit})`, screen.width - 100, originCoords.y + 50)

    
    context.stroke();
  }
}