const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

//workout document
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//static method for signup
userSchema.statics.signup = async function (username, email, password) {

    //validation
    if (!username || !email || !password){
        throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)){
        throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)){
        throw Error("Password not strong enough");
    }

    const existsEmail = await this.findOne({ email });
    const existsUsername = await this.findOne({ username });

    //validation for already used
    if (existsEmail){
        throw Error("Email already in use");
    }
    if (existsUsername){
        throw Error("Username already exists");
    }

    const salt = await bycrypt.genSalt(10);
    const hash = await bycrypt.hash(password, salt);

    const user = await this.create({ username, email, password: hash});

    return user;
}

//static login method
userSchema.statics.login = async function( email, password) {
    
    if (!email || !password){
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user){
        throw Error("Incorrect Email");
    }
    
    const match = await bycrypt.compare(password, user.password);

    if (!match){
        throw Error("Incorrect password");
    }

    return user;
}

module.exports = mongoose.model("User", userSchema);
