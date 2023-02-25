import {useRef, useEffect, useState} from 'react'
import Map_paint from "../DrawingArea";



const Canvas_2 = () => {
    const canvasRef = useRef(null );
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false)


    useEffect(() => {
        const canvas = canvasRef.current;


        const context = canvas.getContext("2d");
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 5;
        contextRef.current = context;
    }, []);

    const startDrawing = ({nativeEvent}) => {
        const{offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({nativeEvent}) => {
        if(!isDrawing){
            return;
        }
        const{offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);


    };

    return(

        <Map_paint className="canvas" style={{"border-style" : "dotted", "width" : "300px", "height" : "300px"}}
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}


        >


        </Map_paint>
    )
}

export default Canvas_2;