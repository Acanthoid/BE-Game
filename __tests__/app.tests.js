const request = require("supertest");
const app = require("../api/app");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));


/* USED TO TEST api, KEEP FOR NOW
describe("Test basic API function", () => {
	test("Test the status 200 and message GET /api", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then((res) => {
			expect(JSON.parse(res.text)).toEqual({ msg: "API is functional" });
			});
	});*/

//requests 'catagories' from db and checks that descriptions and slugs correspond to expected data
describe("get categories from database", () => {
	test("GET api/categories returns data contained in categories", () => {
    return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
            const { categories } = body;
            expect(categories).toBeInstanceOf(Object);
            categories.forEach((category) => {
                expect(category).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                });
            });
        });
    });

    //error handling
    test("GET api/Katagoriys  - returns 404 error message when given incorrect spelling", () => {
        return request(app)
        .get("/api/Katagoriys")
        .expect(404)
    });
});

//tests that api uses param entered to locate and return a review
describe("get given review from database with 0 comments", () => {
	test("GET api/reviews/:review_id", () => {
        return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(body  => {
            const chosenReview = body._body;
            expect(chosenReview).toBeInstanceOf(Object);
            expect(chosenReview).toEqual(
                {"category": "euro game",
                "created_at": "2021-01-18T10:00:20.514Z", 
                "designer": "Uwe Rosenberg", 
                "owner": "mallionaire", 
                "review_body": "Farmyard fun!", 
                "review_id": 1, 
                "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png", 
                "title": "Agricola", 
                "votes": 1,
                "comment_count": 0}
            );
        });
    });
    //review not found
    test("GET api/reviews/88888  - returns 404 error message when given a bad review number  ", () => {
        return request(app)
        .get("/api/reviews/88888")
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Review not found')
        })
    });

    //incorrect input type
    test("GET api/reviews/thatOneThatIWrote  - returns 400 error message when given incorrect input type  ", () => {
        return request(app)
        .get("/api/reviews/thatOneThatIWrote")
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input type')
        })
    });

    //retrieve reviews with comment and innumerate <<<
    test("GET api/reviews/:review_id with comments", () => {
        return request(app)
        .get("/api/reviews/3")
        .expect(200)
        .then(body  => {
            const chosenReview = body._body;
            expect(chosenReview).toBeInstanceOf(Object);
            expect(chosenReview).toEqual(
                {"category": "social deduction",
                "created_at": "2021-01-18T10:01:41.251Z",
                "designer": "Akihisa Okui",
                "owner": "bainesface",
                "review_body": "We couldn't find the werewolf!",
                "review_id": 3,
                "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                "title": "Ultimate Werewolf",
                "votes": 5,
                "comment_count": 3}
            );
        });
    });
});

//requests 'users' from db and checks username, name and avatar_url
describe("get user data from database", () => {
	test("GET api/users returns data required", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            expect(body.users.length).toEqual(4);
            expect(
                body.users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            avatar_url: expect.any(String),
                            name: expect.any(String),
                            username: expect.any(String),
                        })
                    );
                })
            );
        });
    });

    //bad input
    test("GET api/yousers  - returns 404 error message when given incorrect spelling", () => {
        return request(app)
        .get("/api/yousers")
        .expect(404)
    });
});

//requests alters votes on db and returns altered review
describe("PATCH specific review to increase votes", () => {
	test("PATCH /api/reviews/1 returns data required", () => {
    const votes = { inc_votes: 10};
    return request(app)
        .patch("/api/reviews/1")
        .send(votes)
        .expect(200)
        .then(({body}) => {
            expect(body.length).toEqual(1);
            expect(body[0]).toEqual(
                {"category": "euro game",
                "created_at": "2021-01-18T10:00:20.514Z", 
                "designer": "Uwe Rosenberg", 
                "owner": "mallionaire", 
                "review_body": "Farmyard fun!", 
                "review_id": 1, 
                "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png", 
                "title": "Agricola", 
                "votes": 11}
            );
        });
    });

    //bad input
    test("PATCH api/reviews/800800  - returns 404 error message when given bad review number", () => {
        const votes = { inc_votes: 10};
        return request(app)
        .patch("/api/reviews/800800")
        .send(votes)
        .expect(404)
    });

    //still functions for negative values
    test("PATCH /api/reviews/1 returns data required when handed result < 0 ", () => {
        const votes = { inc_votes: -1000};
        return request(app)
        .patch("/api/reviews/1")
        .send(votes)
        .expect(200)
        .then(({body}) => {
            expect(body.length).toEqual(1);
            expect(body[0]).toEqual(
                {"category": "euro game",
                "created_at": "2021-01-18T10:00:20.514Z", 
                "designer": "Uwe Rosenberg", 
                "owner": "mallionaire", 
                "review_body": "Farmyard fun!", 
                "review_id": 1, 
                "review_img_url": "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png", 
                "title": "Agricola", 
                "votes": -999}
            );
        });
    });

    //returns error message when handed non-number
    test("PATCH /api/reviews/1  inc_votes value cannot accept a non number as a value", () => {
        const votes = { inc_votes: 'I hated this film'};
        return request(app)
        .patch("/api/reviews/1")
        .send(votes)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid input type')
        });
    });
});

//tests that api uses query to locate and return a set of reviews
describe("get all reviews from a requested category or default to all reviews total", () => {
	test("GET api/reviews returns all reviews", () => {
        return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({body})  => {
            expect(body.length).toBe(13)
            body.forEach((review) => {
                expect(review).toMatchObject({
                    "category": expect.any(String),
                    "created_at": expect.any(String), 
                    "designer": expect.any(String), 
                    "owner": expect.any(String), 
                    "review_body": expect.any(String), 
                    "review_id": expect.any(Number), 
                    "review_img_url": expect.any(String), 
                    "title": expect.any(String), 
                    "votes": expect.any(Number),
                    "comment_count": expect.any(Number)
                });
            });
        });
    });

    test("GET api/reviews returns all reviews in query category", () => {
        return request(app)
        .get("/api/reviews/?category=social deduction")
        .expect(200)
        .then(({body})  => {
            expect(body.length).toBe(11)
            body.forEach((review) => {
                expect(review).toMatchObject({
                    "category": expect.any(String),
                    "created_at": expect.any(String), 
                    "designer": expect.any(String), 
                    "owner": expect.any(String), 
                    "review_body": expect.any(String), 
                    "review_id": expect.any(Number), 
                    "review_img_url": expect.any(String), 
                    "title": expect.any(String), 
                    "votes": expect.any(Number),
                    "comment_count": expect.any(Number)
                });
            });
        });
    });

    test("PATCH api/reviews?category=800800whoop  - returns 404 error message when given bad review number", () => {
        const votes = { inc_votes: 10};
        return request(app)
        .patch("/api/reviews/800800?category=800800whoop ")
        .send(votes)
        .expect(404)
    });
});

//tests that api returns all comments for review_id
describe("get all comments from review  or default to all reviews total", () => {
	test("GET api/reviews/3/comments returns all comments for review_id-3", () => {
        return request(app)
        .get("/api/reviews/3/comments")
        .expect(200)
        .then(({body})  => {
            expect(body.length).toBe(3)
            body.forEach((review) => {
                expect(review).toMatchObject({
                    "created_at": expect.any(String), 
                    "author": expect.any(String), 
                    "review_id": expect.any(Number),
                    "body": expect.any(String), 
                    "votes": expect.any(Number),
                    "comment_id": expect.any(Number)
                });
            });
        });
    });

    test("GET api/reviews/1/comments returns 404 as it has no reviews", () => {
        return request(app)
        .get("/api/reviews/1/comments")
        .expect(404)
        .then(({body})  => {
        expect(body.msg).toBe('There are no reviews for review_id:1')
        });
    });

    test("GET api/reviews/IWONTTHECOMMENTSOVDATFILM/comments returns 400", () => {
        return request(app)
        .get("/api/reviews/IWONTTHECOMMENTSOVDATFILM/comments")
        .expect(400)
        .then(({body})  => {
        expect(body.msg).toBe('Invalid input type')
        });
    });
});

describe("post new comment into comments and return the posted comment", () => {
	test("GET api/reviews/2/comments creates and returns new comment", () => {
        const bodyIn = {username: "dav3rid", body: `On the whole I found the review 
        to be enjoyable while reading with my police officer friends under an assumed 
        identity. Could have used more low effort references to Seth Rogan coming of 
        age comedies.`};
        return request(app)
        .post("/api/reviews/2/comments")
        .send(bodyIn)
        .expect(201)
        .then(({body})  => {
            expect(body.length).toBe(1)
            expect(body[0]).toMatchObject({
                "created_at": expect.any(String), 
                "author": expect.any(String), 
                "review_id": expect.any(Number),
                "body": expect.any(String), 
                "votes": expect.any(Number),
                "comment_id": expect.any(Number)
            });
        });
    }); 

    test("GET api/reviews/892928/comments creates and returns 400 for bad review number", () => {
        const bodyIn = {username: "dav3rid", body: `On the whole I found the review 
        to be enjoyable while reading with my police officer friends under an assumed 
        identity. Could have used more low effort references to Seth Rogan coming of 
        age comedies.`};
        return request(app)
        .post("/api/reviews/892928/comments")
        .send(bodyIn)
        .expect(404)
    }); 
});

describe("get all reviews using queries to sort", () => {
    test("GET api/reviews returns all reviews sorted by query group in ascending order", () => {
        return request(app)
        .get("/api/reviews/?sort=votes&&order=ASC")
        .expect(200)
        .then(({body})  => {
            expect(body.length).toBe(13);
            expect(body[0].votes).toBe(1);
            expect(body[12].votes).toBe(100);
            expect(body[9].votes).toBe(10);
            body.forEach((review) => {
                expect(review).toMatchObject({
                    "category": expect.any(String),
                    "created_at": expect.any(String), 
                    "designer": expect.any(String), 
                    "owner": expect.any(String), 
                    "review_body": expect.any(String), 
                    "review_id": expect.any(Number), 
                    "review_img_url": expect.any(String), 
                    "title": expect.any(String), 
                    "votes": expect.any(Number),
                    "comment_count": expect.any(Number)
                });
            });
        });
    });

    test.only("GET api/reviews returns all reviews sorted by query group in descending order", () => {
        return request(app)
        .get("/api/reviews/?sort=votes&&order=DESC")
        .expect(200)
        .then(({body})  => {
            expect(body.length).toBe(13);
            expect(body[0].votes).toBe(100);
            expect(body[12].votes).toBe(1);
            expect(body[9].votes).toBe(5);
            body.forEach((review) => {
                expect(review).toMatchObject({
                    "category": expect.any(String),
                    "created_at": expect.any(String), 
                    "designer": expect.any(String), 
                    "owner": expect.any(String), 
                    "review_body": expect.any(String), 
                    "review_id": expect.any(Number), 
                    "review_img_url": expect.any(String), 
                    "title": expect.any(String), 
                    "votes": expect.any(Number),
                    "comment_count": expect.any(Number)
                });
            });
        });
    });
});