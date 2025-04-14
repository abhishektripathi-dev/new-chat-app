const User = require("../models/User");
const Message = require("../models/Message");

exports.fetchMessage = async (req, res) => {
    const messages = await Message.findAll({
        include: { model: User, attributes: ["name"] },
        order: [["createdAt", "ASC"]],
    });
    res.json(messages);
};

exports.addMessage = async (req, res) => {
    console.log(req.body);
    const message = await Message.create({
        message: req.body.message,
        userId: req.user.id,
    });
    res.status(201).json(message);
};
