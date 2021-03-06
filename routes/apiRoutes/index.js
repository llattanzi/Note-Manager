const router = require('express').Router();
const { append } = require('express/lib/response');
const fs = require('fs');
const path = require('path');
let { db } = require('../../db/db');
// require package for creating unique ids
const uniqid = require('uniqid');



router.get('/notes', (req, res) => {
    let results = db;
    if (results) {
        res.json(results);
    }
    else {
        res.send(404);
    }
});

router.post('/notes', (req, res) => {
    // set unique id of the new note
    req.body.id = uniqid();

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

router.delete('/notes/:id', (req, res) => {
    // // filter db by id
    const note = db.filter(db => db.id === req.params.id)[0];
    // // check if note exists, if not send error
    if (note) {
        // delete the note from the database
        db = db.filter(db => db.id !== req.params.id);
        // rewrite db.json
        fs.writeFileSync(
            path.join(__dirname, '../../db/db.json'),
            JSON.stringify({db: db}, null, 2)
        );
        res.json(db);
    }
    else {
        res.send(404);
    }
})

module.exports = router;