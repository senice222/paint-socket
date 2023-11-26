import React, {useEffect, useRef, useState} from 'react';
import style from '../styles/canvas.module.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const [modal, setModal] = useState(true)
    const usernameRef = useRef()
    const {id} = useParams()

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000');
            socket.onopen = () => {
                console.log('Подключение установлено')
                socket.send(JSON.stringify({
                    id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (e) => {
                console.log(e.data)
            }
        }
    }, [canvasState.username]);


    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        toolState.setTool(new Brush(canvasRef.current))
    }, []);

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
    }

    const connectHandler = () => {
        canvasState.setUsername(usernameRef.current.value)
        setModal(false)
    }

    return (
        <div className={style.canvas}>
            <Modal show={modal} onHide={() => {
            }}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => connectHandler()}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas ref={canvasRef} onMouseDown={mouseDownHandler} width={900} height={600}/>
        </div>
    );
});

export default Canvas;
