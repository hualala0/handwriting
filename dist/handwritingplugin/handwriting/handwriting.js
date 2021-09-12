(function () {
    'use strict';

    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b)
          if (Object.prototype.hasOwnProperty.call(b, p))
            d[p] = b[p];
      };
      return extendStatics(d, b);
    };
    function __extends(d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null');
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var Draw = function () {
      function Draw(ctx) {
        this.penWidth = 4;
        this.lineCap = 'round';
        this.isWriting = false;
        this.isMouseOut = false;
        this.ctx = ctx;
      }
      Draw.prototype.draw = function () {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.endX, this.endY);
        this.ctx.lineWidth = this.penWidth;
        this.ctx.strokeStyle = this.penColor;
        this.ctx.lineCap = this.lineCap;
        this.ctx.stroke();
      };
      Draw.prototype.drawImage = function (img) {
        this.ctx.drawImage(img, 0, 0);
      };
      Draw.prototype.clear = function () {
        this.ctx.clearRect(0, 0, 2000, 2000);
      };
      Draw.prototype.save = function () {
        this.ctx.save();
      };
      Draw.prototype.restore = function () {
        this.ctx.restore();
      };
      return Draw;
    }();

    var Eraser = function (_super) {
      __extends(Eraser, _super);
      function Eraser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.penColor = 'white';
        return _this;
      }
      return Eraser;
    }(Draw);

    var Pen = function (_super) {
      __extends(Pen, _super);
      function Pen(ctx) {
        var _this = _super.call(this, ctx) || this;
        _this.penColor = 'black';
        return _this;
      }
      return Pen;
    }(Draw);

    var Control = function () {
      function Control() {
        var _this = this;
        this.undoStack = [];
        this.redoStack = [];
        this.undo = document.getElementById('undo');
        this.redo = document.getElementById('redo');
        this.clear = document.getElementById('clear');
        this.myCanvas = document.getElementById('myCanvas');
        this.pen = new Pen(this.myCanvas.getContext('2d'));
        this.eraser = new Eraser(this.myCanvas.getContext('2d'));
        this.curDraw = this.pen;
        this.changeCanvas = function () {
          var curImg = new Image();
          curImg.src = _this.myCanvas.toDataURL();
          var myCanvas = document.getElementById('myCanvas');
          var canvasWidth = myCanvas.parentElement.offsetWidth + '';
          var canvasHeight = myCanvas.parentElement.offsetHeight + '';
          myCanvas.setAttribute('width', canvasWidth);
          myCanvas.setAttribute('height', canvasHeight);
          _this.curDraw.drawImage(curImg);
        };
        this.undoHandler = function () {
          var img = _this.undoStack.pop();
          var curImg = new Image();
          curImg.src = _this.myCanvas.toDataURL();
          if (img) {
            _this.curDraw.clear();
            _this.curDraw.drawImage(img);
            _this.redoStack.push(curImg);
          }
        };
        this.redoHandler = function () {
          var img = _this.redoStack.pop();
          var curImg = new Image();
          curImg.src = _this.myCanvas.toDataURL();
          if (img) {
            _this.curDraw.clear();
            _this.curDraw.drawImage(img);
            _this.undoStack.push(curImg);
          }
        };
        this.clearHandler = function () {
          var img = new Image();
          img.src = _this.myCanvas.toDataURL();
          _this.undoStack.push(img);
          _this.redoStack.splice(0, _this.redoStack.length);
          _this.curDraw.clear();
        };
        this.changeColor = function (e) {
          if (!e.target.classList.contains('color'))
            return;
          _this.curDraw.penColor = e.target.style.backgroundColor;
        };
        this.receiveMessage = function (e) {
          if (e.data !== 'submit')
            return;
          var imgUrl = _this.myCanvas.toDataURL();
          e.source.postMessage({
            mceAction: 'insertContent',
            content: '<img src=\'' + imgUrl + '\' alt=\'handwriting\' height=100 width=100>'
          }, e.origin);
        };
        this.penHandler = function (e) {
          if (!e.target.classList.contains('pen'))
            return;
          _this.changeCurDraw('pen');
          _this.curDraw.penWidth = parseInt(e.target.style.width.slice(0, -2)) / 2;
        };
        this.eraserHandler = function (e) {
          if (!e.target.classList.contains('eraser'))
            return;
          _this.changeCurDraw('eraser');
          _this.curDraw.penWidth = parseInt(e.target.style.width.slice(0, -2)) / 2;
        };
      }
      Control.prototype.bindAll = function () {
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
      };
      Control.prototype.bindCanvas = function () {
        var _this = this;
        this.myCanvas.addEventListener('mousedown', function (e) {
          _this.curDraw.isWriting = true;
          _this.curDraw.startX = e.offsetX;
          _this.curDraw.startY = e.offsetY;
          var img = new Image();
          img.src = _this.myCanvas.toDataURL();
          _this.undoStack.push(img);
          _this.redoStack.splice(0, _this.redoStack.length);
        });
        this.myCanvas.addEventListener('mousemove', function (e) {
          if (!_this.curDraw.isWriting)
            return;
          _this.curDraw.endX = e.offsetX;
          _this.curDraw.endY = e.offsetY;
          _this.curDraw.draw();
          _this.curDraw.startX = e.offsetX;
          _this.curDraw.startY = e.offsetY;
        });
        this.myCanvas.addEventListener('mouseup', function (e) {
          if (_this.curDraw.isMouseOut)
            return;
          if (!_this.curDraw.isWriting)
            return;
          _this.curDraw.isWriting = false;
          _this.curDraw.endX = e.offsetX;
          _this.curDraw.endY = e.offsetY;
          _this.curDraw.draw();
        });
        this.myCanvas.addEventListener('mouseout', function (e) {
          if (!_this.curDraw.isWriting)
            return;
          _this.curDraw.isMouseOut = true;
          _this.curDraw.isWriting = false;
          _this.curDraw.endX = e.offsetX;
          _this.curDraw.endY = e.offsetY;
          _this.curDraw.draw();
        });
        this.myCanvas.addEventListener('mouseover', function (e) {
          _this.curDraw.isMouseOut = false;
        });
      };
      Control.prototype.bindUndo = function () {
        this.undo.addEventListener('click', this.undoHandler);
      };
      Control.prototype.bindRedo = function () {
        this.redo.addEventListener('click', this.redoHandler);
      };
      Control.prototype.bindClear = function () {
        this.clear.addEventListener('click', this.clearHandler);
      };
      Control.prototype.bindMessage = function () {
        var _this = this;
        window.addEventListener('message', function (e) {
          return _this.receiveMessage(e);
        }, false);
      };
      Control.prototype.bindResize = function () {
        window.addEventListener('resize', this.changeCanvas);
      };
      Control.prototype.bindColor = function () {
        var _this = this;
        document.getElementById('colorDiv').addEventListener('click', function (e) {
          return _this.changeColor(e);
        });
      };
      Control.prototype.bindPen = function () {
        var _this = this;
        document.getElementById('penDiv').addEventListener('click', function (e) {
          return _this.penHandler(e);
        });
      };
      Control.prototype.bindEraser = function () {
        var _this = this;
        document.getElementById('eraserDiv').addEventListener('click', function (e) {
          return _this.eraserHandler(e);
        });
      };
      Control.prototype.changeCurDraw = function (draw) {
        if (draw == 'pen')
          this.curDraw = this.pen;
        else
          this.curDraw = this.eraser;
      };
      return Control;
    }();

    var Resource = function () {
      function Resource() {
      }
      Resource.colorList = [
        '#000000',
        '#c00000',
        '#ff0000',
        '#ffc000',
        '#ffff00',
        '#92d050',
        '#00b050',
        '#00b0f0',
        '#0070c0',
        '#002060',
        '#7030a0',
        '#ffffff',
        '#eeece1',
        '#1f497d',
        '#4f81bd',
        '#c0504d',
        '#9bbb59',
        '#8064a2',
        '#4bacc6',
        '#f79646'
      ];
      Resource.undoImgSrc = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojNDk0OTQ5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiM0OTQ5NDk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwb2x5bGluZSBjbGFzcz0ic3QwIiBwb2ludHM9IjUuNSw2LjUgMS41LDYuNSAxLjUsMi41IAkiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMS43MDksNi4zNThDMi40MzcsMy41NjMsNC45NzcsMS41LDgsMS41YzMuNTksMCw2LjUsMi45MSw2LjUsNi41cy0yLjkxLDYuNS02LjUsNi41Ii8+DQo8L2c+DQo8L3N2Zz4NCg==';
      Resource.redoImgSrc = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojNDk0OTQ5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQoJLnN0MXtmaWxsOm5vbmU7c3Ryb2tlOiM0OTQ5NDk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQ0KPC9zdHlsZT4NCjxnPg0KCTxwb2x5bGluZSBjbGFzcz0ic3QwIiBwb2ludHM9IjEwLjUsNi41IDE0LjUsNi41IDE0LjUsMi41IAkiLz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTQuMjkxLDYuMzU4QzEzLjU2MywzLjU2MywxMS4wMjMsMS41LDgsMS41QzQuNDEsMS41LDEuNSw0LjQxLDEuNSw4czIuOTEsNi41LDYuNSw2LjUiLz4NCjwvZz4NCjwvc3ZnPg0K';
      Resource.clearImgSrc = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE2IDE2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDpub25lO3N0cm9rZTojNDk0OTQ5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6I0ZGNzgxNDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9DQo8L3N0eWxlPg0KPGxpbmUgaWQ9IuebtOe6v181MiIgY2xhc3M9InN0MCIgeDE9IjAuNSIgeTE9IjIuNSIgeDI9IjE1LjUiIHkyPSIyLjUiLz4NCjxwYXRoIGlkPSLot6/lvoRfNjQiIGNsYXNzPSJzdDAiIGQ9Ik0xMy41LDIuNXYxMS42NWMwLjAxLDAuNzctMC42MDUsMS40MDItMS4zNzUsMS40MTJoLTguMjVDMy4xMDYsMTUuNTUyLDIuNDksMTQuOTIsMi41LDE0LjE1DQoJVjIuNSIvPg0KPHBhdGggaWQ9Iui3r+W+hF82NSIgY2xhc3M9InN0MCIgZD0iTTUuNSwyLjM3NVYxLjc1YzAtMC42OSwwLjU2LTEuMjUsMS4yNS0xLjI1aDIuNWMwLjY5LDAsMS4yNSwwLjU2LDEuMjUsMS4yNXYwLjYyNSIvPg0KPGxpbmUgaWQ9IuebtOe6v181MyIgY2xhc3M9InN0MSIgeDE9IjYuNSIgeTE9IjYuNSIgeDI9IjYuNSIgeTI9IjExLjUiLz4NCjxsaW5lIGlkPSLnm7Tnur9fNTQiIGNsYXNzPSJzdDEiIHgxPSI5LjUiIHkxPSI2LjUiIHgyPSI5LjUiIHkyPSIxMS41Ii8+DQo8L3N2Zz4NCg==';
      Resource.widthList = [
        4,
        6,
        8,
        10,
        12
      ];
      return Resource;
    }();

    var View = function () {
      function View(content) {
        this.content = content;
      }
      View.prototype.layout = function () {
        this.content.style.display = 'flex';
        this.content.style.height = '400px';
        this.canvasLayout();
        this.toolsLayout();
      };
      View.prototype.canvasLayout = function () {
        var canvas = this.addCanvas();
        var doDiv = document.createElement('div');
        var canvasDiv = document.createElement('div');
        var undo = this.addUndo();
        var redo = this.addRedo();
        var clear = this.addClear();
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
      };
      View.prototype.toolsLayout = function () {
        var colorDiv = this.addColor();
        var penDiv = this.addPen();
        var eraserDiv = this.addEraser();
        var toolsDiv = document.createElement('div');
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
      };
      View.prototype.addCanvas = function () {
        var borderDiv = document.createElement('div');
        var myCanvas = document.createElement('canvas');
        myCanvas.setAttribute('id', 'myCanvas');
        borderDiv.append(myCanvas);
        borderDiv.style.cursor = 'crosshair';
        borderDiv.style.outline = 'thick solid #C6C6C6';
        return borderDiv;
      };
      View.prototype.addUndo = function () {
        var undoDiv = document.createElement('div');
        var undo = document.createElement('div');
        undoDiv.style.display = 'flex';
        undoDiv.style.margin = '10px';
        undoDiv.style.alignItems = 'center';
        undo.setAttribute('id', 'undo');
        undo.style.height = '20px';
        undo.style.width = '20px';
        undo.style.backgroundImage = 'url(' + Resource.undoImgSrc + ')';
        undo.style.backgroundSize = '20px 20px';
        undoDiv.append(undo);
        return undoDiv;
      };
      View.prototype.addRedo = function () {
        var redoDiv = document.createElement('div');
        var redo = document.createElement('div');
        redoDiv.style.display = 'flex';
        redoDiv.style.margin = '10px';
        redoDiv.style.alignItems = 'center';
        redo.setAttribute('id', 'redo');
        redo.style.height = '20px';
        redo.style.width = '20px';
        redo.style.backgroundImage = 'url(' + Resource.redoImgSrc + ')';
        redo.style.backgroundSize = '20px 20px';
        redoDiv.append(redo);
        return redoDiv;
      };
      View.prototype.addClear = function () {
        var clearDiv = document.createElement('div');
        var clear = document.createElement('div');
        clearDiv.style.display = 'flex';
        clearDiv.style.margin = '10px';
        clearDiv.style.alignItems = 'center';
        clear.setAttribute('id', 'clear');
        clear.style.height = '20px';
        clear.style.width = '20px';
        clear.style.backgroundImage = 'url(' + Resource.clearImgSrc + ')';
        clear.style.backgroundSize = '20px 20px';
        clearDiv.append(clear);
        return clearDiv;
      };
      View.prototype.addColor = function () {
        var colorDiv = document.createElement('div');
        colorDiv.setAttribute('id', 'colorDiv');
        var innerStr = '';
        var index = 0;
        for (var _i = 0, _a = Resource.colorList; _i < _a.length; _i++) {
          var color = _a[_i];
          index % 5 || function () {
            innerStr += '<div style=\'display:flex;flex:1\'>';
          }();
          innerStr += '<div style=\'flex:1;display:flex;align-items:center;justify-content:center;\'><div class=\'color\' style=\'width:25px;height:25px;cursor:pointer;background-color:' + color + ';border-radius:50%\'></div></div>';
          index++;
          index % 5 || function () {
            innerStr += '</div>';
          }();
        }
        colorDiv.innerHTML = innerStr;
        return colorDiv;
      };
      View.prototype.addPen = function () {
        var penDiv = document.createElement('div');
        penDiv.setAttribute('id', 'penDiv');
        var innerStr = '<div style=\'flex:1;margin-left:20px;\'>Pen:</div>';
        for (var _i = 0, _a = Resource.widthList; _i < _a.length; _i++) {
          var width = _a[_i];
          innerStr += '<div style=\'flex:1;display:flex;align-items:center;justify-content:center;\'><div class=\'pen\' style=\'width:' + 2 * width + 'px;height:' + 2 * width + 'px;cursor:pointer;background-color:#000000;border-radius:50%;border-width:1px;border-style:solid\'></div></div>';
        }
        penDiv.innerHTML = innerStr;
        return penDiv;
      };
      View.prototype.addEraser = function () {
        var eraserDiv = document.createElement('div');
        eraserDiv.setAttribute('id', 'eraserDiv');
        var innerStr = '<div style=\'flex:1;margin-left:20px;\'>Eraser:</div>';
        for (var _i = 0, _a = Resource.widthList; _i < _a.length; _i++) {
          var width = _a[_i];
          innerStr += '<div style=\'flex:1;display:flex;align-items:center;justify-content:center;\'><div class=\'eraser\' style=\'width:' + 2 * width + 'px;height:' + 2 * width + 'px;cursor:pointer;background-color:#FFFFFF;border-radius:50%;border-width:1px;border-style:solid\'></div></div>';
        }
        eraserDiv.innerHTML = innerStr;
        return eraserDiv;
      };
      return View;
    }();

    var content = document.getElementById('content');
    var view = new View(content);
    view.layout();
    var control = new Control();
    control.bindAll();

}());
