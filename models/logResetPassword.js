
import mongoose from 'mongoose'

const { Schema } = mongoose

const schema = new Schema({
    username: String,
    table: String,
    status: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.SchemaTypes.ObjectId, ref: 'Users' },
    message: String
})

export default mongoose.model('LogResetPassword', schema)
