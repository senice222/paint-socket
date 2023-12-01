import {makeAutoObservable} from "mobx";

class CanvasState {
    canvas: HTMLCanvasElement | null = null;
    undoList: string[] = [];
    redoList: string[] = [];
    username: string = "";
    socket: WebSocket | null = null;
    sessionId?: string = "";

    constructor() {
        makeAutoObservable(this)
    }

    setSocket(socket: WebSocket) {
        this.socket = socket
    }

    setSessionId(sessionId: string | undefined) {
        this.sessionId = sessionId
    }

    setUsername(username: string) {
        this.username = username
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
    }

    pushToUndo(data: string) {
        this.undoList.push(data)
    }

    pushToRedo(data: string) {
        this.redoList.push(data)
    }

    undo() {
        if (!this.canvas) return;
        const ctx = this.canvas?.getContext('2d');
        const dataUrl = this.undoList.pop();
        this.redoList.push(this.canvas.toDataURL());
        let img = new Image();
        img.src = dataUrl || '';
        img.onload = () => {
            if (this.canvas) {
                ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
                ctx?.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            }
        };
    }

    redo() {
        if (!this.canvas) return;
        let ctx = this.canvas.getContext('2d')
        let dataUrl = this.redoList.pop()
        this.undoList.push(this.canvas.toDataURL())
        let img = new Image()
        img.src = dataUrl || ''
        img.onload = () => {
            if (ctx && this.canvas) {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }

}

export default new CanvasState()