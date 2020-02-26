import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

interface ColorPickerProps {
    color: string;
    changeColor: (color: string) => void;
};

function ColorPicker(props: ColorPickerProps) {
    return (
        <div className="form-group">
            <input type="string" value={props.color} onChange={e => props.changeColor(e.target.value)}/>
        </div>
    );
}

export interface PaintCanvasProps {
    size: number;
}

export default function PaintCanvas(props: PaintCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#013370');
    const [grid, setGrid] = useState(() => {
        let grid = [];

        for (let y = 0; y < 128; y++) {
            let row = [];

            for (let x = 0; x < 128; x++) {
                if ((x + y) % 2 === 0) {
                    row.push('#ffff00');
                } else {
                    row.push('#013370');
                }
            }

            grid.push(row);
        }

        return grid;
    });

    function paintGrid(x: number, y: number) {
        const newGrid = grid;
        newGrid[y][x] = color;
        setGrid(newGrid);
    }

    console.log(grid);

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (context === null) {
            return;
        }

        const pixelSize = props.size / 128;
        context.clearRect(0, 0, props.size, props.size);

        canvas.addEventListener('mousedown', e => {
            const bounding = canvas.getBoundingClientRect();
            const mouseLoc = {
                x: e.clientX - bounding.left,
                y: e.clientY - bounding.top
            };

            const pixelLoc = {
                x: Math.floor(mouseLoc.x / pixelSize),
                y: Math.floor(mouseLoc.y / pixelSize)
            };

            context.fillStyle = color;
            context.fillRect(pixelSize*pixelLoc.x, pixelSize*pixelLoc.y, pixelSize, pixelSize);
            paintGrid(pixelLoc.x, pixelLoc.y);
        });

        for (let y = 0; y < 128; y++) {
            for (let x = 0; x < 128; x++) {
                context.fillStyle = grid[y][x];
                context.fillRect(pixelSize*x, pixelSize*y, pixelSize, pixelSize);
            }
        }
    });

    return (
        <div className="row">
            <div className="col">
                <ColorPicker color={color} changeColor={setColor}/>
            </div>
            <div className="col-11">
                <canvas ref={canvasRef} width={props.size} height={props.size}/>
            </div>
        </div>
    );
}
