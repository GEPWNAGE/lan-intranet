import * as React from 'react';
import { useEffect, useRef } from 'react';

export interface PaintCanvasProps {
    size: number;
}

export default function PaintCanvas(props: PaintCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (context === null) {
            return;
        }

        context.clearRect(0, 0, props.size, props.size);

        const pixelSize = props.size / 128;
        for (let x = 0; x < 256; x++) {
            for (let y = 0; y < 256; y++) {
                if ((x + y) % 2 === 0) {
                    context.fillStyle = 'black';
                } else {
                    context.fillStyle = 'red';
                }

                context.fillRect(pixelSize*x, pixelSize*y, pixelSize, pixelSize);
            }
        }

    });

    return <div><canvas ref={canvasRef} width={props.size} height={props.size}/></div>;
}
