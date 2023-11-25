import React, {useEffect, useRef} from 'react';
import style from '../styles/canvas.module.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";

const Canvas = observer(() => {
    const canvasRef = useRef()

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, []);


    return (
        <div className={style.canvas}>
            <canvas ref={canvasRef} width={900} height={600}/>
        </div>
    );
});

export default Canvas;
