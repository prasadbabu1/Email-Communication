 // src/components/CommunicationHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container } from '@mui/material';

const initialEmails = [
  {
    id: 1,
    subject: 'Welcome to our service!',
    body: 'We are excited to have you on board. Let us know if you have any questions.',
    timestamp: '2024-06-01 10:00',
    to: 'user@example.com',
    type: 'received',
  },
  {
    id: 2,
    subject: 'Your recent purchase',
    body: 'Thank you for your purchase. Your order will be shipped soon.',
    timestamp: '2024-06-02 15:30',
    to: 'user@example.com',
    type: 'received',
  },
  {
    id: 3,
    subject: 'Question about your product',
    body: 'Can you provide more details about the product?',
    timestamp: '2024-06-03 09:45',
    to: 'support@example.com',
    type: 'sent',
  },
];

function CommunicationHistory({ userId }) {
  const [emails, setEmails] = useState(initialEmails);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await axios.get(`/api/emails?userId=${userId}`);
        setEmails(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userId) {
      fetchEmails();
    }
  }, [userId]);

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Communication History</Typography>
      <List>
        {emails.map(email => (
          <ListItem key={email.id} alignItems="flex-start">
            <ListItemText
              primary={email.subject}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {email.type === 'sent' ? 'Sent to' : 'Received from'}: {email.to}
                  </Typography>
                  <br />
                  {email.body}
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    {email.timestamp}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default CommunicationHistory;
