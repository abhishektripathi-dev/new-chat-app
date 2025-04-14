const express = require("express");
const cors = require("cors");

// Models and Database
const sequelize = require("./config/database");
const User = require("./models/User");
const Message = require("./models/Message");

// Routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", chatRoutes);

// Association
User.hasMany(Message, { foreignKey: "userId", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "userId" });

sequelize
    .sync({ force: false })
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((err) => {
        console.error("Error syncing database:", err);
    });
