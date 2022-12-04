const User = require('../models/User');
const constants = require('../configs/constants/constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Web3 = require("web3");

const ERC20TransferABI = [
    {
        constant: false,
        inputs: [
            {
                name: "_to",
                type: "address",
            },
            {
                name: "_value",
                type: "uint256",
            },
        ],
        name: "transfer",
        outputs: [
            {
                name: "",
                type: "bool",
            },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "_owner",
                type: "address",
            },
        ],
        name: "balanceOf",
        outputs: [
            {
                name: "balance",
                type: "uint256",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [
            {
                name: "signature",
                type: "bytes",
            },
            {
                name: "hash",
                type: "bytes32",
            },
        ],
        name: "verifySingleSignOn",
        outputs: [
            {
                name: "email",
                type: "string",
            },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
]

const IDENTIFIER_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const authCtrl = {
    /**
     * dang ky tai khoan moi
     */
    register: async (req, res) => {
        const { fullname, age, email, password } = req.body;

        // required fields validation
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: 'Missing fullname, email and/or password' });
        }

        // check format email
        if (!String(email).toLowerCase().match(constants.emailRegex)) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        try {
            // check if existed user
            const user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ message: 'Email already existed.' });
            }

            // hash password and create new account
            const hashedPass = await bcrypt.hash(password, 11);
            const newUser = new User({
                fullname,
                age,
                email,
                password: hashedPass,
            });            
            await newUser.save();

            // new access token
            const accessToken = createAccessToken({ userId: newUser._id });

            res.status(200).json({
                message: 'Registered successfully.',
                accessToken,
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.Message });
        }
    },

    /**
     * dang nhap
     */
    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: 'Missing email and/or password!' });
        }

        try {
            // check if existed account
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Incorrect email or password' });
            }

            const checkPassword = await bcrypt.compare(password, user.password);

            if (!checkPassword) {
                return res.status(401).json({ message: 'Incorrect email or password' });
            }

            // access token and refresh token
            const accessToken = createAccessToken({ userId: user._id });
            const refreshToken = createRefreshToken({ userId: user._id });

            await user.save();

            res.status(200).json({
                message: 'Login successfully.',
                fullname: user.fullname,
                email: user.email,
                age: user.age,
                accessToken,
                refreshToken,
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.Message });
        }
    },

    loginWithMetamask: async (req, res) => {
        const { hash, signature } = req.body;

        try {
            const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
            const contract = new web3.eth.Contract(ERC20TransferABI, IDENTIFIER_ADDRESS);
            contract.methods.verifySingleSignOn(signature, hash).call(async function (err, email) {
                // check if existed account

                console.log(email);
                let user = await User.findOne({email});

                if (!user) {
                    return res.status(401).json({message: 'Incorrect email or password'});
                }

                // access token and refresh token
                const accessToken = createAccessToken({userId: user._id});
                const refreshToken = createRefreshToken({userId: user._id});

                await user.save();

                res.status(200).json({
                    message: 'Login successfully.',
                    fullname: user.fullname,
                    email: user.email,
                    age: user.age,
                    accessToken,
                    refreshToken,
                });
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.Message });
        }
    },

    /**
     * dang xuat
     */
    logout: async (req, res) => {
        try {
            const user = await User.findOne({ _id: req.userId });
            user.refreshToken = null;
            user.save();

            res.status(200).json({ message: 'Logout successfully.' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.Message });
        }
    },

    /**
     * tao access token
     */
    generateAccessToken: async (req, res) => {
        try {
            const {refreshToken} = req.body;

            if (!refreshToken) {
                return res.status(401).json({message: 'Refresh token not found.'});
            }

            let user = await User.findOne({refreshToken});

            if (!user) {
                return res.status(403).json({message: 'Refresh token invalid.'});
            }

            // access token and refresh token
            const accessToken = createAccessToken({ userId: user._id });
            const newRefreshToken = createRefreshToken({ userId: user._id });

            user.refreshToken = newRefreshToken;
            await user.save();

            res.status(200).json({
                message: 'Get new token successfully',
                accessToken,
                newRefreshToken,
            });
        } catch (error) {
            console.log(err);
            res.status(500).json({ message: err.Message });
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