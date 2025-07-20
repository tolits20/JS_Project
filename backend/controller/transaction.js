const connection = require("../config/database");

// Create new transaction/order from cart
exports.createTransaction = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.data; // From JWT token

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cart is empty",
    });
  }

  try {
    // Start transaction
    await connection.beginTransaction();

    // Create order
    const orderQuery =
      "INSERT INTO orders (user_id, order_status, order_placed) VALUES (?, 'pending', NOW())";
    const [orderResult] = await connection.query(orderQuery, [userId]);
    const orderId = orderResult.insertId;

    // Create order lines
    let totalAmount = 0;
    for (const item of cartItems) {
      const orderLineQuery =
        "INSERT INTO orderlines (order_id, item_id, qty, order_price) VALUES (?, ?, ?, ?)";
      const itemTotal = item.item_price * item.quantity;
      totalAmount += itemTotal;

      await connection.query(orderLineQuery, [
        orderId,
        item.item_id,
        item.quantity,
        itemTotal,
      ]);

      // Update stock quantity
      const updateStockQuery =
        "UPDATE stocks SET qty = qty - ? WHERE item_id = ?";
      await connection.query(updateStockQuery, [item.quantity, item.item_id]);
    }

    // Commit transaction
    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order_id: orderId,
        total_amount: totalAmount,
        items_count: cartItems.length,
      },
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error("Transaction creation error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get user's transaction history
exports.getUserTransactions = async (req, res) => {
  const userId = req.user.data;

  try {
    const query = `
      SELECT 
        o.order_id,
        o.order_status,
        o.order_placed,
        COUNT(ol.orderline_id) as items_count,
        SUM(ol.order_price) as total_amount
      FROM orders o
      LEFT JOIN orderlines ol ON o.order_id = ol.order_id
      WHERE o.user_id = ?
      GROUP BY o.order_id
      ORDER BY o.order_placed DESC
    `;

    const [result] = await connection.query(query, [userId]);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
    });
  }
};

// Get single transaction details
exports.getTransactionById = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.data;

  try {
    // Get order details
    const orderQuery = `
      SELECT 
        o.order_id,
        o.order_status,
        o.order_placed,
        u.name as customer_name,
        u.email as customer_email
      FROM orders o
      LEFT JOIN user u ON o.user_id = u.user_id
      WHERE o.order_id = ? AND o.user_id = ?
    `;

    const [orderResult] = await connection.query(orderQuery, [orderId, userId]);

    if (orderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Get order items
    const itemsQuery = `
      SELECT 
        ol.orderline_id,
        ol.qty,
        ol.order_price,
        i.item_name,
        i.item_img
      FROM orderlines ol
      LEFT JOIN items i ON ol.item_id = i.item_id
      WHERE ol.order_id = ?
    `;

    const [itemsResult] = await connection.query(itemsQuery, [orderId]);

    const order = orderResult[0];
    order.items = itemsResult;
    order.total_amount = itemsResult.reduce(
      (sum, item) => sum + item.order_price,
      0
    );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch transaction",
    });
  }
};

// Update transaction status (for admin)
exports.updateTransactionStatus = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const { order_status } = req.body;

  const validStatuses = [
    "pending",
    "shipped",
    "cancelled",
    "refunded",
    "delivered",
  ];

  if (!validStatuses.includes(order_status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  try {
    const query = "UPDATE orders SET order_status = ? WHERE order_id = ?";
    const [result] = await connection.query(query, [order_status, orderId]);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// Cancel transaction (for user)
exports.cancelTransaction = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.data;
  const { reason } = req.body;

  try {
    // Start transaction
    await connection.beginTransaction();

    // Check if order belongs to user and is cancellable
    const checkQuery =
      "SELECT order_status FROM orders WHERE order_id = ? AND user_id = ?";
    const [checkResult] = await connection.query(checkQuery, [orderId, userId]);

    if (checkResult.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (checkResult[0].order_status !== "pending") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    // Get all orderlines for this order
    const [orderlines] = await connection.query(
      "SELECT item_id, qty FROM orderlines WHERE order_id = ?",
      [orderId]
    );

    // Restore stock for each item
    for (const line of orderlines) {
      await connection.query(
        "UPDATE stocks SET qty = qty + ? WHERE item_id = ?",
        [line.qty, line.item_id]
      );
    }

    // Cancel order
    const updateQuery =
      "UPDATE orders SET order_status = 'cancelled' WHERE order_id = ?";
    const [result] = await connection.query(updateQuery, [orderId]);

    if (result.affectedRows > 0) {
      await connection.commit();
      return res.status(200).json({
        success: true,
        message: "Order cancelled successfully, stock restored",
        data: {
          reason: reason || "No reason provided",
        },
      });
    } else {
      await connection.rollback();
      return res.status(500).json({
        success: false,
        message: "Failed to cancel order",
      });
    }
  } catch (error) {
    await connection.rollback();
    console.error("Error cancelling transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cancel order",
    });
  }
};

// Update user order (quantities, etc.)
exports.updateUserOrder = async (req, res) => {
  const orderId = parseInt(req.params.id);
  const userId = req.user.data;
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: "Invalid items data",
    });
  }

  try {
    // Start transaction
    await connection.beginTransaction();

    // Check if order belongs to user and is editable
    const checkQuery =
      "SELECT order_status FROM orders WHERE order_id = ? AND user_id = ?";
    const [checkResult] = await connection.query(checkQuery, [orderId, userId]);

    if (checkResult.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (checkResult[0].order_status !== "pending") {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Order cannot be modified",
      });
    }

    let totalAmount = 0;

    // Update each order line
    for (const item of items) {
      const { orderline_id, qty } = item;

      // Get current order line details
      const getOrderLineQuery = `
        SELECT ol.qty as current_qty, ol.item_id, i.item_price
        FROM orderlines ol
        LEFT JOIN items i ON ol.item_id = i.item_id
        WHERE ol.orderline_id = ? AND ol.order_id = ?
      `;
      const [orderLineResult] = await connection.query(getOrderLineQuery, [
        orderline_id,
        orderId,
      ]);

      if (orderLineResult.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: "Order line not found",
        });
      }

      const currentQty = orderLineResult[0].current_qty;
      const itemId = orderLineResult[0].item_id;
      const itemPrice = orderLineResult[0].item_price;
      const qtyDifference = qty - currentQty;

      // Update order line
      const updateOrderLineQuery = `
        UPDATE orderlines 
        SET qty = ?, order_price = ? 
        WHERE orderline_id = ?
      `;
      const newOrderPrice = itemPrice * qty;
      await connection.query(updateOrderLineQuery, [
        qty,
        newOrderPrice,
        orderline_id,
      ]);

      // Update stock (add back old quantity, subtract new quantity)
      const updateStockQuery = `
        UPDATE stocks 
        SET qty = qty + ? - ? 
        WHERE item_id = ?
      `;
      await connection.query(updateStockQuery, [currentQty, qty, itemId]);

      totalAmount += newOrderPrice;
    }

    // Commit transaction
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: {
        order_id: orderId,
        total_amount: totalAmount,
        items_updated: items.length,
      },
    });
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error("Error updating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message,
    });
  }
};
