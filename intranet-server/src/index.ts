import * as express from 'express';
import { Server } from 'http';
import * as socketIo from 'socket.io';
import * as casual from 'casual';

const app = express();
const server = new Server(app);
const io = socketIo(server);

const port = 3030;
server.listen(port);

app.get('/', (req, res) => res.send('Hello, World!'));

const shoutbox = io.of('/shoutbox');

// Send mock messages
const mockUsers = [casual.username, casual.username, casual.username];
let prevMessageId = 0;
const messages = [
    generateMessage({ time: new Date(Date.now() - (60 * 1000)) }),
    generateMessage({ time: new Date(Date.now() - (100 * 1000)) }),
];

function generateMessage({ time = new Date() } = {}) {
    return {
        id: prevMessageId++,
        username: casual.random_element(mockUsers),
        body: casual.sentence,
        time,
    };
}

function emitMessage() {
    const message = generateMessage();
    messages.push(message);
    shoutbox.emit('shoutbox message', message);

    setTimeout(emitMessage, casual.integer(2000, 10000));
}

emitMessage();
