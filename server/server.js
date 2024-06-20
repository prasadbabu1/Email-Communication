const express = require("express")
const session = require("express-session")
const passport = require('passport')
const dotenv = require("dotenv")
const path = require("path")
const cors = require('cors')
const { default: mongoose } = require("mongoose")

dotenv.config()
const PORT = process.env.PORT
const MONGO_URL =process.env.MONGO_URL
const CLIENT_ID ="16876064151-ahne517rodcshvsi124bcvhjpatm00ec.apps.googleusercontent.com"
const CLIENT_SECRET="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"

// const postmark = require("./postmark")



const app = express()
// const postmarkApiKey = 'e528b4b8-f9eb-48b8-bba4-6d4f4ba71b07';

// const postmarkApiToken = '33ae9911-613b-41c0-b6bf-2ef79c9e2b0c'
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow sending cookies with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow the HTTP methods you need
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow headers you need to send
}));
app.use(
    session({
      secret: process.env.secret,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

require('./authecation')
 mongoose.connect(MONGO_URL).then(()=>{
    console.log("Connect to DB")
 })

 

 app.get('/auth/google',
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
  ));
  
  app.get( '/auth/google/callback',
      passport.authenticate( 'google', {
          successRedirect: '/pro',
          failureRedirect: '/failed'
  }));
  app.get("/pro",(req,res)=>{
    user = req.user
   // console.log(user ,"pro route")

res.redirect('http://localhost:3000/profile')
})



// const Email = require('../models/Email');



const POSTMARK_API_KEY = '6398ac53-6505-498f-8638-f7fd981e2c3b';
const POSTMARK_API_URL = 'https://api.postmarkapp.com';

app.get('/communication-details', async (req, res) => {
  try {
    const listUrl = `${POSTMARK_API_URL}/messages/outbound`;
    const params = {
      count: 10, 
      offset: 0,  
    };

    const headers = {
      'Accept': 'application/json',
      'X-Postmark-Server-Token': POSTMARK_API_KEY,
    };

    // Fetch list of recent outbound messages
    const response = await axios.get(listUrl, { params, headers });

    if (response.status === 200) {
      try {
        if (Array.isArray(response.data)) {
          const messageIds = response.data.map(message => message.MessageID);
          const emailsDetailsPromises = messageIds.map(async messageId => {
            if (!messageId) {
              throw new Error('Invalid messageId encountered');
            }
            const detailsUrl = `${POSTMARK_API_URL}/messages/outbound/${messageId}/details`;
            const detailsResponse = await axios.get(detailsUrl, { headers });
            
            return detailsResponse.data;
          });
          
          const emailsDetails = await Promise.all(emailsDetailsPromises);
          res.status(200).json(emailsDetails);
        } else {
          const messagesArray = Object.keys(response.data).map(key => ({ [key]: response.data[key] }));

          console.log(response.data, 'response data')
          console.log(messagesArray, 'messagesArray')
          
          const messageIds = messagesArray[1].Messages.map(message => message.MessageID).filter(String);


          console.log(messageIds, 'messageIds')
          
          const validMessageIds = messageIds.filter(messageId => !!messageId);
  
  if (validMessageIds.length === 0) {
    throw new Error('No valid messageIds found');
  }
          
          const emailsDetailsPromises = validMessageIds.map(async messageId => {
            if (!messageId) {
              throw new Error('Invalid messageId encountered');
            }
            const detailsUrl = `${POSTMARK_API_URL}/messages/outbound/${messageId}/details`;
            const detailsResponse = await axios.get(detailsUrl, { headers });
            
            return detailsResponse.data;
          });
          
      
          const emailsDetails = await Promise.all(emailsDetailsPromises);
          res.status(200).json(emailsDetails);
        }
        
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
      }
      
    } else {
      console.error('Error fetching outbound messages:', response.status, response.statusText);
      res.status(response.status).send('Error fetching outbound messages');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server error');
  }
});

app.post('/sendEmail', async (req, res) => {
  try {
    console.log("hello",req.body)
    const { to, subject,message } = req.body;
    console.log(to,subject,body)
    const response = await axios.post(`${POSTMARK_API_URL}/email`, {
      From: '20n31a12c5@mrcd.ac.in',
      To: to,
      Subject: subject,
      TextBody: message, 
    }, {
      headers: {
        'X-Postmark-Server-Token': POSTMARK_API_KEY,
        'Accept': 'application/json',
    'Content-Type': 'application/json',
      }
    });

    console.log('Email sent:', response.data);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Endpoint to view communication history
app.get('/history', async (req, res) => {
    try {
        const emails = await Email.find();
        res.json(emails);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Endpoint to send an email
app.post('/send', async (req, res) => {
    const { sender, recipient, subject, message } = req.body;

    try {
        // Send email via Postmark
        await client.sendEmail({
            "From": sender,
            "To": recipient,
            "Subject": subject,
            "TextBody": message
        });

        // Record email in the database
        const email = new Email({ sender, recipient, subject, message });
        await email.save();

        res.status(200).send('Email sent and recorded successfully');
    } catch (error) {
        res.status(500).send(error);
    }
});

// app.get('/api/communication-history', async (req, res) => {
//     try {
//       const userId = req.query.userId;
//       const communicationHistory = await communicationHistoryCollection.find({ userId }).toArray();
//       res.json(communicationHistory);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to retrieve communication history' });
//     }
//   });

//   app.post('/api/send-email', async (req, res) => {
//     try {
//       const { from, to, subject, body } = req.body;
//       const postmarkClient = new postmark.Client(postmarkApiKey, postmarkApiToken);
//       const response = await postmarkClient.sendEmail({
//         From: from,
//         To: to,
//         Subject: subject,
//         HtmlBody: body,
//       });

//       console.log(response)

//       // Record communication history
//       const communicationHistory = {
//         userId: req.body.userId,
//         type: 'ent',
//         from,
//         to,
//         subject,
//         body,
//         timestamp: new Date(),
//       };
//       await communicationHistoryCollection.insertOne(communicationHistory);

//       res.json({ message: 'Email sent successfully' });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to send email' });
//     }
//   });


// app.use(userRouter)
app.listen(PORT,()=>{
    console.log(`listening to port ${PORT}`)
})