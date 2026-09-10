const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    
    isOnboardingComplete: {
        type: Boolean,
        default: false
    },
    professionalStatus: {
        type: String,
        default: ''
    },
    college: {
        type: String,
        default: ''
    },
    graduationYear: {
        type: Number,
        default: null
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationOTP: String,
    emailVerificationOTPExpires: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpires: Date,
    
    platformVerificationCode: String,

    lumaScore: {
        type: Number,
        default: 0
    },
    visibility: {
        type: String,
        enum: ['Public', 'Private'],
        default: 'Public'
    },

    playlists: [
        {
            name: { type: String, required: true },
            savedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        }
    ],

    connectedAccounts: {
        leetcode: {
            username: { type: String, default: '' },
            verified: { type: Boolean, default: false },
            stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        },
        codeforces: {
            username: { type: String, default: '' },
            verified: { type: Boolean, default: false },
            stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        },
        codechef: {
            username: { type: String, default: '' },
            verified: { type: Boolean, default: false },
            stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        },
        geeksforgeeks: {
            username: { type: String, default: '' },
            verified: { type: Boolean, default: false },
            stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        },
        github: {
            username: { type: String, default: '' },
            verified: { type: Boolean, default: false },
            stats: { type: mongoose.Schema.Types.Mixed, default: {} }
        }
    }
}, {
    timestamps: true,
    minimize: false
});

userSchema.pre('save', function() {
    if (!this.isModified('password')) {
        return; 
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
