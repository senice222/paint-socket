import React, {useEffect, useRef, useState} from 'react';
import style from '../styles/canvas.module.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import {useParams} from "react-router-dom";
import axios from 'axios'
import {handleUploadImage} from "../utils/handleUploadImage";
import {handleDraw} from "../utils/handleDraw";

const Canvas = observer(() => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null)
    const [modal, setModal] = useState<boolean>(true)
    const {id} = useParams()

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000');
            canvasState.setSocket(socket)
            canvasState.setSessionId(id)
            if (!canvasRef.current || !id) return;
            toolState.setTool(new Brush(canvasRef.current, socket, id))
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id,
                    username: canvasState.username,
                    method: "connection"
                }))
            }
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data)
                switch (msg.method) {
                    case "connection":
                        console.log(`user connected ${msg.username}`)
                        break
                    case "draw":
                        handleDraw(msg, canvasRef)
                        break
                }
            }
        }
    }, [canvasState.username]);

    useEffect(() => {
        handleUploadImage(canvasRef, id)
    }, []);

    const mouseDownHandler = () => {
        if (!canvasRef.current) return;
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res.data))
    }

    const connectHandler = () => {
        if (!usernameRef.current) return;
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
