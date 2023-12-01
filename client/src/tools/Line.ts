import Tool from "./Tool";

export default class Line extends Tool {
    name: string = '';
    mouseDown: boolean = false;
    currentX: number = 0;
    currentY: number = 0;
    saved: string = "";

    constructor(canvas: HTMLCanvasElement | null) {
        if (!canvas) return;
        super(canvas);
        this.listen()
        this.name = 'Line'
    }

    listen() {
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
    }

    mouseDownHandler(e: MouseEvent) {
        if (this.ctx && e.target instanceof HTMLElement) {
            this.mouseDown = true
            this.currentX = e.pageX-e.target.offsetLeft
            this.currentY = e.pageY-e.target.offsetTop
            this.ctx.beginPath()
            this.ctx.moveTo(this.currentX, this.currentY )
            this.saved = this.canvas.toDataURL()
        }
    }

    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
    }

    mouseMoveHandler(e: MouseEvent) {
        if (e && e.target instanceof HTMLElement) {
            if (this.mouseDown) {
                this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop);
            }
        }
    }

    draw(x: number,y: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = async () => {
            if (this.ctx) {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.ctx.beginPath()
                this.ctx.moveTo(this.currentX, this.currentY )
                this.ctx.lineTo(x, y)
                this.ctx.stroke()
            }
        }
    }
}