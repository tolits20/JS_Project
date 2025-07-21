const express = require("express");
const router = express.Router();
const transactionController = require("../controller/transaction");
const authMiddleware = require("../middleware/auth");

// Apply auth middleware to all transaction routes

// Create new transaction/order from cart
router.post("/checkout",authMiddleware, transactionController.createTransaction);

// Get user's transaction history
router.get("/my-orders",authMiddleware, transactionController.getUserTransactions);

// Get single transaction details
router.get("/order/:id",authMiddleware, transactionController.getTransactionById);

// Update transaction status (for admin)
router.put("/order/:id/status",authMiddleware, transactionController.updateTransactionStatus);

// Cancel transaction (for user)
router.post("/order/:id/cancel",authMiddleware, transactionController.cancelTransaction);

// User updates their order (quantities, etc.)
router.put("/order/:id",authMiddleware, transactionController.updateUserOrder);

module.exports = router;
