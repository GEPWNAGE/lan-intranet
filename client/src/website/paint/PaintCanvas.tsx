import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import useSocket from '../../helpers/useSocket';

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

interface ColorButtonProps {
    color: string;
    onClick: (color: string) => void;
}

function ColorButton(props: ColorButtonProps) {
    return <button onClick={_ => props.onClick(props.color)}
                   className="btn btn-primary"
                   style={{ backgroundColor: props.color, borderColor: '#000000' }}>&nbsp;</button>;
}

interface ColorPickerProps {
    color: string;
    changeColor: (color: string) => void;
}

function ColorPicker(props: ColorPickerProps) {
    return (
        <div className="form-row">
            <div className="col-auto">
                <input type="string" className="form-control" value={props.color} onChange={e => props.changeColor(e.target.value)}/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#000000"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#FFFFFF"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#555555"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#FF0000"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#FFFF00"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#013370"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#FF69B4"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#00FF00"/>
            </div>
            <div className="col-auto">
                <ColorButton onClick={color => props.changeColor(color)} color="#32E0D0"/>
            </div>
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
        <div>
            <div className="row">
                <ColorPicker color={color} changeColor={setColor}/>
            </div>
            <div className="row mt-2">
                <RenderCanvas onClick={handleCanvasClick}
                              grid={grid}
                              size={props.size}/>
            </div>
        </div>
    );
}
