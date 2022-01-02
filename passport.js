const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models = require ('./models.js'),
    passportJWT = require('passport-jwt');

let Owners = Models.Owner, 
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

 passport.use(new LocalStrategy({
     usernameField: 'Ownername',
     passwordField: 'Password'},
     (ownername, password, callback) => {
         console.log(ownername + '' + password);
         Owners.findOne({Ownername: ownername},(error, owner) =>
         {if (error){
             console.log(error);
             return callback(error);     
         }
            if (!owner){
                console.log('incorrect ownername');
                return callback (null, false, {message:'Incorrect ownername or password.'});
            }

        if(!owner.validatePassword(password)){
            console.log('incorrect password');
            return callback(null, false, {message: 'Incorrect password.'})
        }
            console.log('finished');
            return callback(null,owner);
         });
     }));   

     passport.use(new JWTStrategy({
         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
         secretOrKey: 'your_jwt_secret'},(jwtPayLoad, callback) => {
             return Owners.findById(jwtPayLoad._id).then((owner) => {
                 return callback(null,owner);
             })
             .catch ((error) => {
                 return callback(error)
             });
     }));