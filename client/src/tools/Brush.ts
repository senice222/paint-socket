import Tool from "./Tool";

export default class Brush extends Tool {
    constructor(canvas: HTMLCanvasElement | null, socket: WebSocket | null, sessionId: string | undefined) {
        if (!canvas || !socket || !sessionId) return;
        super(canvas, socket, sessionId)
        this.listen()
    }

    mouseDown: boolean = false;


    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
    }

    mouseUpHandler() {
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

    mouseMoveHandler(e: MouseEvent) {
        const isHTMLElement = e.target instanceof HTMLElement;
        if (this.mouseDown && isHTMLElement) {
            this.socket?.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx?.strokeStyle,
                    lineWidth: this.ctx?.lineWidth
                }
            }))
        }
    }

    static staticDraw(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        color: string,
        lineWidth: number
    ) {
        ctx.strokeStyle = color
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}


