import mongoose, { model } from "mongoose";
import jwt from "jsonwebtoken";
mongoose.connect("mongodb://0.0.0.0:27017/credentialsdb")
.then(() =>{
    console.log("mongodb connected");
})
.catch((e)=>{
    console.log("failed to connect")
})

const LogInSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
});


const collection = new mongoose.model("users", LogInSchema);

const bucket1Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    TypeOfBucket:{
        type: String,
        required: true
    },
    QualityOfTheConference: {
        type: Number,
        required: true
    },
    Level: {
        type: Number,
        required: true
    },
    Authorship: {
        type: Number,
        required: true
    },
    TypeOfReview: {
        type: Number,
        required: true
    },
    TyprOfRepresentation: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const collection1 = new mongoose.model("bucket1", bucket1Schema);

const bucket2Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    TypeOfBucket:{
        type: String,
        required: true
    },
    QualityOfTheJournal: {
        type: Number,
        required: true
    },
    JournalWithImpactFactor: {
        type: Number,
        required: true
    },
    Level: {
        type: Number,
        required: true
    },
    Authorship:{
        type: Number,
        required: true
    },
    TypeOfReview: {
        type: Number,
        required: true
    },
    AvailabilityInTheFormOf: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const collection2 = new mongoose.model("bucket2", bucket2Schema);

const bucket3Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    TypeOfBucket:{
        type: String,
        required: true
    },
    QualityOfTheConference: {
        type: Number,
        required: true
    },
    Level: {
        type: Number,
        required: true
    },
    AmountOfWaiverInRegistrationFees: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
});

const collection3 = new mongoose.model("bucket3", bucket3Schema);

export { collection, collection1, collection2, collection3};