const db = require("../../db/connection");



//requests all category data from db and returns it to controller
exports.acquireCategories = () => {
    return db.query(`SELECT * FROM categories;`).then(({rows}) => {
        return rows;
    });
};

//requests and returns data held under review_id 
exports.locateReviewById = (id) => {
    return db.query(`SELECT reviews.*, COUNT(comments.review_id) :: INT AS comment_count FROM reviews LEFT JOIN 
    comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`, [id]).then ((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Review not found'})
        }
        return result.rows[0];
    });
};

//all users data
exports.acquireUsers = () => {
    return db.query(`SELECT * FROM users;`).then(({rows}) => {
        return rows;
    });
};


//groups of review and query / automatic sorting
exports.acquireGroupedReviews = (category) => {
    const sortBy = category.sort;
    const order = category.order;
    if(order !== undefined && order !== 'DESC' && order !== 'ASC'){
        return Promise.reject({status: 400, msg: 'invalid input- Please choose either "ASC" or "DESC"'})
    }
    let initialQuery = `SELECT reviews.*, COUNT(comments.review_id) ::INT AS comment_count 
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id`;
        let query = [];
        if (category.category !== undefined) {
            query.push(category.category);
            initialQuery += ` WHERE category = $1`;
        }
        initialQuery += ` GROUP BY reviews.review_id`
        if (sortBy !== undefined) {
            initialQuery += ` ORDER BY ${sortBy}`;
        } else {
            initialQuery += ` ORDER BY created_at`;
        }
        if (order !== undefined) {
            initialQuery += ` ${order};`;
        } else {
            initialQuery += ` DESC;`
        }
        return db.query(initialQuery, query).then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: 'Review not found'})
            };
            return rows;
    });
};

//all comments linked to review_id
exports.acquireCommentsByReviewId = (id) => {
    return db
    .query(`SELECT * FROM comments WHERE comments.review_id = $1 ORDER BY created_at ASC`, [id]).then(({ rows }) => {
        const comments = rows;
        if (!comments[0]) {
            return Promise.reject({status: 404, msg: `There are no reviews for review_id:${id}`,
            });
        } 
        return comments;

    });
};

//adds a comment for a specific review_id
exports.addCommentByReviewId = (id, commentPackage) => {
    const body = commentPackage.body;
    const author = commentPackage.username;
    return db.query(`INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`, [body, author, id]).then((review) => {
        if(!review.rows[0]){
            return Promise.reject({status: 404, msg: 'Review not found'})
        }
        return review.rows;
    });
};

//changes the votes by entered amount
exports.alterVotes = (id, changedVotes) => {
    return db.query(`UPDATE reviews SET votes = votes + $2 WHERE review_id =$1 RETURNING *;`, [id, changedVotes.inc_votes]).then ((result) => {
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: 'Review not found'})
        }
        return result.rows;
    });
};

//delete comment using comment_id
exports.removeComment = (id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING*;`, [id]).then ((out) => {
        if(out.rows.length > 0) {
            const deleted = out.rows[0].comment_id;
            return deleted;
        }
        return Promise.reject({status: 404, msg: 'Comment not found'})
    })
}