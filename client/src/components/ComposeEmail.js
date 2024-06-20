 // src/components/ComposeEmail.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';

const Form = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

function ComposeEmail({ user }) {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:31415/sendEmail', {
        to,
        subject,
        message,
      });
      alert('Email sent successfully!');
      setTo('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email.');
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Compose Email</Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          label="To"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Message"
          multiline
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          Send
        </Button>
      </Form>
    </Container>
  );
}

export default ComposeEmail;
