const User = require("../models/User");
const Message = require("../models/Message");

const { Op } = require("sequelize");

// exports.fetchMessage = async (req, res) => {
//     const messages = await Message.findAll({
//         include: { model: User, attributes: ["name"] },
//         order: [["createdAt", "ASC"]],
//     });
//     res.json(messages);
// };

exports.fetchMessage = async (req, res) => {
    try {
        const after = req.query.after;

        const whereClause = after
            ? { createdAt: { [Op.gt]: new Date(after) } }
            : {};

        const messages = await Message.findAll({
            where: whereClause,
            include: { model: User, attributes: ["name"] },
            order: [["createdAt", "ASC"]],
        });

        res.json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.addMessage = async (req, res) => {
    console.log(req.body);
    const message = await Message.create({
        message: req.body.message,
        userId: req.user.id,
    });
    res.status(201).json(message);
};
