const path = require('path')
const express = require('express')

const port = process.env.PORT || 3000

const app = express()
const publicDirectoryPath = path.join(__dirname, '..', 'public')

app.use(express.static(publicDirectoryPath))

app.get('/chat', (req, res) => {

})


app.listen(port, () => {
    console.log(`server is up and running on port: ${port}`)
})
