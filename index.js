const express = require('express')
const app = express()
const port = 5000

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://lhi7837:lim9204@project.zcnes.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log("MongoDB Connected!"))
.catch(err => console.log(err))

app.get('/',(req,res) => res.send('노드 서버'))

app.listen(port, () => console.log(`해당 포트로 열림 : ${port}`))
