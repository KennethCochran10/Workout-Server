const router = require('express').Router();

let validateJWT = require("../middleware/validate-jwt");

const { woModel } = require('../models')


router.post('/', validateJWT, async (req, res) => {
    const { id } = req.user;

    const { description, definition, result } =
        req.body;
    try {
        const wolog = await woModel.create({
            description,
            definition,
            result,
            owner_id: id
        })
        res.status(201).json({
            message: "Your post was successful",
            wolog

        });
    } catch (err) {
        res.status(500).json({
            message: `Log failed: ${err}`
        })
    }


})


router.get("/", validateJWT, async (req, res) => {
    try {
        const { id } = req.user;

        const allwo = await woModel.findAll({
            where: { owner_id: parseInt(id) }
        });

        res.status(200).json(allwo);

    } catch (err) {
        res.status(500).json({ error: err })
    }

})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const allwo = await woModel.findAll({
            where: { id: id }
        });





        res.status(200).json(allwo);
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.put("/:id", validateJWT, async (req, res) => {
    console.log(req.params)
    const { description, definition, result } = req.body;
    const id2 = req.params.id;

    const owner_id = req.user.id



    const query = {
        where: {
            id: id2,
            owner_id: owner_id
        }
    };
    const updatedwolog = {
        description: description,
        definition: definition,
        result: result
    };
    try {
        const update = await woModel.update(updatedwolog, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

router.delete("/:id", validateJWT, async (req, res) => {
    const id2 = req.params.id;

    const owner_id = req.user.id

    try {
        const query = {
            where: {
                id: id2,
                owner_id: owner_id
            }
        };

        await woModel.destroy(query);
        res.status(200).json({ message: 'journal entry removed' });

    } catch (err) {
        res.status(500).json({ error: err });
    }
})

module.exports = router;



