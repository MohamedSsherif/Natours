const crypto = require('crypto');
const moongose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs'); 
//name, email, photo, password, passwordConfirm

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']

    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide your password'],
        minlength: [8, 'A password must have more or equal than 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
})

//Document middleware: runs before .save() and .create()  (between recieve data and save it to database)
userSchema.pre('save', async function (next) {
    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();
    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save',function(next){
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000; //1000ms before the token is issued
    next();
})

userSchema.pre(/^find/,function(next){
    //this points to the current query
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        //console.log(changedTimestamp,JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    //false means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto
    .randomBytes(32)
    .toString('hex');

    //console.log(resetToken);

    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    //console.log({resetToken},this.passwordResetToken);
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = moongose.model('User', userSchema);

module.exports = User;