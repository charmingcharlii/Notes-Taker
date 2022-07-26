const express = require('express')
const path = require('path')
const uuid = require('./helpers/uuid')
const data = require('./db/db.json')
const fs = require('fs');
const { readFromFile, writeToFile, readAndAppend } = require('./helpers/fsUtils')
const { fstat, writeFile } = require('fs')

const PORT = 3333
const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

// return notes from notes.html
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

// reads the db.json file 
app.get('/api/notes', (req,res) => {
    // const tester = JSON.parse('./db/db.json')
    // console.log(tester)
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        const parsedData1 = JSON.parse(data)
        res.json(parsedData1)
    })
})

// create a new note 
app.post('/api/notes', (req,res) => {
    if(req.body) {
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            note_id: uuid(),
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            const parsedData = JSON.parse(data)
            parsedData.push(newNote)
            const stringifiedData = JSON.stringify(parsedData, null, 4)
            fs.writeFile('./db/db.json', stringifiedData, (writeErr) => writeErr ? console.log(writeErr) : console.log('Saved'))   
        })
      
        res.sendFile(path.join(__dirname, './db/db.json'))
    } else {
        res.json('Error in saving note')
    }
})

app.delete('/api/notes/:id', (req, res) => {
    if(req.body) {
        const oldNote = {
            title: req.body.title,
            text: req.body.text,
            note_id: uuid(),
        }

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            const parsedData = JSON.parse(data)
            parsedData.pop(oldNote)
            const stringifiedData = JSON.stringify(parsedData, null, 4)
            fs.writeFile('./db/db.json', stringifiedData, (writeErr) => writeErr ? console.log(writeErr) : console.log('Deleted'))
        })

      res.json(`Delete successful`)
    } else {
      res.json('Error in deleting note')
    }
})

// return index.html 
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
}) 

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });