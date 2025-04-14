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

exports.getMessage = async (req, res) => {
    try {
        const lastMessageId = parseInt(req.query.lastMessageId);

        const whereClause = !isNaN(lastMessageId)
            ? { id: { [Op.gt]: lastMessageId } }
            : {};

        const messages = await Message.findAll({
            where: whereClause,
            include: { model: User, attributes: ["name"] },
            order: [["id", "ASC"]],
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
