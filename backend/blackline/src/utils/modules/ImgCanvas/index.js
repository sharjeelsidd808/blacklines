const canvas = require('canvas')

const HEIGHT = 500
const WIDTH = 500

const createCanvasImg = (input) => {
    const { canvasObj, outputFile } = input

    const { lineList } = canvasObj
    const height = canvasObj.h || HEIGHT
    const width = canvasObj.w || WIDTH

    const canvasElem = canvas.createCanvas(height, width)
    const context = canvasElem.getContext('2d')
    for(lineObj of lineList){
        context.beginPath()
        context.moveTo(lineObj.x1, lineObj.y1)
        context.lineTo(lineObj.x2, lineObj.y2)
        context.stroke()
    } 
    const buffer = canvasElem.toBuffer()
}
