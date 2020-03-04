import * as React from 'react';
import { useEffect, useState } from 'react';
import PaintCanvas from '../../../website/paint/PaintCanvas';
import useSocket from '../../../helpers/useSocket';

interface PaintMessage {
    x: number;
    y: number;
    color: string;
}

export interface PaintSlideProps {
    size: number
}

export default function PaintSlide(props: PaintSlideProps) {
    const [grid, setGrid] = useState([['#013370']]);
    const [gridLoaded, setGridLoaded] = useState(false);
    // to force rerendering
    const [number, setNumber] = useState(0);

    const socket = useSocket();

    useEffect(() => {
        function callback(msg: PaintMessage) {
            let newGrid = grid;

            // return early if not fully initialized yet, simply forget this message
            if (newGrid.length < msg.y || newGrid[msg.y].length < msg.x ) {
                return;
            }

            newGrid[msg.y][msg.x] = msg.color;
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
        fetch('/paint/api/grid')
            .then(res => res.json())
            .then(body => {
                setGrid(body);
                setGridLoaded(true);
            });
    })

    if (!gridLoaded) {
        return <div/>;
    }

    return <PaintCanvas onClick={e => e} grid={grid} size={props.size}/>;
}
