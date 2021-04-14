const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected!"))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('노123드 서123버'))

app.get('/api/hello',(req,res)=>{
    res.send("리액트에서 노드로 안녕하세요~")
})


//회원가입
app.post('/api/users/register', (req, res) => {
    const user = new User(req.body)
    user.save((err, user) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })

})

app.post('/api/users/login', (req, res) => {
    //DB에서 이메일 찿기
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "DB에 이메일이 존재하지 않음"
            })
        }

        //비밀번호 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "비밀번호 틀림" })

            //토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                //토큰 저장 쿠키에
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id, message: "성공" })

            })
        })

    })
})

app.get('/api/users/auth', auth, (req, res) => {
    //미들웨어 통과했으니 True
    //role이 0이면 일반 유저 아니면 어드민
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.emaiil,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" },
        (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })

        })
})


const port = 5000

app.listen(port, () => console.log(`해당 포트로 열림 : ${port}`))
