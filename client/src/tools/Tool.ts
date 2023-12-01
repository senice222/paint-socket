
export default class Tool {
    canvas: HTMLCanvasElement
    socket: WebSocket | undefined;
    sessionId: string | undefined;
    ctx: CanvasRenderingContext2D | null;

    constructor(canvas: HTMLCanvasElement, socket?: WebSocket | undefined, sessionId?: string) {
        this.canvas = canvas
        this.socket = socket
        this.sessionId = sessionId
        this.ctx = canvas.getContext('2d')
        this.destroyEvents()
    }

    set fillColor(color: string) {
        if (this.ctx) {
            this.ctx.fillStyle = color
        }
    }

    set strokeColor(color: string) {
        if (this.ctx) {
            this.ctx.strokeStyle = color
        }
    }

    set lineWidth(width: number) {
        if (this.ctx) {
            this.ctx.lineWidth = width
        }
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmouseup = null
        this.canvas.onmousedown = null
    }
}