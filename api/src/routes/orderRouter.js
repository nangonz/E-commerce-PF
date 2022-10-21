const { Router } = require("express");
const { getOrders, getOrdersByEmail, getOrdersById, postOrder, updateOrder } = require("../controllers/ordersController");
const login = require("../middlewares/login.js");
const admin = require("../middlewares/admin.js");

const orderRouter = Router();

orderRouter.get("/", login, admin, getOrders);

orderRouter.get("/id/:id", /* login, admin, */ getOrdersById);

orderRouter.get("/email/:email", login, getOrdersByEmail);

orderRouter.post("/", /* login, */ postOrder);

orderRouter.put("/:id", login, admin, updateOrder);

module.exports = orderRouter;
