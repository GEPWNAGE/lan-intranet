import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import useSocket from '../../helpers/useSocket';

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

interface PaintMessage {
    x: number;
    y: number;
    color: string;
};

async function sendPixelChange(x: number, y: number, color: string) {
    await fetch('/paint/api/pixel', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({x, y, color})
    });
}

export default function PaintCanvas(props: PaintCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState('#013370');
    const [grid, setGrid] = useState(() => {
        let grid = [];

        for (let y = 0; y < 128; y++) {
            let row = [];

            for (let x = 0; x < 128; x++) {
                row.push('#013370');
            }

            grid.push(row);
        }

        return grid;
    });
    const [gridLoaded, setGridLoaded] = useState(false);

    const socket = useSocket();

    useEffect(() => {
        function callback(msg: PaintMessage) {
            paintGrid(msg.x, msg.y, msg.color);
        }

        if (socket !== null) {
            socket.removeAllListeners();
            socket.on('pixel change', callback);
        }
    });

    useEffect(() => {
        if (gridLoaded) {
            return;
        }
        setGridLoaded(true);

        fetch('/paint/api/grid')
            .then(res => res.json())
            .then(body => setGrid(body));
    }, [gridLoaded]);

    const pixelSize = props.size / 128;

    function paintGrid(x: number, y: number, color: string) {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (context === null) {
            return;
        }

        context.fillStyle = color;
        context.fillRect(pixelSize*x, pixelSize*y, pixelSize, pixelSize);

        const newGrid = grid;
        newGrid[y][x] = color;
        setGrid(newGrid);
    }

    function handleCanvasClick(e: any) {
        const canvas = canvasRef.current as HTMLCanvasElement;

        const bounding = canvas.getBoundingClientRect();
        const mouseLoc = {
            x: e.clientX - bounding.left - 1,
            y: e.clientY - bounding.top - 1
        };

        const pixelLoc = {
            x: Math.floor(mouseLoc.x / pixelSize),
            y: Math.floor(mouseLoc.y / pixelSize)
        };

        sendPixelChange(pixelLoc.x, pixelLoc.y, color);
    };

    useEffect(() => {
        const canvas = canvasRef.current as HTMLCanvasElement;
        const context = canvas.getContext('2d');

        if (context === null) {
            return;
        }

        context.clearRect(0, 0, props.size, props.size);

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
                <canvas ref={canvasRef} onClick={handleCanvasClick} width={props.size} height={props.size}/>
            </div>
        </div>
    );
}
