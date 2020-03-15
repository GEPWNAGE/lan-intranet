import * as React from 'react';
import { useEffect, useState } from 'react';
import PaintCanvas from './PaintCanvas';

export interface PaintProps {
    size: number;
}

export default function Paint(props: PaintProps) {
    const [grid, setGrid] = useState([['#013370']]);
    const [gridInit, setGridInit] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    // to force rerendering
    const [number, setNumber] = useState(0);

    useEffect(() => {
        if (gridInit) {
            return;
        }

        // initialize grid
        let grid = [];
        for (let y = 0; y < 128; y++) {
            let row = [];
            for (let x = 0; x < 128; x++) {
                row.push('#013370');
            }
            grid.push(row);
        }

        setGrid(grid);
        setGridInit(true);
    }, [gridInit]);

    useEffect(() => {
        if (historyLoaded) {
            return;
        }
        fetch('/paint/api/history')
            .then(body => body.json())
            .then(hist => {
                setHistory(hist);
                setHistoryLoaded(true);
            });
    });

    useEffect(() => {
        if (!historyLoaded) {
            return;
        }

        setTimeout(() => {
            if (number > history.length) {
                return;
            }
            const hist: any = history[number];

            if (hist === undefined) {
                return;
            }

            let newGrid = grid;
            newGrid[hist.y][hist.x] = hist.color;
            setGrid(newGrid);
            setNumber(number+1);
        }, 1);
    });

    if (!gridInit) {
        return <div/>;
    }

    if (historyLoaded) {
        console.log(history);
    }

    return (
        <div>
            <div className="row mt-2">
                <PaintCanvas onClick={_ => null}
                              grid={grid}
                              size={props.size}/>
            </div>
        </div>
    );
}
