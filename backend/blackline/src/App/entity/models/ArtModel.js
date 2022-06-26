const mongoose = require('mongoose')

const { Schema } = mongoose

const addressInfoSchema = new Schema({
    address: { type:String, required: true},
    balance: { type: Number},

}, { _id: false})

const lineSchema = new Schema({
    x1: { type: Number, required: true},
    x2: { type: Number, required: true},
    y1: { type: Number, required: true},
    y2: { type: Number, required: true},
    addressInfo: { type: addressInfoSchema, required: true},
    info: { type: Object, default: {}, required: true}

}, { _id: false, timestamps: true })

const mongooseSchema = new Schema({
    height: { type: Number},
    width: { type: Number},
    startedAt: { type: Date, required: true},
    completedAt: { type: Date, required: true},
    lineList: { type: [lineSchema], default: [], required: true},
    isCompleted: { type: Boolean, required: true},
    artConfig: { type: Object },
    img: { type: String },
    title: { type: String},
    description: { type: String},
    nftConfig: { type: Object},
    nftLink: { type: String}
}, { timestamps: true }
)

module.exports = mongoose.model('art', mongooseSchema)
