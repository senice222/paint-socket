const express = require('express')
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors')
const PORT = process.env.PORT || 5000
const fs = require('fs')
const path = require('path')

app.use(cors())
app.use(express.json())

app.ws('/', (socket) => {
    socket.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection":
                connectionHandler(socket, msg)
                break
        }
    })
})

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`))

const connectionHandler = (socket, msg) => {
    socket.id = msg.id
    broadcastConnection(socket, msg)
}

const broadcastConnection = (socket, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(`user has connected ${msg.username}`)
        }
    })
}