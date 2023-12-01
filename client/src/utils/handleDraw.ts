import {Figure} from "../interfaces/Figure";
import Brush from "../tools/Brush";
import Circle from "../tools/Circle";
import Rect from "../tools/Rect";
import Eraser from "../tools/Eraser";

export const handleDraw = (msg: Figure, canvasRef: any) => {
    const figure = msg.figure
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return;
    switch (figure.type) {
        case "brush":
            Brush.staticDraw(ctx, figure.x, figure.y, figure.color, figure.lineWidth)
            break
        case "circle":
            Circle.staticDraw(
                ctx, figure.x, figure.y, figure.r, figure.color, figure.strokeStyle, figure.lineWidth
            )
            break
        case "rect":
            Rect.staticDraw(
                ctx, figure.x, figure.y, figure.w, figure.h, figure.color, figure.strokeStyle, figure.lineWidth
            )
            break
        case "eraser":
            Eraser.staticDraw(ctx, figure.x, figure.y, figure.color)
            break
        case "Finish":
            ctx.beginPath()
            break
    }
}