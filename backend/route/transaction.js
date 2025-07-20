const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction");
const authMiddleware = require("../middleware/auth");

// Apply auth middleware to all transaction routes
router.use(authMiddleware);

// Create new transaction/order from cart
router.post("/checkout", transactionController.createTransaction);

// Get user's transaction history
router.get("/my-orders", transactionController.getUserTransactions);

// Get single transaction details
router.get("/order/:id", transactionController.getTransactionById);

// Update transaction status (for admin)
router.put("/order/:id/status", transactionController.updateTransactionStatus);

// Cancel transaction (for user)
router.post("/order/:id/cancel", transactionController.cancelTransaction);

module.exports = router;
