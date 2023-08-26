const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db'); ////// database connection
const Chatbot = require('./models/Chatbot');
const User = require('./models/User');


//////Middleware ////
app.use(express.json());

///////////-----------------------USERS ROUTES-------------------------------////////////////////

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

////ROUTE-4//////
/////UPDATE USER//////

app.put('/updateuser/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = req.body; 
  
       const update = await User.update(updatedUser, {
        where: { id: userId },
        returning: true, 
      });
  
   res.status(200).json(update); 
      
    } catch (error) {
      
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  });

////ROUTE-5///////
////DELETE USER//////
app.delete('/deleteuser/:id' , async(req,res)=>{
    try {
        const userid = req.params.id;
        const deleteUser = await User.destroy({ where : {id : userid}});

        res.status(200).json(deleteUser);
    } catch (error) {
        res.status(404).json("error occured while deleted");
    }
})
  

/////////////////////--------------------------CHATBOT ROUTES -------------------------------------//////////////

///////ROUTE - 1 ////////////////
//////Create ChatBot///////////////
app.post('/createchatbot/:userId/', async (req, res) => {
    try {
      const userId = req.params.userId;
      const { name, description } = req.body;
  
      // if the user exists or not
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
  
      // Create chatbot wrt user
      const chatbot = await Chatbot.create({ name, description, UserId: userId });
  
      res.status(201).json(chatbot);
    } catch (error) {
      
      res.status(500).json({ error: 'An error occurred while creating the chatbot.' });
    }
  });

//////ROUTE-2///////////////
/////List Chatbots wrt Userid //////////

app.get('/listchatbots/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        ///if the user exists or not
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // list chatbots
        const chatbots = await Chatbot.findAll({ where: { UserId: userId } });
        res.status(200).json(chatbots);

    } catch (error) {
        console.error('Error retrieving chatbots:', error);
        res.status(500).json({ error: 'An error occurred while retrieving chatbots.' });
    }
});


///////ROUTE - 3 ////////////////
/////Retrieve a single chatbot/////
app.get('/chatbots/:chatbotId', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;

        // Find the chatbot by its ID
        const chatbot = await Chatbot.findByPk(chatbotId);

        if (!chatbot) {
            return res.status(404).json({ error: 'Chatbot not found.' });
        }

        res.status(200).json(chatbot);
    } catch (error) {
        console.error('Error retrieving chatbot:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the chatbot.' });
    }
});

///////ROUTE - 4 ////////////////
/////Update a chatbot/////
app.put('/chatbots/:chatbotId', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;
        const { name, description } = req.body;

        // Find the chatbot by its ID
        const chatbot = await Chatbot.findByPk(chatbotId);

        if (!chatbot) {
            return res.status(404).json({ error: 'Chatbot not found.' });
        }

        // Update the chatbot's attributes
        chatbot.name = name;
        chatbot.description = description;
        await chatbot.save();

        res.status(200).json(chatbot);
    } catch (error) {
        console.error('Error updating chatbot:', error);
        res.status(500).json({ error: 'An error occurred while updating the chatbot.' });
    }
});

///////ROUTE - 5 ////////////////
/////Delete a chatbot/////
app.delete('/chatbots/:chatbotId', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;

        // Find the chatbot by its ID
        const chatbot = await Chatbot.findByPk(chatbotId);

        if (!chatbot) {
            return res.status(404).json({ error: 'Chatbot not found.' });
        }

        // Delete the chatbot
        await chatbot.destroy();

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting chatbot:', error);
        res.status(500).json({ error: 'An error occurred while deleting the chatbot.' });
    }
});


///////////////--------------------------CONVERSATIONS ROUTES---------------------------------////////////////////
  
////////ROUTE-1//////////////
//////Start a new conversation for a chatbot///////////


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
