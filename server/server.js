
//we are working with these frameworks
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const studentSchema = require('./model');
const {Student,User} = require('./model');

//use the express
const app = express();

//define the server port
const PORT = 5000;


//bodyparser to be used for sending and receiving data
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//create one uri for connecting database
const uri = 'mongodb://localhost:27017/arrowproject';

mongoose.connect(uri).then(
   () => console.log("db connected") 
).catch(err => console.log(err))


//implementing routes:
// writing the addstudent route to push the data
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });




app.post('/addstudent',async(req,res) =>{
    const {sname,age,grade} = req.body;
    try{
        const newStudent = new Student({sname,age,grade});
        await newStudent.save();
        //every new student move to the all student ultimately
        //all students should be return
        const allStudents = await Student.find();
        return res.json(allStudents); 
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'Internal server error'});
    }
});
//implementing get request
app.get('/getstudents',async(req,res) =>{
    try{
        const allStudents = await Student.find();
        return res.json(allStudents);
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:'internal server error'})
    }
});

//specific id based search
app.get('/getstudents/:id',async (req,res) =>{
    try{
        const Data = await Student.findById(req.params.id)
        return res.json(Data);
    }
    catch(err){
        console.log(err.message)
    }
});

//Update record:
// Update student record by ID
app.put('/updatestudent/:id', async (req, res) => {
    const { sname, age, grade } = req.body;

    try {
        // Find the student by ID and update the fields
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            { sname, age, grade },
            { new: true } // Set to true to return the updated document
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Return the updated student
        return res.json(updatedStudent);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal Server error' });
    }
});
//update record ends here

// delete record from table
app.delete('/deletestudent/:id',async(req,res) =>{
    try{
        await Student.findByIdAndDelete(req.params.id);
        return res.json({message:'Student record deleted successfully'});
    }
    catch(err){
console.log(err.message);
res.status(500).json({error:'Internal Server error'});
    }
})

//above line of code is for student data handling

//below code is for handle user registration
// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = new User({ username, password });
        await newUser.save();
        return res.json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login route
app.get('/login', async (req, res) => {
    const { username, password } = req.query; // Assuming username and password are sent as query parameters

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            // User found, credentials are correct
            return res.json({ message: 'Login successful', user });
        } else {
            // User not found or credentials are incorrect
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});






//listening the application
app.listen(PORT,()=> {
    console.log(`Server is running port ${PORT}`);
});