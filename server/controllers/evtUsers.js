/*eslint-env node */

var EventUser = require('mongoose').model('EventUser');
var encrypt = require('../utils/encrypt');

// exports.getUsers = function(req,res) {
//     User.find({}).exec(function(err, collection) {
//         res.send(collection);
//     });
// };

exports.createUser = function(req,res,next) {
	var userData = req.body;

	userData.salt = encrypt.createSalt();
	userData.hashed_pwd = encrypt.hashPass(userData.salt, userData.password);
	EventUser.create(userData, function(error, user) {
		if(error) {
			if(error.toString().indexOf('E11000') > -1) {
				error = new Error('Email already in use');
			}
			res.status(400);
			return res.send({excuse: error.toString()});
		}

		req.logIn(user, function(error) {
			if(error) {return next(error);}
			res.send(user);
		});
	});
};

// exports.updateUser = function(res, req) {
//     var userUpdates = req.body;
//
//     if(req.user._id != userUpdates._id && !req.user.hasRole('admin')) {
//         res.status(403);
//         return res.end();
//     }
//
//     req.user.firstName = userUpdates.firstName;
//     req.user.lastName = userUpdates.lastName;
//     req.user.username = userUpdates.username;
//     if(userUpdates.password && userUpdates.password.length > 0) {
//         req.user.salt = encrypt.createSalt();
//         req.user.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
//     }
//     req.user.save(function(err) {
//         if(err) {res.status(400); return res.send();}
//
//         res.send(req.user);
//     });
// };