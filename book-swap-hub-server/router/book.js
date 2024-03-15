const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book-controller');

router.post('/new', bookController.createNewBook);
router.get('/all', bookController.getAllBooks)
router.get('/:id', bookController.getBook)
router.get("/:id/read", bookController.readBook)
module.exports = router;
