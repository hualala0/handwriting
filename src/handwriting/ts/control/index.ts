import { Draw } from "../model/draw";
import { Eraser } from "../model/eraser";
import { Pen } from "../model/pen";


export class Control{

  undoStack: any[] = [];
  redoStack: any[] = [];
  undo = document.getElementById('undo');
  redo = document.getElementById('redo');
  clear = document.getElementById('clear');
  myCanvas = <HTMLCanvasElement>document.getElementById('myCanvas');
  pen = new Pen(this.myCanvas.getContext('2d'));
  eraser = new Eraser(this.myCanvas.getContext('2d'));
  curDraw: Draw = this.pen;

  bindAll(): void {
    this.changeCanvas();
    this.bindCanvas();
    this.bindUndo();
    this.bindRedo();
    this.bindClear();
    this.bindMessage();
    this.bindResize();
    this.bindColor();
    this.bindPen();
    this.bindEraser();
  }

  bindCanvas(): void {
    this.myCanvas.addEventListener('mousedown', e => {
      this.curDraw.isWriting = true;
      this.curDraw.startX = e.offsetX;
      this.curDraw.startY = e.offsetY;
      const img = new Image();
      img.src= this.myCanvas.toDataURL();
      this.undoStack.push(img);
      this.redoStack.splice(0, this.redoStack.length);
    });
    this.myCanvas.addEventListener('mousemove', e => {
      if(!this.curDraw.isWriting) return;
      this.curDraw.endX = e.offsetX;
      this.curDraw.endY = e.offsetY;
      this.curDraw.draw();
      this.curDraw.startX = e.offsetX;
      this.curDraw.startY = e.offsetY;
    });
    this.myCanvas.addEventListener('mouseup', e => {
      if(this.curDraw.isMouseOut) return;
      if(!this.curDraw.isWriting) return;
      this.curDraw.isWriting = false;
      this.curDraw.endX = e.offsetX;
      this.curDraw.endY = e.offsetY;
      this.curDraw.draw();
    });
    this.myCanvas.addEventListener('mouseout', e => {
      if(!this.curDraw.isWriting) return;
      this.curDraw.isMouseOut = true;
      this.curDraw.isWriting = false;
      this.curDraw.endX = e.offsetX;
      this.curDraw.endY = e.offsetY;
      this.curDraw.draw();
    });
    this.myCanvas.addEventListener('mouseover', e => {
      this.curDraw.isMouseOut = false;
    })
  }

  bindUndo(): void {
    this.undo.addEventListener('click', this.undoHandler);
  }

  bindRedo(): void {
    this.redo.addEventListener('click', this.redoHandler);
  }

  bindClear(): void {
    this.clear.addEventListener('click', this.clearHandler);
  }

  bindMessage(): void {
    window.addEventListener('message', (e) => this.receiveMessage(e), false);
  }

  bindResize(): void {
    window.addEventListener('resize', this.changeCanvas);
  }

  bindColor(): void {
    document.getElementById('colorDiv').addEventListener('click', (e) => this.changeColor(e));
  }

  bindPen(): void {
    document.getElementById('penDiv').addEventListener('click', (e) => this.penHandler(e));
  }

  bindEraser(): void {
    document.getElementById('eraserDiv').addEventListener('click', (e) => this.eraserHandler(e));
  }

  changeCurDraw(draw: string): void {
    if(draw == 'pen') this.curDraw = this.pen;
    else this.curDraw = this.eraser;
  }

  changeCanvas = (): void => {
    const curImg = new Image();
    curImg.src= this.myCanvas.toDataURL();
    const myCanvas = document.getElementById('myCanvas');
    const canvasWidth = myCanvas.parentElement.offsetWidth + '';
    const canvasHeight = myCanvas.parentElement.offsetHeight + '';
    myCanvas.setAttribute('width',canvasWidth);
    myCanvas.setAttribute('height',canvasHeight);
    this.curDraw.drawImage(curImg);
  }

  undoHandler = (): void => {
    const img = this.undoStack.pop();
    const curImg = new Image();
    curImg.src= this.myCanvas.toDataURL();
    if(img){
      this.curDraw.clear();
      this.curDraw.drawImage(img);
      this.redoStack.push(curImg);
    }
  }

  redoHandler = (): void => {
    const img = this.redoStack.pop();
    const curImg = new Image();
    curImg.src= this.myCanvas.toDataURL();
    if(img){
      this.curDraw.clear();
      this.curDraw.drawImage(img);
      this.undoStack.push(curImg);
    }
  }

  clearHandler = (): void => {
    const img = new Image();
    img.src= this.myCanvas.toDataURL();
    this.undoStack.push(img);
    this.redoStack.splice(0, this.redoStack.length);
    this.curDraw.clear();
  }

  changeColor = (e: any): void => {
    if(!e.target.classList.contains('color')) return;
    this.curDraw.penColor = e.target.style.backgroundColor;
  }

  receiveMessage = (e: any): void => {
    if (e.data !== 'submit') return;
    const imgUrl= this.myCanvas.toDataURL();
    e.source.postMessage({mceAction: 'insertContent',content: `<img src='${imgUrl}' alt='handwriting' height=100 width=100>`}, e.origin);
  }

  penHandler = (e: any): void => {
    if(!e.target.classList.contains('pen')) return;
    this.changeCurDraw('pen');
    this.curDraw.penWidth = parseInt(e.target.style.width.slice(0,-2)) / 2;
  }

  eraserHandler = (e: any): void => {
    if(!e.target.classList.contains('eraser')) return;
    this.changeCurDraw('eraser');
    this.curDraw.penWidth = parseInt(e.target.style.width.slice(0,-2)) / 2;
  }

}