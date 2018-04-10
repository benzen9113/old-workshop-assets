const path = require('path');
const express = require('express');
const app = express();

app.listen(process.env.PORT || 5000);

// static files
app.use('/static', express.static(path.join(__dirname, 'static')));
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

// REST API
const Contact = require('./contact');
const jsonBodyParser = require('body-parser').json();

app.get('/contacts', (req,res) => {
  let items;
  if (req.query.search && req.query.search.trim() != '') {
    let keyword = req.query.search.trim();
    items = Contact.find(c => {
      return c.name.indexOf(keyword) !== -1
      || c.phone.indexOf(keyword) !== -1
      || c.email.indexOf(keyword) !== -1
    });
  } else {
    items = Contact.find();
  }
  res.json(items);
});

app.get('/contacts/:id', (req,res) => {
  res.json(Contact.findById(req.params.id));
});

app.put('/contacts/:id', jsonBodyParser, (req,res) => {
  let item = Contact.findById(req.params.id);
  res.json(item.update(req.body));
});

app.post('/contacts', jsonBodyParser, (req,res) => {
  res.json(Contact.create(req.body));
});

app.delete('/contacts/:id', (req,res) => {
  let item = Contact.findById(req.params.id);
  item.delete();
  res.end();
});

app.use((err,req,res,next) => {
  console.error(err);
  res.status(err.code || 500).json({
    code: err.code || 500,
    message: err.message || 'Unexpected Error',
    fields: err.fields || null,
  });
});