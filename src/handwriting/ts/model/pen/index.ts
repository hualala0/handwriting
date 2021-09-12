import { Draw } from "../draw";

export class Pen extends Draw {
  constructor(ctx:any) {
    super(ctx);
    this.penColor = 'black';
  }
}