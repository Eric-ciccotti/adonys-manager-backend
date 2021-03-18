const { Schema, model } = require('mongoose');

const Table = new Schema ({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      client: {
        type: String,
        required: false,
      },
      nombreAppels: {
        type: Number,
        required: false,
      },
})

module.exports = model('table', TableSchema)
