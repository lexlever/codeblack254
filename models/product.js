var mongoose = require('mongoose')
const schema = mongoose.Schema

const productSchema = new schema({
    title: {
        type: String,
        required: true
    },
    slog: {
        type: String,
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: String,
        //required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: Buffer,
        required: true
    },
    imgType: {
        type: String
    },
    multiple: {
        type: Buffer,

    },
    multipleType: {
        type: String
    }

    
})

productSchema.virtual('imgSrc').get(function() {
    if(this.img != null && this.imgType != null) {
        return `data:${this.imgType};charset=utf-8;base64,${this.img.toString('base64')}`
    }
})

productSchema.virtual('multipleSrc').get(function() {
    if(this.multiple != null && this.multipleType != null) {
        return `data:${this.multipleType};charset=utf-8;base64,${this.multiple.toString('base64')}`
    }
})


module.exports = mongoose.model('product', productSchema)