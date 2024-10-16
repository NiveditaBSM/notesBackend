require('dotenv').config();
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const Note = require('./models/note')


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
    response.send({
        error: "Content missing"
    })

}

const errorHandler = (error, request, response, next) => {
    console.log(error.name)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name == 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
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

app.get('/api/notes', (request, response, next) => {
    Note.find({}).then(notes => {
        response.json(notes)
    }).catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note)
        } else {
            response.status(404).json({
                error: "note not in the database"
            })
        }
    }).catch(error => next(error))

})

app.post('/api/notes', (request, response, next) => {

    const noteToPost = request.body

    const note = new Note({
        content: noteToPost.content,
        important: noteToPost.important || false
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    }).catch(error => next(error))

})

app.put('/api/notes/:id', (request, response, next) => {

    const { content, important } = request.body

    Note.findByIdAndUpdate(request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
    console.log("in delete")
    Note.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.use(unknownEndPoint)
app.use(errorHandler)

// ------------------------------------------------------
// Starting the server
// ------------------------------------------------------
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is started on ${PORT}`))