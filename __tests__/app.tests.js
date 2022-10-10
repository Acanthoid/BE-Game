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
	test("GET api//categories", () => {
    return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Object);
        expect(categories).toEqual([{"description": "Abstact games that involve little luck", "slug": "euro game"}, {"description": "Players attempt to uncover each other's hidden role", "slug": "social deduction"}, {"description": "Games involving physical skill", "slug": "dexterity"}, {"description": "Games suitable for children", "slug": "children's games"}]);
        });
    });
});





