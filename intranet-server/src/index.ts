import express from 'express';
import { Server } from 'http';
import * as path from 'path';
import socketIo from 'socket.io';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as twig from 'twig';
import serveFavicon from 'serve-favicon';
import proxy from 'express-http-proxy';

import routes from './routes';
import apiRoutes from './routes/api';


// Load vars from .env file
dotenv.config();

const app = express();

// Express Config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(serveFavicon(__dirname + "/favicon.ico"));

// Configure views
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'twig');

twig.cache(app.get('view cache') === true);

const CLIENT_DIR = path.resolve(__dirname, '../../intranet-client');
app.use('/static', express.static(path.resolve(CLIENT_DIR, 'build/static')));

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
app.use(routes);


if (app.get('env') === 'development') {
    app.use('/', proxy('localhost:3000'));
}
/*
const MANIFEST_PATH = path.resolve(CLIENT_DIR, 'webpack.manifest.json');
//const ASSETS_URL =
//    app.get('env') === 'production' ? '/' : process.env.WEBPACK_DEV_SERVER_URL;
const ASSETS_URL = '/';

console.log(MANIFEST_PATH);

function getManifest(): any {
    delete require.cache[require.resolve(MANIFEST_PATH)];
    return require(MANIFEST_PATH);
}

// Function to get entry files of a specific entrypoint
app.locals.entrypoints = function(key: string, type: string) {
    const manifest = getManifest();

    if (!(key in manifest.entrypoints)) {
        return [];
    }

    const entrypoints = manifest.entrypoints[key];
    if (!(type in entrypoints)) {
        return [];
    }

    // Rewrite the urls
    return entrypoints[type].map((url: string) => ASSETS_URL + url);
};

app.locals.static = function(key: string) {
    const manifest = getManifest();

    if (!(key in manifest)) {
        return ASSETS_URL + key;
    }

    return ASSETS_URL + manifest[key];
};*/

app.locals.static = function(key: string) {
    return '/' + key;
}

const server = new Server(app);
export const io = socketIo(server);

export const ioShoutbox = io.of('/shoutbox');

const port = 3030;
server.listen(port);
