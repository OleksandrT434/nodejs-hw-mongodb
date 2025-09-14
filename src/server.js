import express from 'express';
import { getAllContacts } from './services/contacts.js';
import { getContactById } from './services/contacts.js';

const app = express();

app.set('json spaces', 2);

const PORT = 3000;

app.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts ,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get('/contacts/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data:  contact ,
      });
  } catch (error) {
    console.log(error);
  };
});

export function setupServer() {
app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
});


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
}