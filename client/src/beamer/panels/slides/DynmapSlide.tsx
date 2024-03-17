import * as React from 'react';
import { useEffect, useState } from 'react';
import './DynmapSlide.scss';

export interface DynmapSlideProps {
    world: number
}

const DYNMAP_URL = "http://minecraft.gepwnage.lan";

const DEFAULT_WORLD = 'world';
const WORLD_MAPS: {[index: string]: string} = {
    'world': 'surface',
    'world_nether': 'nether',
    'world_the_end': 'the_end',
}

interface PlayerData {
    world: string,
    armor: number,
    name: string,
    x: number,
    y: number,
    health: number,
    z: number,
    sort: number,
    type: string,
    account: string
};

interface World {
    world: string,
    map: string,
    player: string,
}

function randomPlayer(players: PlayerData[]) {
    return players[Math.floor(Math.random() * players.length)];
}

export default function DynmapSlide(props: DynmapSlideProps) {
    const [world, setWorld] = useState({
        world: DEFAULT_WORLD,
        map: WORLD_MAPS[DEFAULT_WORLD],
    } as World);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (loaded) {
            return;
        }
        fetch(`${DYNMAP_URL}/up/world/world/${props.world}`, { mode: 'cors' })
            .then(res => res.json())
            .then((body: {players: PlayerData[]}) => {
                if (body.players.length > 0) {
                    const player = randomPlayer(body.players);
                    setWorld({
                        world: player.world,
                        map: WORLD_MAPS[world.world],
                        player: player.name,
                    });
                    setLoaded(true);
                }
            })
            .catch(e => { console.error(e) });
    })

    let srcs = `${DYNMAP_URL}/?worldname=${world.world}&mapname=${world.map}&zoom=6&playername=${world.player}&nopanel=true&hidechat=true&nocompass=true&nopanel=true`
    return <iframe className='dynmap' src={srcs} />;
}
