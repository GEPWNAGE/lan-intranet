import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as twig from 'twig';
import serveFavicon from 'serve-favicon';
import proxy from 'http-proxy-middleware';
import fetch from 'node-fetch';
import cookieParser from 'cookie-parser';

import routes from './routes';
import apiRoutes from './routes/api';
import adminRoutes from './routes/admin';
import paintRoutes from './routes/paint';


// Load vars from .env file
dotenv.config();

const app = express();

// Express Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(serveFavicon(__dirname + "/favicon.ico"));

// Configure views
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'twig');

twig.cache(app.get('view cache') === true);

const CLIENT_DIR = path.resolve(__dirname, '../../client');

if (app.get('env') === 'production') {
    // in production, serve from build
    app.use('/static', express.static(path.resolve(CLIENT_DIR, 'build/static')));
}

// TODO: Set this only in development (or remove it altogether?)
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept',
    );
    next();
});

// Load routes
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);
app.use('/paint/api', paintRoutes);
app.use(routes);

if (app.get('env') === 'development') {
    // in development, proxy non-matching requests to webpack server
    app.use('/', proxy({ target: 'http://localhost:3000', ws: true }));
}

const MANIFEST_PATH = path.resolve(CLIENT_DIR, 'build/asset-manifest.json');
const MANIFEST_URL = 'http://localhost:3000/asset-manifest.json';
let MANIFEST = <any>{};

async function loadManifest() {
    if (app.get('env') === 'development') {
        const res = await fetch(MANIFEST_URL);
        return await res.json();
    }

    delete require.cache[require.resolve(MANIFEST_PATH)];
    return require(MANIFEST_PATH);
}

function saveManifest() {
    loadManifest()
        .then(manifest => MANIFEST = manifest)
        .catch(error => console.log(error.code, "Asset manifest currently unavailable"))
}

// load and set the manifest
if (app.get('env') === 'development') {
    setInterval(saveManifest, 1000);
} else {
    // in production, no need to reload the manifest every second
    saveManifest();
}

// we either proxy or serve ourselves
const ASSETS_URL = '/';

app.locals.entrypoints = function(typ: string) {
    if (MANIFEST.entrypoints === undefined) {
        return [];
    }

    return MANIFEST.entrypoints
        .filter((url: string) => url.substring(url.length - typ.length, url.length) === typ)
        .map((url: string) => ASSETS_URL + url);
}

app.locals.static = function(key: string) {
    if (MANIFEST.files !== undefined && key in MANIFEST.files) {
        return MANIFEST.files[key]
    }

    return ASSETS_URL + key;
}

const server = new Server(app);
export const io = socketIo(server);

export const ioShoutbox = io.of('/shoutbox');
export const ioPaint = io.of('/paint');

const port = 3030;
server.listen(port);
