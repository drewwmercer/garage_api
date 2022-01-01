const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override');
const app = express();
const wheel = String.fromCodePoint(0x1F697);

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
    make: 'Jeep'
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

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myGarage!');
// res.sendFile('./index.html', { root: __dirname });

//   console.error(err.stack);
//   res.status(500).send('Something broke!');
});

app.get('/documentation', (err, req, res, next) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });

  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/vehicles', (err, req, res, next) => {
  res.json(topVehicles);

  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () => {
  console.log(`The ${wheel} myGarage app is listening on port 8080.`);
});
