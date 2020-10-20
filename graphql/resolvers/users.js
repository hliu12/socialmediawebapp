const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
)

const { SECRET_KEY } = require('../../config.js');
const User = require('../../models/User');

module.exports = {
    Mutation: {
        /* the _ will normally contain a parent parameter since resolvers
           often bounce off of each other and thus the parent will hold
           the parent resolver. In this case we do not have a parent
           and "_" is just a placeholder. It is necessary to access args
        */
        async register(
            _, 
            { 
                registerInput: { username, email, password, confirmPassword }
            },
        ) {
            // TODO: Validate user data
            // TODO: Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }

            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            // Creates the User object
            const newuser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newuser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, {expiresIn: '1h'});

            return {
                ...res._doc,
                id: res.id,
                token
            }

        }

    }
}