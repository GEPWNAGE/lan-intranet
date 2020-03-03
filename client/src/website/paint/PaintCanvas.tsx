import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import useSocket from '../../helpers/useSocket';

interface ColorPickerProps {
    color: string;
    changeColor: (color: string) => void;
}

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

function ColorPicker(props: ColorPickerProps) {
    return (
        <div className="form-group">
            <input type="string" value={props.color} onChange={e => props.changeColor(e.target.value)}/>
        </div>
    );
}

interface RenderCanvasProps {
    onClick: (x: number, y: number) => void;
    size: number;
    grid: string[][];
}

function RenderCanvas(props: RenderCanvasProps) {
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

    console.log("not effect");

    useEffect(() => {
        console.log("Effect");
    });

    const handleClick = (e: any) => {
        const canvas = canvasRef.current as HTMLCanvasElement;

        const bounding = canvas.getBoundingClientRect();
        const mousex = e.clientX - bounding.left - 1;
        const mousey = e.clientY - bounding.top - 1;

        const x = Math.floor(mousex / pixelSize);
        const y = Math.floor(mousey / pixelSize);

        props.onClick(x, y);
    };

    return <canvas ref={canvasRef}
                   onClick={handleClick}
                   width={props.size}
                   height={props.size}/>;
}

export interface PaintCanvasProps {
    size: number;
}

interface PaintMessage {
    x: number;
    y: number;
    color: string;
}

export default function PaintCanvas(props: PaintCanvasProps) {
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
    // to force rerendering
    const [number, setNumber] = useState(0);

    const socket = useSocket();

    useEffect(() => {
        function callback(msg: PaintMessage) {
            let newGrid = grid;
            newGrid[msg.y][msg.x] = msg.color;
            console.log('Setgrid');
            setGrid(newGrid);
            // force rerender
            setNumber(number + 1);
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

    function handleCanvasClick(x: number, y: number) {
        sendPixelChange(x, y, color);
    };

    return (
        <div className="row">
            <div className="col">
                <ColorPicker color={color} changeColor={setColor}/>
            </div>
            <div className="col-11">
                <RenderCanvas onClick={handleCanvasClick}
                              grid={grid}
                              size={props.size}/>
            </div>
        </div>
    );
}
