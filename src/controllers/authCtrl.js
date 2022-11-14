const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authCtrl = {
    /**
     * dang ky tai khoan moi
     */
    register: async (req, res) => {
        try {
            // TODO: something...
        } catch (error) {
            // TODO: something...
        }
    },

    /**
     * dang nhap
     */
    login: async (req, res) => {
        try {
            // TODO: something...
        } catch (error) {
            // TODO: something...
        }
    },

    /**
     * dang xuat
     */
    logout: async (req, res) => {
        try {
            // TODO: something...
        } catch (error) {
            // TODO: something...
        }
    },

    /**
     * tao access token
     */
    generateAccessToken: async (req, res) => {
        try {
            // TODO: something...
        } catch (error) {
            // TODO: something...
        }
    },
};

/**
 * tao access token
 */
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });
};

/**
 * tao refresh token
 */
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = authCtrl;