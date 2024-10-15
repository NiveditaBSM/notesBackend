const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
// ------------------------------------------------------
// Defining/configuring middleware
// ------------------------------------------------------
morgan.token('body', (request, response) => {
    if (request.body) {
        let temp = {
            content: request.body.content,
            important: request.body.important
        }
        return `request body: ${JSON.stringify(temp)}`
    } else {
        return '{}'
    }
})


const unknownEndPoint = (request, response, next) => {
    response.status(404)
    response.json({
        error: "Content missing"
    })

}
// ------------------------------------------------------
// Data stuff
// ------------------------------------------------------
let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]
// ------------------------------------------------------
//Helper functions
// ------------------------------------------------------
const getNextId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
    return String(maxId + 1)
}

// ------------------------------------------------------
// Middleware
// ------------------------------------------------------
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// ------------------------------------------------------
// Roting and handling requests
// ------------------------------------------------------
app.get('/', (request, response) => {
    response.send('<h2>Hello World, from home</h2>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.post('/api/notes', (request, response) => {

    const note = request.body

    if (!note.content) {
        response.status(400)
        response.json({
            error: "Content missing"
        })
    } else {
        const temp = {
            id: getNextId(),
            content: note.content,
            important: note.important || false,
        }

        notes = notes.concat(temp)

        response.json(temp)
    }

})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id

    const note = notes.find(note => note.id === id)
    if (note) {
        const temp = request.body

        notes = notes.filter(note => note.id !== id)
        notes = notes.concat(temp)

        response.json(temp)

    } else {
        response.status(400)
        response.json({
            error: "Note not present"
        })
    }

})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

app.use(unknownEndPoint)

// ------------------------------------------------------
// Starting the server
// ------------------------------------------------------
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is started on ${PORT}`))