const express = require("express");
const route = express.Router();
const isAuth = require("../middleware/auth");
const review = require("../controller/review");

// Public route - get all reviews for an item
route.get("/item-reviews/:id", review.getReviews);

route.get("/reviews/my", isAuth, review.getMyReview);
route.get("/orders/can_review", isAuth, review.canReview);
route.post("/reviews", isAuth, review.createReview);
route.put("/reviews/:id", isAuth, review.updateReview);


route.get("/reviews",(req,res)=>{
    return res.status(200).json("reached")
})
module.exports = route;
