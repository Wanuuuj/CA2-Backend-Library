const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/books');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/library')
  .then(() => console.log('connected to db'))
  .catch(err => console.log('error connecting', err));

app.listen(3000, () => console.log('server started on 3000'));


app.post('/api/books', async (req, res) => {
  const data = req.body;

  if (!data.title) {
    return res.status(400).send({ msg: 'title is required' });
  }

  try {
    const book = new Book({
      title: data.title,
      author: data.author,
      category: data.category
    });
    await book.save();
    res.status(201).send(book);
  } catch (e) {
    res.status(500).send({ msg: 'something went wrong' });
  }
});

app.patch('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  const status = req.body.availability;

  try {
    const book = await Book.findByIdAndUpdate(id, { availability: status }, { new: true });

    if (!book) {
      return res.status(404).send({ msg: 'book not found' });
    }

    res.send(book);
  } catch (e) {
    res.status(500).send({ msg: 'error updating book' });
  }
});

