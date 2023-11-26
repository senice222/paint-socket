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

    const changeColor = e => {
        toolState.setStrokeColor(e.target.value)
        toolState.setFillColor(e.target.value)
    }

    return (
        <div className={style.toolbar}>
            <button className={`${style.toolbar__btn} ${style.brush}`}
                    onClick={() => toolState.setTool(new Brush(canvasState.canvas))}/>
            <button className={`${style.toolbar__btn} ${style.rect}`}
                    onClick={() => toolState.setTool(new Rect(canvasState.canvas))}/>
            <button className={`${style.toolbar__btn} ${style.circle}`}
                    onClick={() => toolState.setTool(new Circle(canvasState.canvas))}/>
            <button className={`${style.toolbar__btn} ${style.eraser}`}
                    onClick={() => toolState.setTool(new Eraser(canvasState.canvas))}/>
            <button className={`${style.toolbar__btn} ${style.line}`}
                    onClick={() => toolState.setTool(new Line(canvasState.canvas))}/>
            <input style={{ marginLeft: 10 }} type="color" onChange={e => changeColor(e)}/>
            <button className={`${style.toolbar__btn} ${style.undo}`}
                    onClick={() => canvasState.undo()}/>
            <button className={`${style.toolbar__btn} ${style.redo}`}
                    onClick={() => canvasState.redo()}/>
            <button className={`${style.toolbar__btn} ${style.save}`}/>
        </div>
    );
};

export default Toolbar;
