const mongoose = require('mongoose') // mongo db with guardrails

 
const userSchema  = new mongoose.Schema({ // blueprint
    name : { 
        type : String, 
        require : true
    },
    gmail : { 
        type : String,
        require : true , 
        unique : true

    },
    pass : { 
        type : String, 
        require:true
    }

},{timestamps:true} );

const user = mongoose.model('user' , userSchema); // user 

module.exports = user; // when root ask for it we can give it that by using this 

