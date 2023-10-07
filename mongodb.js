import mongoose, { model } from "mongoose";
mongoose.connect("mongodb://0.0.0.0:27017/credentialsdb")
.then(() =>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect")
})

const LogInSchema = new mongoose.Schema({
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
    }
});

const collection = new mongoose.model("users", LogInSchema);

const bucket1Schema = new mongoose.Schema({
    name: {
        type: String,
        // required: true
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

export { collection, collection1 };