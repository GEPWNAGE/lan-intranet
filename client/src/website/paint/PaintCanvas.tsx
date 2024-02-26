import * as React from 'react';
import { useEffect, useRef } from 'react';

export interface PaintCanvasProps {
    onClick: (x: number, y: number) => void;
    size: number;
    grid: string[][];
}

export default function PaintCanvas(props: PaintCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelSize = props.size / 128;

    // draw the grid, when the canvas has been mounted
    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (context === null) {
            return;
        }

        context.clearRect(0, 0, props.size, props.size);

        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                context.fillStyle = props.grid[y][x];
                context.fillRect(pixelSize*x, pixelSize*y, pixelSize, pixelSize);
            }
        }
    });

    const handleClick = (e: any) => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        const bounding = canvas.getBoundingClientRect();
        const mousex = e.clientX - bounding.left;
        const mousey = e.clientY - bounding.top;

        const x = Math.floor(mousex / bounding.width * 128);
        const y = Math.floor(mousey / bounding.height * 128);

        props.onClick(x, y);
    };

    return <canvas ref={canvasRef}
                   onClick={handleClick}
                   width={props.size}
                   height={props.size}/>;
}
