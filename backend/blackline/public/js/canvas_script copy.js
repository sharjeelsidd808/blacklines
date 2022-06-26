class CanvasElement{
   constructor(){
      this.canvasEle = document.getElementById('drawContainer');
      this.context = canvasEle.getContext('2d');
      this.isDrawStart = false
      this.lineList = []
      this.startPosition = { x: 0, y: 0 }
      this.endPosition = { x: 0, y: 0 }
   }

   initialize(){
      this.canvasEle.addEventListener('mousedown', this.mouseDownListener.bind(this));
      this.canvasEle.addEventListener('mousemove', this.mouseMoveListener.bind(this));
      this.canvasEle.addEventListener('mouseup', this.mouseupListener.bind(this));

      this.canvasEle.addEventListener('touchstart', this.mouseDownListener.bind(this));
      this.canvasEle.addEventListener('touchmove', this.mouseMoveListener.bind(this));
      this.canvasEle.addEventListener('touchend', this.mouseupListener.bind(this));
   }




}


const canvasEle = document.getElementById('drawContainer');
const context = canvasEle.getContext('2d');
let startPosition = {x: 0, y: 0};
let lineCoordinates = {x: 0, y: 0};
let isDrawStart = false;
const lineList = []

const getClientOffset = (event) => {
    const {pageX, pageY} = event.touches ? event.touches[0] : event;
    const x = pageX - canvasEle.offsetLeft;
    const y = pageY - canvasEle.offsetTop;

    return {
       x,
       y
    } 
}

const drawLine = (cord) => {
   if(!cord){
       cord = {x1: startPosition.x, y1: startPosition.y, x2: lineCoordinates.x, y2: lineCoordinates.y}
   }
   context.beginPath();
   context.moveTo(cord.x1, cord.y1);
   context.lineTo(cord.x2, cord.y2);
   context.stroke();
}

const mouseDownListener = (event) => {
   startPosition = getClientOffset(event);
   isDrawStart = true;
}

const mouseMoveListener = (event) => {
  if(!isDrawStart) return;
  
  lineCoordinates = getClientOffset(event);
  clearCanvas();
  drawLine();
}

const mouseupListener = (event) => {
  if(isDrawStart){
      lineList.push({x1: startPosition.x, y1: startPosition.y, x2: lineCoordinates.x, y2: lineCoordinates.y})
  }
  isDrawStart = false;
//   context.save()
}

const clearCanvas = () => {
   context.clearRect(0, 0, canvasEle.width, canvasEle.height);
   context.restore()
   for(let line of lineList){
       drawLine(line)
   }
}

canvasEle.addEventListener('mousedown', mouseDownListener);
canvasEle.addEventListener('mousemove', mouseMoveListener);
canvasEle.addEventListener('mouseup', mouseupListener);

canvasEle.addEventListener('touchstart', mouseDownListener);
canvasEle.addEventListener('touchmove', mouseMoveListener);
canvasEle.addEventListener('touchend', mouseupListener);