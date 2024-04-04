const {Schema,model} = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
   fullName:{
    type : String,
    required : true,
    minlength: 3,
    maxlength: 50,

   },
   email: {
    type : String,
    required : true,
    unique : true,
    match: /^\S+@\S+\.\S+$/,
   },
   salt :{
    type : String,
   },
   password: {
    type : String,
    required : true,
    minlength: 6,
   },
   profilePic: {
    type: String,
    default: '/Media/Images/User Profile.png', 
},
role:{
    type : String,
    enum : ["USER","ADMIN"],
    default : "USER",
}
},{timestamps:true});

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
            this.salt = salt;
        }
        next();
    } catch (error) {
        next(error);
    }
});

const User = model('user',userSchema);

module.exports = User;
