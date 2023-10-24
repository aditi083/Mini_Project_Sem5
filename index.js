import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';
import ejs, { name } from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { collection, collection1, collection2, collection3} from "./mongodb.js";
import session from 'express-session';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import {auth} from "./auth.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.set("view engine", "ejs");

console.log(process.env.SECRET_KEY);
app.get("/", (req, res) => {
   res.render("signin.ejs");
});


app.get("/signup", (req, res)=>{
    res.render("signup.ejs");
});

app.get("/bucket1" , auth,(req, res)=>{
    res.render("bucket1.ejs");
});

app.get("/bucket2" , auth,(req, res)=>{
    res.render("bucket2.ejs");
});

app.get("/bucket3" , auth,(req, res)=>{
    res.render("bucket3.ejs");
});

app.post("/signup", async (req, res)=>{
    try{
        const passwordHash = await bcrypt.hash(req.body.password, 10);
        const cpasswordHash = await bcrypt.hash(req.body.confirmpassword, 10);

        const existUser = await collection.findOne({username: req.body.username});
       if(existUser){
        res.send("User already exists");
       } else {
            if(req.body.password === req.body.confirmpassword){
                const data = {
                    name: req.body.name,
                    designation: req.body.designation,
                    mobileNumber: req.body.mobileNumber,
                    email: req.body.email,
                    gender: req.body.gender, 
                    username: req.body.username,
                    password: passwordHash,
                    confirmPassword: cpasswordHash,
                    tokens: []
                };
              
                const token = generateAuthToken(data);
                data.tokens.push({ token });

                res.cookie("jwt", token, {expires: (new Date(Date.now() + 600000)), httpOnly: true}); 

                const userdata = await collection.insertMany(data);
                console.log(token);
                console.log(userdata);
                res.render("signin.ejs");
           } else {
               res.send("Password Not Matching");
           }
       }
    } catch(error) {
        res.status(400).send(error);
    }
});

function generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    return token;
} 

app.post("/signin", async (req, res)=>{
    try{
        const check = await collection.findOne({username: req.body.username});
        const name = req.body.username;
        const password = req.body.password;

        const isMatch = bcrypt.compare(password, check.password);
        
        if(!check){
            res.send("user name cannot found");
        }

        if(isMatch){
            const token = generateAuthToken(check);
            console.log(token)

            res.cookie('jwt', token, {expires: (new Date(Date.now() + 600000)), httpOnly: true});


            res.render("index.ejs",{name: name, token: token});
        } else{
            res.send("Wrong Password");
        }
    } catch(error){
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.get("/profile", auth, async (req, res)=> {
    const name = req.user.username;
    const name1 = req.user.name;
    const email = req.user.email;
    const phone = req.user.mobileNumber;
    const designation = req.user.designation;
    const bucketType1 = "Papers published in National/International Conference";
    const bucketType2 = "Papers published in National/International Journal";
    const bucketType3 = "Fellowship received for National/International Conference";

    const count1 = await collection1.countDocuments({ name: name, TypeOfBucket: bucketType1 });
    const count2 = await collection2.countDocuments({ name: name, TypeOfBucket: bucketType2 });
    const count3 = await collection3.countDocuments({ name: name, TypeOfBucket: bucketType3 });
    
    res.render("profile.ejs",{name:name1, count1: count1, count2: count2, count3: count3, email:email, phoneNumber: phone, designation: designation});
})

app.get("/logout", auth, async (req, res)=>{
    try{
        res.clearCookie("jwt");
        console.log("Logout Successsfully");

        await req.user.save();
        res.render("signin.ejs");

    } catch(error){
        res.status(500).send(error);
    }
});

app.post("/save1", auth, async (req, res)=> {
    const { selectedOption1 } = req.body;
    const { selectedOption2 } = req.body;
    const { selectedOption3 } = req.body;
    const { selectedOption4 } = req.body;
    const { selectedOption5 } = req.body;

    let a = -1, b=-1, c=-1, d=-1, e=-1;
    if( selectedOption1 == 1){
        a = 1.5;
    } else if(selectedOption1 == 2){
        a = 0.9;
    } else if(selectedOption1 == 3){
        a = 0.5;
    } else{
        a = 0
    }

    if(selectedOption2 == 1){
        b = 1.25;
    } else if(selectedOption2 == 2){
        b = 1;
    } else if(selectedOption2 == 3){
        b = 0.8
    } else{
        b = 0
    }

    if(selectedOption3 == 1){
        c = 1;
    } else if(selectedOption3 == 2){
        c = 0.8;
    } else{
        c = 0;
    }

    if(selectedOption4 == 1){
        d = 1;
    } else if(selectedOption4 == 2){
        d = 0.8;
    } else{
        d = 0;
    } 

    if(selectedOption5 == 1){
        e = 1;
    } else if(selectedOption5 == 0.5){
        e = 0.5;
    } else{
        e = 0;
    }

    const sum = a+b+c+d+e;
    const str = "Papers published in National/International Conference";

    const bucket = {
        name: req.user.username,
        TypeOfBucket: str,
        QualityOfTheConference: a,
        Level: b,
        Authorship: c,
        TypeOfReview: d,
        TyprOfRepresentation: e,
        total: sum
    } 

    try {
        const bucketdata = await collection1.insertMany(bucket);
        console.log(bucketdata);
        res.send("<script>alert('You data is saved Successfully'); window.location.href = window.location.href; clearSelectTags();</script>"); 
    } catch (error) {
        console.error(error);
    }
});

app.post("/save2", auth, async (req, res)=> {
    const { selectedOption1 } = req.body;
    const { selectedOption2 } = req.body;
    const { selectedOption3 } = req.body;
    const { selectedOption4 } = req.body;
    const { selectedOption5 } = req.body;
    const { selectedOption6 } = req.body;

    let a = -1, b=-1, c=-1, d=-1, e=-1, f=-1;
    if( selectedOption1 == 1){
        a = 1.5;
    } else if(selectedOption1 == 2){
        a = 0.9;
    } else if(selectedOption1 == 3){
        a = 0.5;
    } else {
        a =0;
    }

    if(selectedOption2 == 1){
        b = 1.25;
    } else if(selectedOption2 == 2){
        b = 1;
    } else if(selectedOption2 == 3){
        b = 0.8
    } else {
        b = 0;
    }

    if(selectedOption3 == 1){
        c = 1.25;
    } else if(selectedOption3 == 2){
        c = 1;
    } else if(selectedOption3 == 3){
        c = 0.8;
    } else {
        c = 0;
    }

    if(selectedOption4 == 1){
        d = 1;
    } else if(selectedOption4 == 2){
        d = 0.8;
    } else {
        d = 0;
    }

    if(selectedOption5 == 1){
        e = 1;
    } else if(selectedOption5 == 0.5){
        e = 0.8;
    } else{
        e = 0;
    }

    if(selectedOption6 == 1){
        f = 1.25;
    } else if(selectedOption2 == 2){
        f = 1;
    } else {
        f = 0;
    }

    const sum = a+b+c+d+e+f;
    const str = "Papers published in National/International Journal" ;

    const bucket = {
        name: req.user.username,
        TypeOfBucket: str,
        QualityOfTheJournal: a,
        JournalWithImpactFactor: b,
        Level: c,
        Authorship: d,
        TypeOfReview: e,
        AvailabilityInTheFormOf: f,
        total: sum
    } 

    try {
        const bucketdata = await collection2.insertMany(bucket);
        console.log(bucketdata);
        res.send("<script>alert('You data is saved Successfully'); window.location.href = window.location.href; clearSelectTags();</script>"); 
    } catch (error) {
        console.error(error);
    }
});

app.post("/save3", auth, async (req, res)=> {
    const { selectedOption1 } = req.body;
    const { selectedOption2 } = req.body;
    const { selectedOption3 } = req.body;

    let a = -1, b=-1, c=-1, d=-1, e=-1, f=-1;
    if( selectedOption1 == 1){
        a = 1.25;
    } else if(selectedOption1 == 2){
        a = 0.9;
    } else if(selectedOption1 == 3){
        a = 0.9;
    } else if(selectedOption1 == 4){
        a = 0.5;
    } else {
        a = 0;
    }

    if(selectedOption2 == 1){
        b = 1.25;
    } else if(selectedOption2 == 2){
        b = 1;
    } else if(selectedOption2 == 3){
        b = 0.8
    } else {
        b = 0;
    }

    if(selectedOption3 == 1){
        c = 1.25;
    } else if(selectedOption3 == 2){
        c = 1;
    } else if(selectedOption3 == 3){
        c = 0.8;
    } else {
        c = 0;
    }

    const sum = a+b+c;
    const str = "Fellowship received for National/International Conference" ;

    const bucket = {
        name: req.user.username,
        TypeOfBucket: str,
        QualityOfTheConference: a,
        Level: b,
        AmountOfWaiverInRegistrationFees: c,
        total: sum
    } 

    try {
        const bucketdata = await collection3.insertMany(bucket);
        console.log(bucketdata);
        res.send("<script>alert('You data is saved Successfully'); window.location.href = window.location.href; clearSelectTags();</script>"); 
    } catch (error) {
        console.error(error);
    }
});

app.get("/save1", (req, res)=>{
    res.render("bucket1.ejs");
});

app.get("/save2", (req, res)=>{
    res.render("bucket2.ejs");
});

app.get("/save3", (req, res)=>{
    res.render("bucket3.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
