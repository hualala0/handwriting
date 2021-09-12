import { Resource } from "../resource";

export class View{
  content: HTMLDivElement;
  
  constructor(content: HTMLDivElement){
    this.content = content;
  }

  layout(): void{
    this.content.style.display = 'flex';
    this.content.style.height = '400px';
    this.canvasLayout();
    this.toolsLayout();
  }

  canvasLayout(): void {
    const canvas = this.addCanvas();
    const doDiv = document.createElement('div');
    const canvasDiv = document.createElement('div');
    const undo = this.addUndo();
    const redo = this.addRedo();
    const clear = this.addClear();
    canvasDiv.style.display = 'flex';
    canvasDiv.style.flexDirection = 'column';
    canvasDiv.style.flex = '3';
    canvas.style.display = 'flex';
    canvas.style.flex = '3';
    doDiv.style.flex = '1';
    doDiv.style.display = 'flex';
    doDiv.append(undo);
    doDiv.append(redo);
    doDiv.append(clear);
    canvasDiv.append(doDiv);
    canvasDiv.append(canvas);
    this.content.append(canvasDiv);
  }

  toolsLayout(): void {
    const colorDiv = this.addColor();
    const penDiv = this.addPen();
    const eraserDiv = this.addEraser();
    const toolsDiv = document.createElement('div');
    toolsDiv.style.display = 'flex';
    toolsDiv.style.flexDirection = 'column';
    toolsDiv.style.flex = '2';
    colorDiv.style.flex = '3';
    colorDiv.style.display = 'flex';
    colorDiv.style.flexDirection = 'column';
    eraserDiv.style.flex = '1';
    eraserDiv.style.display = 'flex';
    eraserDiv.style.alignItems = 'center';
    penDiv.style.flex = '1';
    penDiv.style.display = 'flex';
    penDiv.style.alignItems = 'center';
    toolsDiv.append(colorDiv);
    toolsDiv.append(penDiv);
    toolsDiv.append(eraserDiv);
    this.content.append(toolsDiv);
  }

  addCanvas(): HTMLDivElement{
    const borderDiv = document.createElement('div');
    const myCanvas = document.createElement('canvas');
    myCanvas.setAttribute('id','myCanvas');
    borderDiv.append(myCanvas);
    borderDiv.style.cursor = 'crosshair';
    borderDiv.style.outline = 'thick solid #C6C6C6';
    return borderDiv;
  }

  addUndo(): HTMLElement{
    const undoDiv = document.createElement('div');
    const undo = document.createElement('div');
    undoDiv.style.display = 'flex';
    undoDiv.style.margin = '10px';
    undoDiv.style.alignItems = 'center';
    undo.setAttribute('id','undo');
    undo.style.height = '20px';
    undo.style.width = '20px';
    undo.style.backgroundImage = `url(${Resource.undoImgSrc})`;
    undo.style.backgroundSize = '20px 20px';
    undoDiv.append(undo);
    return undoDiv;
  }

  addRedo(): HTMLElement {
    const redoDiv = document.createElement('div');
    const redo = document.createElement('div');
    redoDiv.style.display = 'flex';
    redoDiv.style.margin = '10px';
    redoDiv.style.alignItems = 'center';
    redo.setAttribute('id','redo');
    redo.style.height = '20px';
    redo.style.width = '20px';
    redo.style.backgroundImage = `url(${Resource.redoImgSrc})`;
    redo.style.backgroundSize = '20px 20px';
    redoDiv.append(redo);
    return redoDiv;
  }

  addClear(): HTMLElement {
    const clearDiv = document.createElement('div');
    const clear = document.createElement('div');
    clearDiv.style.display = 'flex';
    clearDiv.style.margin = '10px';
    clearDiv.style.alignItems = 'center';
    clear.setAttribute('id','clear');
    clear.style.height = '20px';
    clear.style.width = '20px';
    clear.style.backgroundImage = `url(${Resource.clearImgSrc})`;
    clear.style.backgroundSize = '20px 20px';
    clearDiv.append(clear);
    return clearDiv;
  }

  addColor(): HTMLElement {
    const colorDiv = document.createElement('div');
    colorDiv.setAttribute('id', 'colorDiv');
    let innerStr = '';
    let index = 0;
    for(const color of Resource.colorList){
      (index%5) || (()=>{innerStr += `<div style='display:flex;flex:1'>`})();
      innerStr += `<div style='flex:1;display:flex;align-items:center;justify-content:center;'><div class='color' style='width:25px;height:25px;cursor:pointer;background-color:${color};border-radius:50%'></div></div>`;
      index++;
      (index%5) || (()=>{innerStr += `</div>`})();
    }
    colorDiv.innerHTML = innerStr;
    return colorDiv;
  }

  addPen(): HTMLElement {
    const penDiv = document.createElement('div');
    penDiv.setAttribute('id', 'penDiv');
    let innerStr = `<div style='flex:1;margin-left:20px;'>Pen:</div>`;
    for(const width of Resource.widthList){
      innerStr += `<div style='flex:1;display:flex;align-items:center;justify-content:center;'><div class='pen' style='width:${2*width}px;height:${2*width}px;cursor:pointer;background-color:#000000;border-radius:50%;border-width:1px;border-style:solid'></div></div>`;
    }
    penDiv.innerHTML = innerStr;
    return penDiv;
  }

  addEraser(): HTMLElement {
    const eraserDiv = document.createElement('div');
    eraserDiv.setAttribute('id', 'eraserDiv');
    let innerStr = `<div style='flex:1;margin-left:20px;'>Eraser:</div>`;
    for(const width of Resource.widthList){
      innerStr += `<div style='flex:1;display:flex;align-items:center;justify-content:center;'><div class='eraser' style='width:${2*width}px;height:${2*width}px;cursor:pointer;background-color:#FFFFFF;border-radius:50%;border-width:1px;border-style:solid'></div></div>`;
    }
    eraserDiv.innerHTML = innerStr;
    return eraserDiv;
  }
}