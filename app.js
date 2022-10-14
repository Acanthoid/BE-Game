const express = require("express");
const app = express();
const {getCategories, findReviewById, getUsers, changeVotes, getGroupedReviews, getCommentsByReviewId, postCommentByReviewId, deleteComment, getEndpoints} = require('./api/controllers/controller');
app.use(express.json()); 
const {internalErrorHandling, customErrorHandling, PSQLErrorHandling} = require('./api/controllers/error_handling')

//Returns endpoints.json OR WILL
app.get("/api", getEndpoints);

//returns catagories data
app.get("/api/categories", getCategories);

//returns all reviews from either a single category or all reviews
app.get("/api/reviews", getGroupedReviews)

//returns specified review
app.get("/api/reviews/:review_id", findReviewById);

//changes votes and returns review with changed votes
app.patch("/api/reviews/:review_id", changeVotes)

//returns all comments related to review_id
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)

//adds comment to db and returns the comment
app.post("/api/reviews/:review_id/comments", postCommentByReviewId)

//returns user data
app.get("/api/users", getUsers)

//deletes given comment and returns 204
app.delete("/api/comments/:comment_id", deleteComment)

//Errors
//errors for specific PSQL codes
app.use(PSQLErrorHandling)

//errors that are defined in code
app.use(customErrorHandling)

//catch all for code/server failure
app.use(internalErrorHandling)
module.exports = app;