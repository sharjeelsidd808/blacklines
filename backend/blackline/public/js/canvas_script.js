class CanvasElement{
   constructor(){
      this.canvasEle = document.getElementById('drawContainer');
      this.context = this.canvasEle.getContext('2d');
      this.isDrawStart = false
      this.artData = {}
      this.lineList = []
      this.startPosition = { x: 0, y: 0 }
      this.endPosition = { x: 0, y: 0 }
      this.onNewLine = () => {}
   }

   initialize(){
      this.canvasEle.addEventListener('mousedown', this.mouseDownListener.bind(this));
      this.canvasEle.addEventListener('mousemove', this.mouseMoveListener.bind(this));
      this.canvasEle.addEventListener('mouseup', this.mouseupListener.bind(this));

      this.canvasEle.addEventListener('touchstart', this.mouseDownListener.bind(this));
      this.canvasEle.addEventListener('touchmove', this.mouseMoveListener.bind(this));
      this.canvasEle.addEventListener('touchend', this.mouseupListener.bind(this));
   }
   
   mouseDownListener (event){
      this.startPosition = this.getClientOffset(event);
      this.isDrawStart = true;
   }
   
   mouseMoveListener (event){
     if(!this.isDrawStart) return;
     
     this.endPosition = this.getClientOffset(event);
     this.clearCanvas();
     this.drawLine();
   }
   
   mouseupListener  (event){
     if(this.isDrawStart){
         const line = {x1: this.startPosition.x, y1: this.startPosition.y, x2: this.endPosition.x, y2: this.endPosition.y}
         this.lineList.push(line)
         this.onNewLine(line)
     }
     this.isDrawStart = false
   }
   
   clearCanvas (){
      this.context.clearRect(0, 0, this.canvasEle.width, this.canvasEle.height);
      
      for(let line of this.lineList){
          this.drawLine(line)
      }
   }

   updateArtData(artData){
      this.artData = artData
      this.lineList = artData.lineList
      this.clearCanvas()
   }

    getClientOffset  (event)  {
      const {pageX, pageY} = event.touches ? event.touches[0] : event;
      const x = pageX - this.canvasEle.offsetLeft;
      const y = pageY - this.canvasEle.offsetTop;
  
      return {
         x,
         y
      } 
  }
  
   drawLine  (cord)  {
     if(!cord){
         cord = {x1: this.startPosition.x, y1: this.startPosition.y, x2: this.endPosition.x, y2: this.endPosition.y}
     }
     this.context.beginPath();
     this.context.moveTo(cord.x1, cord.y1);
     this.context.lineTo(cord.x2, cord.y2);
     this.context.stroke();
  }



}