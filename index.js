import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';
import ejs, { name } from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { collection, collection1} from "./mongodb.js";
import session from 'express-session';
import { getUsernameFromSession } from './auth.js';
import jwt from 'jsonwebtoken';

const app = express();
const port = 3000;

app.use(express.json());
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


app.get("/bucket1" , (req, res)=>{
    res.render("bucket1.ejs");
});

app.get("/bucket2" , (req, res)=>{
    res.render("bucket2.ejs");
});

app.get("/bucket3" , (req, res)=>{
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
                    username: req.body.username,
                    password: passwordHash,
                    confirmPassword: cpasswordHash,
                    tokens: []
                };
              
                const token = generateAuthToken(data);
                data.tokens.push({ token });

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
            res.render("index.ejs",{name: name, token: token});
        } else{
            res.send("Wrong Password");
        }
    } catch(error){
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.post("/save", async (req, res)=> {
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

    const bucket = {
        name: name,
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

app.post("/viewmore", (req, res)=>{
    res.render("bucket1.ejs");
});

app.get("/save", (req, res)=>{
    res.render("bucket1.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
