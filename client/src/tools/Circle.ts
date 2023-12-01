import Tool from "./Tool";

export default class Circle extends Tool {
    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket | null, sessionId: string | undefined) {
        if (!canvas || !socket || !sessionId) return;
        super(canvas, socket, sessionId)
        this.listen()
    }
    name: string = '';
    mouseDown: boolean = false;
    startX: number = 0;
    startY: number = 0;
    r: number = 0;
    saved: string = "";
    color: string = "";

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
        if (this.socket && this.ctx) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: 'circle',
                    x: this.startX,
                    y: this.startY,
                    r: this.r,
                    color: this.ctx.fillStyle,
                    strokeColor: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
        }
    }

    mouseDownHandler(e: MouseEvent) {
        if (this.ctx && e.target instanceof HTMLElement) {
            this.mouseDown = true
            this.ctx.beginPath()
            this.startX = e.pageX - e.target.offsetLeft
            this.startY = e.pageY - e.target.offsetTop
            this.saved = this.ctx.canvas.toDataURL()
        }
    }

    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLElement) {
            let currentX = e.pageX - e.target.offsetLeft
            let currentY = e.pageY - e.target.offsetTop
            let width = currentX-this.startX
            let height = currentY-this.startY
            this.r = Math.sqrt(width**2 + height**2)
            this.draw(this.startX, this.startY, this.r)
        }
    }

    draw(x: number, y: number, r: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = async () => {
            if (this.ctx) {
                this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height)
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.ctx.beginPath()
                this.ctx.arc(x, y, r, 0, 2 * Math.PI)
                this.ctx.fill()
                this.ctx.stroke()
            }
        }
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        r: number,
        color: string,
        strokeColor: string,
        lineWidth: number
    ) {
        ctx.fillStyle = color;
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}