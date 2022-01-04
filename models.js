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
        BodyName: String,
        Description: String
    },
    // Make: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Make' }],
    Make: [{ makeSchema }],
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

let makeSchema = mongoose.Schema({
    BrandName:{type: String, required: true},
    About: {type: String, required: true},
    YearFounded: Date, 
    YearEnded: Date
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
let Make = mongoose.model('Make', makeSchema)

module.exports.Vehicle = Vehicle; 
module.exports.Owner = Owner;
module.exports.Make = Make;