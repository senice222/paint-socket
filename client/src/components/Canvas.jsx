import React, {useEffect, useRef, useState} from 'react';
import style from '../styles/canvas.module.scss'
import {observer} from "mobx-react-lite";
import canvasState from "../store/canvasState";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import {Button, Modal} from "react-bootstrap";
import Eraser from "../tools/Eraser";
import {useParams} from "react-router-dom";
import Rect from "../tools/Rect";
import axios from 'axios'
import Circle from "../tools/Circle";
import Line from "../tools/Line";

const Canvas = observer(() => {
    const canvasRef = useRef()
    const [modal, setModal] = useState(true)
    const usernameRef = useRef()
    const {id} = useParams()

    useEffect(() => {
        if (canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000');
            canvasState.setSocket(socket)
            canvasState.setSessionId(id)
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
                        drawHandler(msg)
                        break
                }
            }
        }
    }, [canvasState.username]);

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.stroke()
                }
            })
    }, []);

    const drawHandler = (msg) => {
        const figure = msg.figure
        const ctx = canvasRef.current.getContext('2d')
        console.log(figure)
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
            case "line":
                Line.staticDraw(ctx, figure.x, figure.y, figure.color)
                break
            case "Finish":
                ctx.beginPath()
                break
        }
    }

    const mouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${id}`, {img: canvasRef.current.toDataURL()})
            .then(res => console.log(res.data))
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
