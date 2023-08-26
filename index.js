const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./db'); ////// database connection
const Chatbot = require('./models/Chatbot');
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const EndUser = require('./models/EndUser');



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


// ///////////////--------------------------CONVERSATIONS ROUTES---------------------------------////////////////////
  
// ////////ROUTE-1//////////////
// Create a new conversation
app.post('/chatbots/:chatbotId/conversations', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;
        const { endUserId, message } = req.body;

        // chatbot exists or not
        const chatbot = await Chatbot.findByPk(chatbotId);
        if (!chatbot) {
            return res.status(404).json({ error: 'Chatbot not found.' });
        }

        /// end user exists or not
        const endUser = await EndUser.findByPk(endUserId);
        if (!endUser) {
            return res.status(404).json({ error: 'End user not found.' });
        }

       
        const conversation = await Conversation.create({
            chatbotId,
            endUserId,
            message,
            status: 'active', 
        });

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error starting a new conversation:', error);
        res.status(500).json({ error: 'An error occurred while starting a new conversation.' });
    }
});

///////////ROUTE-2//////////////
// List conversations for a chatbot
app.get('/chatbots/:chatbotId/conversations', async (req, res) => {
    try {
        const chatbotId = req.params.chatbotId;

       
        const chatbot = await Chatbot.findByPk(chatbotId);
        if (!chatbot) {
            return res.status(404).json({ error: 'Chatbot not found.' });
        }

        
        const conversations = await Conversation.findAll({ where: { chatbotId } });
        res.status(200).json(conversations);
    } catch (error) {
        console.error('Error listing conversations:', error);
        res.status(500).json({ error: 'An error occurred while listing conversations.' });
    }
});

/////ROUTE-3////////
// Retrieve a single conversation
app.get('/conversations/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;

        
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error retrieving conversation:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the conversation.' });
    }
});

///////ROUTE-4///////////
// Update a conversation
app.put('/conversations/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        const { status } = req.body;

        
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

        
        conversation.status = status; // You can include other attributes as needed
        await conversation.save();

        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error updating conversation:', error);
        res.status(500).json({ error: 'An error occurred while updating the conversation.' });
    }
});

//////ROUTE-5//////////////
// Delete a conversation
app.delete('/conversations/:conversationId', async (req, res) => {
    try {
        const conversationId = req.params.conversationId;

        
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }

     
        await conversation.destroy();

        res.status(204).send(); 
    } catch (error) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'An error occurred while deleting the conversation.' });
    }
});


//////////////////-------------------END USER ROUTES-------------------------------/////////////////////////////

//////ROUTE-1/////////////////
// Register a new end user
app.post('/endusers', async (req, res) => {
    try {
        const { name, email } = req.body;

        const endUser = await EndUser.create({ name, email });

        res.status(201).json(endUser);
    } catch (error) {
        console.error('Error registering a new end user:', error);
        res.status(500).json({ error: 'An error occurred while registering a new end user.' });
    }
});

//////////ROUTE-2/////////////
// List all end users
app.get('/endusers', async (req, res) => {
    try {
        const endUsers = await EndUser.findAll();
        res.status(200).json(endUsers);
    } catch (error) {
        console.error('Error listing end users:', error);
        res.status(500).json({ error: 'An error occurred while listing end users.' });
    }
});

//////////ROUTE-3/////////////
// Retrieve details of a single end user
app.get('/endusers/:endUserId', async (req, res) => {
    try {
        const endUserId = req.params.endUserId;

        // Find the end user by their ID
        const endUser = await EndUser.findByPk(endUserId);
        if (!endUser) {
            return res.status(404).json({ error: 'End user not found.' });
        }

        res.status(200).json(endUser);
    } catch (error) {
        console.error('Error retrieving end user details:', error);
        res.status(500).json({ error: 'An error occurred while retrieving end user details.' });
    }
});

//////////ROUTE-4/////////////
// Update end user details
app.put('/endusers/:endUserId', async (req, res) => {
    try {
        const endUserId = req.params.endUserId;
        const { name, email } = req.body;

        // Find the end user by their ID
        const endUser = await EndUser.findByPk(endUserId);
        if (!endUser) {
            return res.status(404).json({ error: 'End user not found.' });
        }

        // Update end user attributes
        endUser.name = name;
        endUser.email = email;
        await endUser.save();

        res.status(200).json(endUser);
    } catch (error) {
        console.error('Error updating end user details:', error);
        res.status(500).json({ error: 'An error occurred while updating end user details.' });
    }
});
//////////ROUTE-5/////////////
// Delete an end user
app.delete('/endusers/:endUserId', async (req, res) => {
    try {
        const endUserId = req.params.endUserId;

        // Find the end user by their ID
        const endUser = await EndUser.findByPk(endUserId);
        if (!endUser) {
            return res.status(404).json({ error: 'End user not found.' });
        }

        // Delete the end user
        await endUser.destroy();

        res.status(204).send(); // No content
    } catch (error) {
        console.error('Error deleting end user:', error);
        res.status(500).json({ error: 'An error occurred while deleting the end user.' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
