import * as React from 'react';
import { useEffect, useState } from 'react';
import useSocket from '../../helpers/useSocket';
import PaintCanvas from './PaintCanvas';

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
                   style={{ backgroundColor: props.color, borderColor: '#000000' }}>&nbsp;&nbsp;</button>;
}

interface ColorPickerProps {
    color: string;
    changeColor: (color: string) => void;
}

function ColorPicker(props: ColorPickerProps) {
    const colors = [
        '#000000',
        '#FFFFFF',
        '#555555',
        '#FF0000',
        '#FFFF00',
        '#013370',
        '#FF69B4',
        '#00FF00',
        '#32E0D0',
    ];

    const colorPickers = colors.map(color => (
        <div className="col-auto">
            <ColorButton onClick={c => props.changeColor(c)} color={color}/>
        </div>
    ));

    return (
        <div className="form-row">
            <div className="col-auto">
                <input type="string" className="form-control" value={props.color} onChange={e => props.changeColor(e.target.value)}/>
            </div>
            {colorPickers}
        </div>
    );
}

export interface PaintProps {
    size: number;
}

interface PaintMessage {
    x: number;
    y: number;
    color: string;
}

export default function Paint(props: PaintProps) {
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
                <PaintCanvas onClick={handleCanvasClick}
                              grid={grid}
                              size={props.size}/>
            </div>
        </div>
    );
}
