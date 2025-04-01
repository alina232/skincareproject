const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    UserID: { type: String, unique: true },
    Firstname: String,
    Lastname: String,
    Email: { type: String, unique: true },
    Password: String, // Hash before storing
    Address: String,
    Contact: String
});

//auto generate userID before saving user
userSchema.pre("save", async function(next){
    //check if userID already assigned
    if(!this.UserID){
        try{
            //get the last userID
            const lastUser = await mongoose.model("User").findOne().sort({ UserID: -1});
            let newId = "UID1"; //default userID
            if(lastUser && lastUser.UserID){
                //getting the last numeric part of number
                let lastIdNumber = parseInt(lastUser.UserID.replace("UID", "")) || 0;
                //increase the number and format to start 
                newId = `UID${lastIdNumber + 1}`;
            }
            this.UserID = newId; //assign new userID
            next(); //proceed to saving the user
        }catch(error){
            next(error);
        }
    } else {
        next();
    }
});

module.exports = mongoose.model('User', userSchema);
