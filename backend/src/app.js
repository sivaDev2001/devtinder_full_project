require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const http = require('http')
const jwt = require('jsonwebtoken')
const { Server } = require('socket.io')
const database = require('./configuration/database')
const User = require('./models/models')
const authRouter = require('./routes/auth.js')
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/request.js')
const userRouter = require('./routes/user.js')
const fileRouter = require('./routes/files.js')
const messageRouter = require('./routes/message.js')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(
    '/images',
    express.static(path.join(__dirname, './public/images'))
) //to serve static files like images from public folder

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', fileRouter)
app.use('/', messageRouter)

//get data
app.get('/getuser', async (req, res) => {
    const { email } = req.body
    try {
        const users = await User.find({ email: email })
        if (!users) {
            res.status(404).send('no user exists in the database')
        } else {
            res.send(users)
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})

//delete data
app.delete('/deleteuser', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        if (!user) {
            res.send('no user exists')
        } else {
            res.send('successfully deleted')
        }
    } catch (err) {
        res.status(500).send('something went wrong')
    }
})

//update the data
app.patch('/updateuser/:email', async (req, res) => {
    try {
        const userId = req.params
        const data = req.body
        const ALLOWED = ['age', 'gender', 'skill', 'about']
        const is_Allowed = Object.keys(data).every((k) => ALLOWED.includes(k))
        if (!is_Allowed) {
            throw new Error('certain fields are restricted to update')
        }
        const user = await User.findOneAndUpdate(userId, data, {
            runValidators: true,
        })
        if (!user) {
            res.status(404).send('user not found')
        } else {
            res.send('user updated successfully')
        }
    } catch (err) {
        res.status(500).send('something went wrong:' + err.message)
    }
})

// create HTTP server and attach Socket.io
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// make io available in routes
app.set('io', io)

// simple cookie parser for Socket.io handshake
const getTokenFromCookieHeader = (cookieHeader) => {
    if (!cookieHeader) return null
    const parts = cookieHeader.split(';').map((p) => p.trim())
    for (const part of parts) {
        if (part.startsWith('token=')) {
            return part.replace('token=', '')
        }
    }
    return null
}

io.use((socket, next) => {
    try {
        const cookieHeader = socket.request.headers.cookie
        const token = getTokenFromCookieHeader(cookieHeader)
        if (!token) {
            return next(new Error('Authentication error'))
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        socket.userId = payload.id
        next()
    } catch (err) {
        next(err)
    }
})

io.on('connection', (socket) => {
    const userId = socket.userId
    if (!userId) {
        socket.disconnect()
        return
    }
    socket.join(userId.toString())

    socket.on('chat:message', (message) => {
        if (!message || !message.to) {
            return
        }
        const room = message.to.toString()
        io.to(room).emit('chat:message', message)
    })
})

database()
    .then(() => {
        console.log('database connected succussfully')
        httpServer.listen(PORT, () => {
            console.log(`app running successfully on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.log('database not connected')
    })

