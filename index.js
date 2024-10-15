const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))
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


app.get('/', (request, response) => {
    response.send('<h2>Hello World, from home</h2>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

const getNextId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => note.id)) : 0
    return String(maxId + 1)
}
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
        console.log(note)
    }

})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    console.log("inside put")
    // const note = notes.find(note => note.id === id)
    const temp = request.body
    console.log(temp)

    notes = notes.filter(note => note.id !== id)
    console.log("After filter: ", notes)
    notes = notes.concat(temp)

    response.json(temp)
    console.log(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
        response.nativeResponse.statusMassage()
    }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server is started on ${PORT}`))