const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');
const app = express();
const wheel = String.fromCodePoint(0x1F697);
const smoke = String.fromCodePoint(0x1F4A8);

app.use(morgan('common'));
app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

let topVehicles = [
  {
    nickname: '2020 Gladiator Rubicon - Firecracker Red',
    make: 'Jeep',
    year: '2020',
    model: 'Gladiator',
    trim: 'Rubicon',
    latestmilecount: 22222,
    latestmiledate: '01012022'
  },
  {
    nickname: '2009 Ninja 250R',
    make: 'Kawasaki'
  },
  {
    nickname: '2019 Slingshot SLR',
    make: 'Polaris'
  }
];

let starterOwners = [
    {
      ownername: 'firstDriver',
      password: 'test1pass',
      vehicles: {}
    },
    {
        ownername: 'secondDriver',
        password: 'test1pass'
    },
    {
        ownername: 'thirdDriver',
        password: 'test1pass'
    }
  ];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myGarage!');
});

app.get('/documentation', (err, req, res, next) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });

  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/vehicles', (req, res) => {
  res.json(topVehicles);
});

app.get('/owners', (req, res) => {
    res.json(starterOwners);
  });

// POST requests
app.post('/owners', (req, res) => {
    let newOwner = req.body;
  
    if (!newOwner.username) {
      const message = 'Missing "username" in request body';
      res.status(400).send(message);
    } else {
        newOwner.id = uuid.v4();
      owners.push(newOwner);
      res.status(201).send(newOwner);
    }
  });

// DELETE requests

// listen for requests
app.listen(8080, () => {
  console.log(`The ${wheel}${smoke} myGarage app is listening on port 8080.`);
});
