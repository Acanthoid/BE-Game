const {acquireCategories, locateReviewById, acquireUsers, alterVotes, acquireGroupedReviews, acquireCommentsByReviewId, addCommentByReviewId, removeComment} = require("../models/model.js");
const endpoints = require("../../endpoints.json");

//controller for GET API
exports.getEndpoints = (req, res, next) => {
        res.status(200).send(endpoints);
}

//controller for GET api/catagories
exports.getCategories = (req, res, next) => {
    acquireCategories().then((categories) => {
        res.status(200).send({categories});
    }).catch((err) => {
        next(err);
    });
};

//controller for GET api/reviews/:review_id
exports.findReviewById = (req, res, next) => {
    locateReviewById(req.params.review_id).then((review) => {
        res.status(200).send(review);
    }).catch((err) => {
        next(err);
    });
};

//controller for GET api/users
exports.getUsers = (req, res, next) => {
    acquireUsers().then((users) => {
        res.status(200).send({users});
    }).catch((err) => {
        next(err);
    });
};

//controller for GET api/reviews
exports.getGroupedReviews = (req, res, next) => {
    acquireGroupedReviews(req.query)
    .then((reviews) => {
        res.status(200).send(reviews);
    })
    .catch((err) => {
        next(err);
    });
};

//controller for Get api/reviews/:review_id/comments
exports.getCommentsByReviewId = (req, res, next) => {
    const id = req.params.review_id;
    acquireCommentsByReviewId(id)
    .then((review) => {
        res.status(200).send(review);
    })
    .catch((err) => {
        next(err);
    })
}

//controller for api/reviews/:review_id/comments
exports.postCommentByReviewId = (req, res, next) => {
    const id = req.params.review_id;
    addCommentByReviewId(id, req.body)
    .then((comment) => {
        res.status(201).send(comment)
    })
    .catch((err) => {
        next(err);
    });
};

//controller for PATCH api/reviews/:review_id
exports.changeVotes = (req, res, next) => {
    alterVotes(req.params.review_id, req.body).then((review) => {
        res.status(200).send(review);
    }).catch((err) => {
        next(err);
    });
};

//controller for delete comment
exports.deleteComment = (req, res, next) => {
    const comment_id = req.params.comment_id;
    removeComment(comment_id).then((returnedId) => {
        if(returnedId == comment_id){
            res.status(204).send();
        }
    }).catch((err) => {
        next(err);
    });
};