import { IVector2 } from "./math/Vector2"

interface ScreenConstructor {
  width?: number
  height?: number
  origin?: IVector2
  root?: IVector2,
  pixelsUnit?: IVector2,
  zoom?: number
}

export default class Screen {
  origin: IVector2
  root: IVector2
  pixelsUnit: IVector2
  basePixelsUnit: IVector2
  width: number
  height: number
  zoom: number
  baseRootX: number

  constructor({
    origin = {x: 0, y: 0},
    root = {x: -25, y: -1},
    pixelsUnit = {x: 50, y: 600},
    width = 1000,
    height = 500,
    zoom = 1,
  }: ScreenConstructor) {
    this.origin = origin;
    this.root = root;
    this.pixelsUnit = pixelsUnit;
    this.width = width;
    this.height= height;
    this.zoom = zoom;

    this.baseRootX = this.root.x
    this.basePixelsUnit = {...this.pixelsUnit}
  }

  setZoom(zoom: number): void {
    const originCanvasCoords = this.getCanvasCoords(this.origin)
    this.pixelsUnit.x = this.basePixelsUnit.x * zoom * zoom * 0.01;
    const newOriginCanvasCoords = this.getCanvasCoords(this.origin);
    this.root.x += (newOriginCanvasCoords.x - originCanvasCoords.x) / this.pixelsUnit.x
  }

  getCanvasCoords(coords: IVector2): IVector2 {
    return {
      x: Math.floor((coords.x - this.root.x) * this.pixelsUnit.x),
      y: this.height - Math.floor((coords.y - this.root.y) * this.pixelsUnit.y),
    }
  }

  getCoordsFromCanvas(coords: IVector2): IVector2 {
    return {
      x: coords.x / (this.pixelsUnit.x) + this.root.x,
      y: this.height/this.pixelsUnit.y - coords.y / this.pixelsUnit.y + this.root.y
    }
  }
}