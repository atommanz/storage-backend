
import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
    username: String,
    role: String,
})

export default mongoose.model('Users', schema)
