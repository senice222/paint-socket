import canvasState from "../store/canvasState";
import axios from "axios";
import {RefObject} from "react";

export const handleUploadImage = (canvasRef: RefObject<HTMLCanvasElement>, id: string | undefined) => {
    try {
        if (!canvasRef.current) return;
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    if (canvasRef.current) {
                        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                        ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                        ctx?.stroke()
                    }
                }
            })
    } catch (e) {
        console.log(e)
    }
}