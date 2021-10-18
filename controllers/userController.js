const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models');

const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post('/register', async (req, res) => {
    const { username, passwordhash } = req.body;
    //: bcrypt.hashSync(password, 100
    const pw = await bcrypt.hash(passwordhash, 10)
    console.log(pw)
    try {
        const newUser = await UserModel.create({
            username, passwordhash: pw

        });

        console.log(newUser)
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24

        });
        res.status(201).json({
            message: "new user created",
            user: newUser,
            token
        })

    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(402).json({
                message: "This email has already in use in our database :C"
            });
        } else {
            res.status(500).json({
                error: `Failed to compelte registration for user: ${err}`
            });
        }
    }
})
router.post('/login', async (req, res) => {
    const { username, passwordhash } = req.body;
    try {
        const loginUser = await UserModel.findOne({
            where: { username: username }
        });

        if (loginUser) {
            let passwordComparison = await bcrypt.compare(passwordhash, loginUser.passwordhash);

            if (passwordComparison) {
                let token = jwt.sign({ id: loginUser }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "You have successfully logged in.",
                    token
                });
            } else {
                res.status(401).json({
                    message: 'There was an error logging in'
                });
            }
        } else {
            res.status(401).json({
                message: 'Wrong email or password'
            })
        }
    } catch (err) {
        res.status(500).json({
            message: 'Wrong email or password'
        });
    };
});



module.exports = router;
























