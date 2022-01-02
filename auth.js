const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport.js');

let generateJWTToken = (owner) => {
    return jwt.sign(owner, jwtSecret,{
        subject: owner.Ownername,
        expiresIn: '7d',
        algorithm: 'HS256'});
    }

module.exports = (router) => {
router.use(passport.initialize());
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, owner, info) => {
        if (error || !owner) {
          return res.status(400).json({
            message: 'Something is not right',
            owner: owner
          });
        }
        req.login(owner, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(owner.toJSON());
          return res.json({ owner, token });
        });
      })(req, res);
    });
}