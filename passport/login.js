var LocalStrategy   = require('passport-local').Strategy;
var userDBModel = require('../models/user');
var User = new userDBModel.Schema("user").model;
var crypt = require('./../utils/crypt');
var config = require('./../utils/config');
module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            User.findOne({ 'username' :  username }, 
                function(err, user) {
                    // In case of any error, return using the done method
                    if (err)
                        return done(err);
                    // Username does not exist, log the error and redirect back
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    // User exists but wrong password, log the error 
                    if (!isValidPassword(user, password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    // User and password both match, return user from done method
                    // which will be treated like success
                    console.log('valid password');
                    return done(null, user);
                }
            );

        })
    );


    let isValidPassword = function(user, password){
        if(!password){
            return false;
        }
        let pass = crypt.encryptAes(password,config.session_secret);
        return pass===user.password;
    }
    
};