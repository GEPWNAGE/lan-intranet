import * as express from 'express';
import { Server } from 'http';
import * as path from 'path';
import * as socketIo from 'socket.io';
import * as bodyParser from 'body-parser';

import routes from './routes';

const app = express();

// Express Config
app.use(bodyParser.json());

// Configure views
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'twig');

const CLIENT_DIR = path.resolve(__dirname, '../../intranet-client');
app.use('/static', express.static(path.resolve(CLIENT_DIR, 'build/static')));

// Load routes
app.use(routes);

const MANIFEST_PATH = path.resolve(CLIENT_DIR, 'webpack.manifest.json');

// Function to get entry files of a specific entrypoint
app.locals.entrypoints = function(key: string, type: string) {
    delete require.cache[require.resolve(MANIFEST_PATH)];

    const manifest = require(MANIFEST_PATH);
    if (!(key in manifest.entrypoints)) {
        return [];
    }

    const entrypoints = manifest.entrypoints[key];
    if (!(type in entrypoints)) {
        return [];
    }

    // Rewrite the urls
    return entrypoints[type].map((url: string) => `/${url}`);
};

const server = new Server(app);
export const io = socketIo(server);

export const ioShoutbox = io.of('/shoutbox');

const port = 3030;
server.listen(port);

// TODO: Set this only in development (or remove it altogether?)
if (true) {
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept',
        );
        next();
    });
}
