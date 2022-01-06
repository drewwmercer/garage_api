const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

// mongoose.connect('mongodb://localhost:27017/myGarage',{useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const wheel = String.fromCodePoint(0x1F697),
    smoke = String.fromCodePoint(0x1F4A8);

const Vehicles = Models.Vehicle;
const Owners = Models.Owner;
const Makes = Models.Make;

const { check, validationResult } = require('express-validator');

const cors = require('cors');
app.use(cors());

let auth = require('./auth.js')(app);
const passport = require('passport');
require('./passport.js');

app.use(morgan('common'));
app.use(express.static('public'));

app.use(methodOverride());

// GET requests
// Main sanity check to make sure app is responding
app.get('/', (req, res) => {
    res.send('Welcome to myGarage!');
});

// API documentation resource
app.get('/documentation', (err, req, res, next) => {
    res.sendFile('public/documentation.html', { root: __dirname });

    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Get a list of all vehicles
app.get('/vehicles', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Vehicles.find()
            .then((vehicles) => {
                res.status(201).json(vehicles);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            });
    });

// Gets a list of all owners
app.get('/owners', (req, res) => {
    Owners.find()
        .then((owners) => {
            res.status(201).json(owners);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets the data about a single owner, by ownername
app.get('/owners/:name', (req, res) => {
    res.json(starterOwners.find((owner) => { return owner.ownername === req.params.name }));
});

// Gets the list of cars from a single make, by brandname
app.get('/vehicles/make/:make', passport.authenticate('jwt',{ session: false }), (req, res) => {
    Vehicles.find({'Make.BrandName': req.params.make})
    .then((brandName) =>{
        res.json(brandName);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });  
});

// Gets details for a single make, by brandname
app.get('/makes/:make', passport.authenticate('jwt',{ session: false }), (req, res) => {
    Makes.findOne({'BrandName': req.params.make})
    .then((brandName) =>{
        res.json(brandName);
    })
    .catch((err) =>{
        console.error(err);
        res.status(500).send('Error: ' + err);
    });  
});

// POST requests
// Add a new owner
app.post('/owners', [
    check('Ownername', 'Ownername is required').isLength({ min: 4 }),
    check('Ownername', 'Ownername cannot contain non alphanumeric characters.').isAlphanumeric(),
    check('Password', 'Password is required.').not().isEmpty(),
    check('Email', 'Email does not appear to be valid.').isEmail()
],
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }
        let hashedPassword = Owners.hashPassword(req.body.Password);
        Owners.findOne({ Ownername: req.body.Ownername }).then(
            (owner) => {
                if (owner) {
                    return res.status(400).send(req.body.Ownername + ' already exists');
                } else {
                    Owners.create({
                        Ownername: req.body.Ownername,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        DOB: req.body.DOB
                    })
                    .then((owner) => { res.status(201).json(owner) }
                    ).catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
    })

// Add a new vehicle
app.post('/vehicles', [
    // check('Ownername', 'Ownername is required').isLength({min:4}),
    // check('Ownername', 'Ownername cannot contain non alphanumeric characters.').isAlphanumeric(),
    // check('Password', 'Password is required.').not().isEmpty(),
    // check('Email', 'Email does not appear to be valid.').isEmail()
],
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }
        // let hashedPassword = Owners.hashPassword(req.body.Password);
        Vehicles.findOne({ Nickname: req.body.Nickname }).then(
            (vehicle) => {
                if (vehicle) {
                    return res.status(400).send(req.body.Nickname + ' already exists');
                } else {
                    Vehicles.create({
                        Nickname: req.body.Nickname,
                        Description: req.body.Description,
                        Year: req.body.Year,
                        Model: req.body.Model,
                        Trim: req.body.Trim,
                        BodyType: {
                            Name: req.body.BodyType.BodyName,
                            Description: req.body.BodyType.Description
                        },
                        Make: {
                            BrandName: req.body.Make.BrandName
                        },
                        Modifications: {
                            Description: req.body.Modifications.Description,
                        },
                        Active: req.body.Active
                    })
                    .then((vehicle) => { res.status(201).json(vehicle) }
                    ).catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    })
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
    })

// Assign a vehicle to an owner  
app.post('/owners/:ownername/:vehicleid', passport.authenticate('jwt', { session: false }), (req, res) => {
    Owners.findOneAndUpdate({ Ownername: req.params.ownername }, {
        $push: { Vehicles: req.params.vehicleid }
    },
        { new: true },
        (err, owner) => {
            if (err) {
                res.status(400).send('Owner not found.')
            } else {
                res.status(200).json(owner);
            }
        });
});

// DELETE requests
// Deleting an owner
app.delete('/owners/:Ownername', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Owners.findOneAndRemove({ Ownername: req.params.Ownername })
            .then((owner) => {
                if (!owner) {
                    res.status(400).send(req.params.Ownername + ' was not found.');
                } else {
                    res.status(200).send(req.params.Ownername + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            }
            )
    });

// Deleting a vehicle
app.delete('/vehicles/:Nickname', passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Vehicles.findOneAndRemove({ Nickname: req.params.Nickname })
            .then((vehicle) => {
                if (!vehicle) {
                    res.status(400).send(req.params.Nickname + ' was not found.');
                } else {
                    res.status(200).send(req.params.Nickname + ' was deleted.');
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Error: ' + err);
            }
            )
    });    

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log(`The ${wheel}${smoke} myGarage app is listening on Port ${port}.`);
});