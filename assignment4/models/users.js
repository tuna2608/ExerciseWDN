var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
    firstname: {
      type: String
    },
    lastname: {
      type: String
    },
    admin:   {
      type: Boolean,
      require: true,
      default: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);