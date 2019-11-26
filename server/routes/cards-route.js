const router = require('express').Router();
const Card = require('../models/Card');

/**
 * URL: localhost:5001/api/Cards/
 * Response: array of all card documents
 */
router.get('/', (req, res, next) => {
  Card.find()
    .then(cards => res.status(200).json({ cards: cards }))
    .catch(err => res.status(400).json('Error: ' + err));
});

/**
 * URL: localhost:5001/api/cards/seed
 * Description: Used to give database some test data.
 */
router.post('/seed', async (req, res, next) => {
  for (let i = 0; i < 5; i++) {
    const newCard = new Card({
      cardNumber: i,
      title: `This is card ${i}`,
      list: [
        `item 1 for card ${i}`,
        `item 2 for card ${i}`,
        `item 3 for card ${i}`
      ]
    });
    await newCard.save();
  }
  res.send(
    'Run GET after this to see if the thoughts got seeded successfully  '
  );
});

router.put('/removeListItem/:cardId/:listItem', (req, res) => {
  Card.findById(req.params.cardId, (error, doc) => {
    if (error) res.send('error', 500);
    else {
      doc.list.splice(req.params.listItem, 1);
      doc.save(err => {
        if (err) {
          console.log('mc error', error);
          res.send('mc error', 500);
        } else {
          res.send('doc: ' + doc);
        }
      });
    }
  });
});

/**
 * URL: localhost:5001/api/Cards/add
 * Description: Used to add single card
 */
router.route('/add').post((req, res) => {
  const { title, cardNumber, list } = req.body;
  const newCard = new Card({ title, cardNumber, list });
  newCard
    .save()
    .then(() => res.json('Card added!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

//DELETE ALL CARDS
router.delete('/', (req, res, next) => {
  Card.deleteMany({}, err => {
    if (err) next(err);
    else res.send('Succesfully deleted all cards');
  });
});

module.exports = router;
