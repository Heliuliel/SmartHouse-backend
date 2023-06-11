const express = require('express')
const app = express()
const db = require('mongoose')
const bp = require('body-parser')
db.connect('mongodb+srv://heli:Hh123456@cluster0.2190pkc.mongodb.net/smarthouse')
app.use(express.static('smarthouse/build'))
app.use(bp.json())
const familySchema = db.Schema({
    surname: String,
    city: String,
    fm: Array,
    rooms: Array
})
const familyModel = db.model('families', familySchema)
let currentFamily;
let currentRoom = {}
let i;

app.post('/addfamily', (req, res) => {
    let temp = {
        surname: req.body.surname,
        city: req.body.city,
        fm: req.body.fm,
    }
    const add = async () => {
        await familyModel.insertMany(temp)
        res.json('added')
    }
    add()
})

app.get('/getallfamilies', (req, res) => {
    const getAll = async () => {
        let temp = await familyModel.find()
        res.json(temp)
    }
    getAll()
})

app.post('/findfamily', (req, res) => {
    const find =async () => {
        let result = await familyModel.findOne({surname:req.body.surname})
        if (result != null) {
            currentFamily = result
            res.json(result)
        }
        else {
            res.json({ messege: 'not found' })
        }

    }
    find()
})

app.get('/getcurrentfamily', (req, res) => {
    res.json(currentFamily)

})
app.post('/addroom', (req, res) => {
    const add = async () => {
        let room = {
            type: req.body.type,
            color: req.body.color,
            appliances: []
        }
        currentFamily.rooms.push(room)
        await familyModel.updateOne({ surname: currentFamily.surname }, { rooms: currentFamily.rooms })
        res.json(currentFamily)
    }
    add()
})

app.post('/getcurrentroom', (req, res) => {
    i = req.body.i
    const getroom = async () => {
        currentRoom = await currentFamily.rooms[i]
        res.json(currentRoom)
    }
    getroom()
})

app.get('/getroom', (req, res) => {
    res.json(currentRoom)

})

app.post('/addapplince', (req, res) => {
    let appliance = {
        type: req.body.choose,
        status: req.body.status
    }
    const add = async () => {
        await currentFamily.rooms[i].appliances.push(appliance)
        currentRoom = currentFamily.rooms[i]
        await familyModel.updateOne({ surname: currentFamily.surname }, { rooms: currentFamily.rooms })
        res.json({ currentRoom, currentFamily })
    }
    add()

})

app.post('/changestatus', (req, res) => {
    const change = async () => {
        currentRoom.appliances[req.body.i].status = req.body.status
        currentFamily.rooms[i] = currentRoom
        await familyModel.updateOne({ surname: currentFamily.surname }, { rooms: currentFamily.rooms })
        res.json({ currentRoom, currentFamily })
    }
    change()
})

app.listen('4000', () => { console.log('server is active'); })