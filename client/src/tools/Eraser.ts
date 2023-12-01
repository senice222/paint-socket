import Tool from "./Tool";

export default class Eraser extends Tool {
    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket | null, sessionId: string | undefined) {
        if (!canvas || !socket || !sessionId) return;
        super(canvas, socket, sessionId)
        this.listen()
    }

    mouseDown: boolean = false
    width: number = 0
    height: number = 0

    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler(e: MouseEvent) {
        this.mouseDown = false
        if (this.socket) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: 'Finish',
                }
            }))
        }
    }

    mouseDownHandler(e: MouseEvent) {
        this.mouseDown = true
        if (this.ctx && e.target instanceof HTMLElement) {
            this.ctx.beginPath()
            this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }

    mouseMoveHandler(e: MouseEvent ) {
        if (this.socket && this.mouseDown && e.target instanceof HTMLElement) {
            this.socket.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: 'white'
                }
            }))
        }
    }

    static staticDraw(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
        ctx.strokeStyle = color
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}
