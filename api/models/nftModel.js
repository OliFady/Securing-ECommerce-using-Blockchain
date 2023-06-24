const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const nftSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A NFT must have a name"],
            unique: true,
            trim: true,
            maxlength: [40, "nft must have 40 character"],
            minlength: [10, "nft must have 10 character"],
            validate: [validator.isAlpha,"NFT must only contain characters"]
        },
        slug: String,
        duration: {
            type: String,
        },
        maxGroupSize: {
            type: Number,
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, "must have 1"],
            max: [5, "must have 5"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, "A NFT must have price"],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function(val) {
                    return val < this.price; 
                },
                message: "Discount price ({VALUE}) should be below regular price",
            },
        },
        summary: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        imageCover: {
            type: String,
        },
        images: [String],

        startDates: [Date],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

nftSchema.virtual("durationWeeks").get(function() {
    return this.duration / 7
})

nftSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true })
    next()
})

nftSchema.post("save", function(doc, next) {
    console.log(doc)
    next()
})

const NFT = mongoose.model("nft", nftSchema);

module.exports = NFT;
