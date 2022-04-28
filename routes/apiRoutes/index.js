const router = require('express').Router();
const fs = require('fs');
const { path } = require('express/lib/application');
const { db } = require('../../db/db');

router.get('/api/notes', (req, res) => {
    let results = db;
    if (results) {
        res.json(result);
    }
    else {
        res.send(404);
    }
});

router.post('/api/notes', (req, res) => {
    // set unique id of the new note to the length of database
    req.body.id = db.length.toString();

    // validate that the note has a title and description before adding to db. If not send error
    if (!req.body.title || !req.body.text) {
        res.status(400).send('The note needs a title and description!');
    }
    else {
        // add new note to note database
        db.push(req.body);
        // write new note array to db.json
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({db: db}, null, 2)
        );
        // return new note
        res.json(req.body);
    }
});

module.exports = router;