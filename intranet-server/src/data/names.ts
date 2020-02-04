import * as dns from 'dns';
import { promisify } from 'util';

import { dbAll } from '../db';
import {Request} from "express";

const dnsReverse = promisify(dns.reverse);

export interface Hostname {
    full: string;
    name: string;
    ip: string;
}

export async function getHostnameFromIp(req: Request): Promise<Hostname> {
    let ip = req.connection.remoteAddress;

    if ((ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') && req.header('X-Forwarded-For') !== undefined) {
        ip = req.header('X-Forwarded-For');
    }

    try {
        if (ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }

        const domains = await dnsReverse(ip);

        if (domains.length === 0 && (ip === '::1' || ip === '127.0.0.1')) {
            return { full: 'localhost', name: 'localhost', ip };
        }

        let hostname = domains[0];
        let full = hostname;

        for (let i in domains) {
            let domain = domains[i];
            if (domain.endsWith('.gepwnage.lan')) {
                full = domain;
                hostname = domain.replace('.gepwnage.lan', '');
                break;
            }
            if (domain !== 'localhost') {
                full = domain;
                hostname = domain;
            }
        }

        return { full, name: hostname, ip };
    } catch (err) {
        console.log(err);

        return { full: ip, name: ip, ip };
    }
}

export async function getNickFromHostname(hostname: string): Promise<string | null> {
    try {
        const rows = await dbAll(
            'SELECT nick FROM nicknames WHERE hostname = ?',
            [hostname],
        );

        let nick = null;

        if (rows.length > 0) {
            nick = rows[0].nick;
        }

        return nick;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export function getUsername(nick: string | null, hostname: string): string {
    if (nick !== null) {
        return nick + ' [' + hostname + ']';
    } else {
        return hostname;
    }
}
