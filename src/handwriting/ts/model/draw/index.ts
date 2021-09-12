export class Draw{
  penColor :string; // 画笔颜色
  penWidth = 4;
  lineCap = 'round'
  startX: number; 
  startY: number;
  endX: number;
  endY: number;
  ctx: any;
  isWriting = false;
  isMouseOut = false;

  constructor(ctx: any){
    this.ctx = ctx;
  }
  
  draw(): void {
    this.ctx.beginPath(); 
    this.ctx.moveTo(this.startX, this.startY); 
    this.ctx.lineTo(this.endX, this.endY); 
    this.ctx.lineWidth = this.penWidth; 
    this.ctx.strokeStyle = this.penColor; 
    this.ctx.lineCap = this.lineCap;
    this.ctx.stroke();
  }

  drawImage(img: any): void {
    this.ctx.drawImage(img, 0, 0);
  }

  clear(): void {
    this.ctx.clearRect(0, 0, 2000, 2000)
  }

  save(): void {
    this.ctx.save();
  }

  restore(): void {
    this.ctx.restore();
  }
}
