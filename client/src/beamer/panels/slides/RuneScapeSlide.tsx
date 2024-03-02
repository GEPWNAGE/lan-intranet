import * as React from 'react';
import { useEffect, useState } from 'react';
import './RuneScapeSlide.scss';

export interface RuneScapeSlideProps {
    world: number
}

const RS_API = "http://api.runescape.gepwnage.lan"
const RS_SKILLS: {[index: number]: string} = {
    0: 'Attack',
    1: 'Defence',
    2: 'Strength',
    3: 'Hitpoints',
    4: 'Ranged',
    5: 'Prayer',
    6: 'Magic',
    7: 'Cooking',
    8: 'Woodcutting',
    9: 'Fletching',
    10: 'Fishing',
    11: 'Firemaking',
    12: 'Crafting',
    13: 'Smithing',
    14: 'Mining',
    15: 'Herblore',
    16: 'Agility',
    17: 'Thieving',
    18: 'Slayer',
    19: 'Farming',
    20: 'Runecrafting',
    21: 'Hunter',
    22: 'Construction',
    23: 'Summoning'
}

interface PlayerData {
    username: string,
    level: number,
    xp: number,
}

function randomSkill() {
    return Math.floor(Math.random() * Object.keys(RS_SKILLS).length);
}

export default function RuneScapeSlide(props: RuneScapeSlideProps) {
    const [skill, setSkill] = useState(randomSkill());
    const [skillLoaded, setSkillLoaded] = useState(false);
    const [hiscores, setHiscores] = useState([] as PlayerData[]);

    useEffect(() => {
        if (skillLoaded) {
            return;
        }
        fetch(`${RS_API}/hiscores/playersBySkill/${props.world}/${skill}`, {mode: 'cors'})
            .then(res => res.json())
            .then((body: PlayerData[]) => {
                setHiscores(body.slice(0,10));
                setSkillLoaded(true);
            })
            .catch(e => { console.error(e) });
    })

    return <div className='row'>
        <div className='col'>
            <h4>RuneScape {RS_SKILLS[skill]} Highscores</h4>
            <table className="rs-table">
                <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Level</th>
                    <th>XP</th>
                </tr>
                </thead>
                <tbody>
                    {hiscores.map((s: PlayerData, i: number) => <tr>
                        <td>{i + 1}</td>
                        <td>{s.username}</td>
                        <td>{s.level}</td>
                        <td>{Math.floor(s.xp)}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>;
}
