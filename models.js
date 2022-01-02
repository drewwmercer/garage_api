const mongoose = require('mongoose'), 
    bcrypt = require('bcrypt');

// Vehicle Schema
let vehicleSchema = mongoose.Schema({
    Nickname: {type: String, required:true},
    MainImage: String,
    Description: String,
    Year: {type: Date, required:true},
    Model: {type: String, required:true},
    Trim: {type: String, required:true},
    BodyType:{
        Name: String,
        Description: String
    },
    Make:{
        BrandName: String, 
        About: String,
        YearFounded: Date,
        YearEnded: Date
    },
    Maintenance: {
        Description: String,
    },
    Modifications: {
        Description: String,
    },
    Active: Boolean
});

// Owner Schema
let ownerSchema = mongoose.Schema({
    Ownername:{type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    DOB: Date, 
    Vehicles: 
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}]
});

//Hashing the owner's password
ownerSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
};

//Comparing against other previously hashed passwords 
ownerSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password)
};

let Vehicle = mongoose.model('Vehicle', vehicleSchema);

let Owner = mongoose.model('Owner', ownerSchema);

module.exports.Vehicle = Vehicle; 
module.exports.Owner = Owner;