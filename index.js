import express from "express";
import bodyParser from "body-parser";
import bcrypt from 'bcrypt';
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { collection, collection1} from "./mongodb.js";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
   res.render("login.ejs");
});

app.get("/signup", (req, res)=>{
    res.render("signup.ejs");
});

app.get("/bucket1.ejs", (req, res)=> {
    res.render("bucket1.ejs");
});

app.post("/signup", async (req, res)=>{
        const data = {
            username: req.body.name,
            password: req.body.password,
            confirmPassword: req.body.confirmpassword
        }
        
        const existUser = await collection.findOne({username: data.username});
       if(existUser){
        res.send("User already exists");
       } else {
        if(req.body.password === req.body.confirmpassword){
            // const saltRounds = 10;
            // const hashedPassword = await bcrypt.hash(data.password, saltRounds);

            // data.password = hashedPassword;

            const userdata = await collection.insertMany(data);
            console.log(userdata);
           }
           res.render("login.ejs"); 
       }
});

app.post("/signin", async (req, res)=>{
    try{
        const check = await collection.findOne({username: req.body.username});
        if(!check){
            res.send("user name cannot found");
        }

        if(check.password === req.body.password){
            res.render("index.ejs");
        } else{
            res.send("Wrong Password");
        }
    } catch(error){
        res.send(error);
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
        QualityOfTheConference: a,
        Level: b,
        Authorship: c,
        TypeOfReview: d,
        TyprOfRepresentation: e,
        total: sum
    } 

    const bucketdata = await collection1.insertMany(bucket);
    console.log(bucketdata);
    // console.log('Selected option:', selectedOption
    
})

app.get("/save", (req, res)=>{
    res.render("index.ejs");
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});






// import express from 'express';

// const app = express();
// const port = 3000;

// // Middleware to parse form data
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Serve static files (including index.ejs)
// app.use(express.static('public'));

// app.get("/", (req, res) => {
//     res.render("bucket1.ejs");
// });

// // Handle POST request
// app.post('/save', (req, res) => {
//     const { selectedOption } = req.body;
//     console.log('Selected option:', selectedOption);
//     res.redirect('/');
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
