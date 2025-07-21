const express = require("express");
const route = express.Router();
const isAuth = require("../middleware/auth");
const review = require("../controller/review");

// Public route - get all reviews for an item
route.get("/item-reviews", review.getReviews);

route.get("/reviews/my", isAuth, review.getMyReview);
route.get("/orders/can_review", isAuth, review.canReview);
route.post("/reviews", isAuth, review.createReview);
route.put("/reviews/:id", isAuth, review.updateReview);

module.exports = route;
