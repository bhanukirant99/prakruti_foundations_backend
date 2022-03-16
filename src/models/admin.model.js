const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    role: {
        type: String,
        enum: roles,
        default: 'admin',
    },
    isEmailVerified: {
        type: Boolean,
        default: true,
    },
    createdCourse: { //an array of course ids
        type: Array,
        default: []
    },
    likedCourses: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
});

// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The admin's email
 * @param {ObjectId} [excludeadminId] - The id of the admin to be excluded
 * @returns {Promise<boolean>}
 */
adminSchema.statics.isEmailTaken = async function(email, excludeadminId) {
    const admin = await this.findOne({ email, _id: { $ne: excludeadminId } });
    return !!admin;
};

/**
 * Check if password matches the admin's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
adminSchema.methods.isPasswordMatch = async function(password) {
    const admin = this;
    return bcrypt.compare(password, admin.password);
};

adminSchema.pre('save', async function(next) {
    const admin = this;
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

/**
 * @typedef admin
 */
const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;