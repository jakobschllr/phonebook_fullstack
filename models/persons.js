const mongoose = require("mongoose")


const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)
mongoose.connect(url)

console.log("connecting to ", url)

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch(error => {
        console.log("Error connecting to MongoDB: ", error.message)
    })

    // defining the phonebookSchema and setting requirements
const phonebookSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: Number,
        minLength: 6,
        required: true
    }
})

// change format of json data from database
phonebookSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Entry", phonebookSchema)