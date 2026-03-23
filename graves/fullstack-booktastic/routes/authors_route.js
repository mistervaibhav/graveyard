const express = require('express');
const router = express.Router();
const Author = require('../models/author_model');

// * All Authors Route
router.get('/', async (req, res) => {
  let searchOptions = {};

  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  try {
    authors = await Author.find(searchOptions);
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query,
    });
  } catch (error) {
    res.render('authors/index', { error });
  }
});

// * new Author  Route
router.get('/new', (req, res) => {
  const author = new Author();

  res.render('authors/new', { author });
});

// * indie Author  Route
router.get('/:id', (req, res) => {
  res.send('successfully created');
});

// * Handling author creation
router.post('/new', async (req, res) => {
  try {
    const author = new Author({
      name: req.body.name,
    });

    await author.save();
    console.log({ author });
    res.redirect(`/authors/${author._id}`);
  } catch (error) {
    console.log({ error });
    res.render('authors/new', { error });
  }
});

module.exports = router;

// router.get('/', async (req, res) => {
//   let searchOptions = {};
//   if (req.query.name != null && req.query.name !== '') {
//     searchOptions.name = new RegExp(req.query.name, 'i');
//   }
//   try {
//     const authors = await Author.find(searchOptions);
//     res.render('authors/index', {
//       authors: authors,
//       searchOptions: req.query
//     });
//   } catch {
//     res.redirect('/');
//   }
// });

// // New Author Route
// router.get('/new', (req, res) => {
//   res.render('authors/new', { author: new Author() });
// });

// // Create Author Route
// router.post('/', async (req, res) => {
//   const author = new Author({
//     name: req.body.name
//   });
//   try {
//     const newAuthor = await author.save();
//     // res.redirect(`authors/${newAuthor.id}`)
//     res.redirect(`authors`);
//   } catch {
//     res.render('authors/new', {
//       author: author,
//       errorMessage: 'Error creating Author'
//     });
//   }
// });
