import * as express from 'express';
import { Server } from 'http';
import * as socketIo from 'socket.io';
import * as casual from 'casual';
import * as sqlite3 from 'sqlite3';
import * as bodyParser from 'body-parser';
import * as dns from 'dns';

const app = express();
app.use(bodyParser.json())
const server = new Server(app);
const io = socketIo(server);

// first initialize the database
const db = new sqlite3.Database('database.sqlite');
db.serialize(() => {
    // create shoutbox table
    db.run("CREATE TABLE IF NOT EXISTS shoutbox" +
        "(id integer not null primary key autoincrement, " +
        "username varchar not null, " +
        "body text not null, " +
        "sent_at varchar not null)");
});


const port = 3030;
server.listen(port);

app.get('/', (req, res) => res.send('Hello, World!'));

// TODO: Set this only in development
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

app.get('/api/shoutbox', (req, res) => {
    // for now, we simply do not allow scroll back, just send the last 20 messages
    const sql = "SELECT id, username, body, sent_at FROM shoutbox ORDER BY id ASC LIMIT 20";
    db.all(sql, (err, rows) => {
        if (err !== null) {
            console.log(err);
            return;
        }

        const messages = rows.map(row => ({
            id: row.id,
            username: row.username,
            body: row.body,
            time: row.sent_at
        }));

        res.json({ messages });
    });
});

app.post('/api/shoutbox', (req, res) => {
    if (req.body.body === undefined) {
        res.json({ error: "No message given" });
        return;
    }

    // obtain the IP and the hostname, so we can display the hostname as username
    const ip = req.connection.remoteAddress;
    dns.reverse(ip, (err, allDomains) => {
        const domains = allDomains.filter(domain => domain !== 'localhost');
        let username = 'unknown';
        if (domains.length >= 1) {
            username = domains[0];
        }
        if (username.endsWith(".lan")) {
            username = username.replace(".lan", "");
        }

        sendMessage(username, req.body.body);

        res.json("Message sent");
    });
});

app.get('/api/activities', (req, res) => {
    res.json({
        activities: [
            {
                title: 'Tournament: Keep Talking and Nobody Explodes',
                details: 'Downstairs lounge at 16:00',
            },
            {
                title: 'Dinner: Fries & Snacks',
                details: 'Courtyard at 19:00',
            },
        ],
    });
});

const shoutbox = io.of('/shoutbox');

// Send mock messages
const mockUsers = [casual.username, casual.username, casual.username];
const messages = [
    generateMessage({ time: new Date(Date.now() - 60 * 1000) }),
    generateMessage({ time: new Date(Date.now() - 100 * 1000) }),
];

function sendMessage(username: string, body: string, time = new Date()) {
    // save the message in the database
    const sql = "INSERT INTO shoutbox (id, username, body, sent_at) VALUES (NULL, ?, ?, ?)";
    db.run(sql, [username, body, time.toJSON()], function(err) {
        if (err !== null) {
            console.log("SQLite error!", err);
            return;
        }
        // emit the message to the shoutbox
        const message = {
            id: this.lastID,
            username,
            body,
            time
        };
        shoutbox.emit('shoutbox message', message);
    });

}

function generateMessage({ time = new Date() } = {}) {
    return {
        username: casual.random_element(mockUsers),
        body: casual.sentence,
        time,
    };
}
