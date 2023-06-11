const { User, Thought } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought associated with this ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId},
                { $set: req.body },
                { runValidators: true, new: true }
                );

                if (!thought) {
                    return res.status(404).json({ message: 'No thought associated with this ID' });
                }
                res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
        },

        async deleteThought(req, res) {
            try {
                const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

                if (!thought) {
                    return res.status(404).json({ message: 'No thought associated with this ID' });
                }
                res.json({ message: 'Thought successfully deleted' });
            } catch (err) {
                res.status(500).json(err);
            }
        },

        async createReaction(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
                    { $addToSet: { reactions: req.body } },
                    { new: true })
                    .populate({ path: 'reactions', select: '-__v' })
                    .select('-__v')

                    if (!thought) {
                        return res.status(404).json({ message: 'No thought associated with this ID' });
                    }

                    res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
        },

        async deleteReaction(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
                    { $pull: {reactions: { _id: req.params.reactionId }}},
                    { runValidators: true, new: true })

                if (!thought) {
                    return res.status(404).json({ message: 'Invalid thought and/or reaction ID' });
                }

                res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
        }
};