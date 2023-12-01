import Tool from "./Tool";

export default class Rect extends Tool {
    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket | null, sessionId: string | undefined) {
        if (!canvas || !socket || !sessionId) return;
        super(canvas, socket, sessionId)
        this.listen()
    }

    mouseDown: boolean = false
    startX: number = 0
    startY: number = 0
    width: number = 0
    height: number = 0
    saved: string = ""

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler() {
        this.mouseDown = false
        if (this.ctx && this.socket) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: 'rect',
                    x: this.startX,
                    y: this.startY,
                    w: this.width,
                    h: this.height,
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
            this.saved = this.canvas.toDataURL()
        }
    }

    mouseMoveHandler(e: MouseEvent) {
        if (this.mouseDown && e.target instanceof HTMLElement) {
            const currentX = e.pageX - e.target.offsetLeft;
            const currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;
            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x: number, y: number, w: number, h: number) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
                this.ctx.beginPath()
                this.ctx.rect(x, y, w, h)
                this.ctx.fill()
                this.ctx.stroke()
            }
        }
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        color: string,
        strokeColor: string,
        lineWidth: number
    ) {
        ctx.fillStyle = color
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.rect(x, y, w, h)
        ctx.fill()
        ctx.stroke()
    }
}

