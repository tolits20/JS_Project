const connection = require("../config/database");

// Get all reviews for an item
exports.getReviews = async (req, res) => {
  try {
    const item_id = parseInt(req.params.id);
    console.log(item_id)
    if (!item_id) return res.status(400).json("Missing item_id");

    const [rows] = await connection.query(
      `SELECT r.*, u.name as user_name FROM reviews r
       JOIN user u ON r.user_id = u.user_id
       WHERE r.item_id = ? ORDER BY r.created_at DESC`,
      [item_id]
    );

    console.log("Reviews found:", rows.length);
    return res.status(200).json({ data: rows });
  } catch (error) {
    console.error("Error getting reviews:", error);
    return res.status(500).json("something went wrong on the server");
  }
};

// Get the current user's review for an item
exports.getMyReview = async (req, res) => {
  try {
    const item_id = req.query.item_id;
    const user_id = req.user.data; // From JWT token

    if (!item_id) return res.status(400).json("Missing item_id");

    const [rows] = await connection.query(
      `SELECT * FROM reviews WHERE item_id = ? AND user_id = ?`,
      [item_id, user_id]
    );

    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("Error getting my review:", error);
    return res.status(500).json("something went wrong on the server");
  }
};

// Check if user can review (has shipped order for this item)
exports.canReview = async (req, res) => {
  try {
    const item_id = req.query.item_id;
    const user_id = req.user.data; // From JWT token

    if (!item_id) return res.status(400).json("Missing item_id");

    const [rows] = await connection.query(
      `SELECT o.* FROM orders o
       JOIN orderlines ol ON o.order_id = ol.order_id
       WHERE o.user_id = ? AND ol.item_id = ? AND o.order_status = 'shipped'`,
      [user_id, item_id]
    );

    return res.status(200).json({ can_review: rows.length > 0 });
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return res.status(500).json("something went wrong on the server");
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const user_id = req.user.data; // From JWT token
    const { item_id, rating, comment } = req.body;

    if (!item_id || !rating) return res.status(400).json("Missing fields");

    // Check if user already has a review for this item
    const [existing] = await connection.query(
      `SELECT * FROM reviews WHERE user_id = ? AND item_id = ?`,
      [user_id, item_id]
    );

    if (existing.length > 0) {
      return res.status(400).json("You have already reviewed this item");
    }

    await connection.query(
      `INSERT INTO reviews (user_id, item_id, rating, comment) VALUES (?, ?, ?, ?)`,
      [user_id, item_id, rating, comment]
    );

    return res.status(201).json("successful");
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json("something went wrong on the server");
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const user_id = req.user.data; // From JWT token
    const review_id = req.params.id;
    const { rating, comment } = req.body;

    const [result] = await connection.query(
      `UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND user_id = ?`,
      [rating, comment, review_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json("Review not found or unauthorized");
    }

    return res.status(200).json("successful");
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json("something went wrong on the server");
  }
};
