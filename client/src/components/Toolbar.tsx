import React from 'react';
import style from '../styles/toolbar.module.scss'
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";

const Toolbar = () => {

    const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    const download = () => {
        if (!canvasState.canvas) return;
        const dataURL = canvasState.canvas.toDataURL()
        console.log(dataURL)
        const a = document.createElement('a')
        a.href = dataURL
        a.download = canvasState.sessionId + ".jpg"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className={style.toolbar}>
            <button className={`${style.toolbar__btn} ${style.brush}`}
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className={`${style.toolbar__btn} ${style.rect}`}
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className={`${style.toolbar__btn} ${style.circle}`}
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
            <button className={`${style.toolbar__btn} ${style.eraser}`}
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas,  canvasState.socket, canvasState.sessionId))}/>
            <button className={`${style.toolbar__btn} ${style.line}`}
                    onClick={() => toolState.setTool(new Line(canvasState.canvas))}/>
            <input style={{ marginLeft: 10 }} type="color" onChange={e => changeColor(e)} />
            <button className={`${style.toolbar__btn} ${style.undo}`}
                    onClick={() => canvasState.undo()}/>
            <button className={`${style.toolbar__btn} ${style.redo}`}
                    onClick={() => canvasState.redo()}/>
            <button className={`${style.toolbar__btn} ${style.save}`} onClick={download}/>
        </div>
    );
};

export default Toolbar;
