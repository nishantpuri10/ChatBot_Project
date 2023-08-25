const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db'); ////// database connection

///
const User = require('./models/User');

//////Middleware ////
app.use(express.json());

///////////--------USERS ROUTES------////////////////////

/////ROUTE-1//////
/////Create a user/////
app.post('/createuser', async (req, res) => {
    try {
      const { username, email } = req.body;

      const user = await User.create({ username, email });

      res.status(200).json(user);
    } catch (error) {
      
      res.status(404).json({ error: 'An error occurred while creating the user.' });
    }
  });

/////ROUTE-2//////
/////LIST ALL USERS//////
app.get('/listusers' ,async(req,res)=>{
    try {
        const listOfUsers = await User.findAll();
        res.status(200).json(listOfUsers);
    } catch (error) {
        res.status(404).json({error : 'error occured while viewing users'})
    }
})

//////ROUTE-3/////
/////LIST A SINGLE USER/////
app.get('/singleuser/:id' , async(req,res)=>{
    const userid = req.params.id;
    try {
        const singleUser = await User.findOne({where : { id: userid}})
        
        if(singleUser){
            res.json({singleUser});
        }
        else{
            res.json("user not found")
        }


    } catch (error) {
        res.status(404).json({error : 'User not found'})
    }
})
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
