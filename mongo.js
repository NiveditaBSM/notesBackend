const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give a password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://niveditamagdum2015:${password}@practice.6gl40.mongodb.net/noteApp?retryWrites=true&w=majority&appName=practice`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

/*
    const note = new Note({
        content: "Testing manually is cumbersome!",
        important: true
    })
*/

/*
    note.save().then(result => {
        console.log('note saved')
        mongoose.connection.close()
    })
*/

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})



