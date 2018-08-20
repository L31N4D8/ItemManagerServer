import request from "request"

import _app from "./app"

const PORT = 54321
const SERVER = `http://localhost:${PORT}`
const api = {
    fetchLogs: () => ["A", "B", "C"],
    fetchItems: () => [1, 2, 3],
    addItem: ({ item, column }) => ({ id: 0, item, column }),
    deleteItem: id => id
}
let app = _app(api)

describe("Koa App", () => {
    before(done => app.listen(PORT, done))
    
    describe("GET /items", () => {
        it("should return all items", done => {
            request({
                method: "GET",
                uri: `${SERVER}/items`,
                json: true
            }, (err, response, body) => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.headers["content-type"]).to.include("application/json")
                expect(body).to.deep.equal(api.fetchItems())
                done()
            })
        })
    })

    describe("POST /item/add", () => {
        it("should return new item", done => {
            const item = {
                id: 0,
                item: "item",
                column: "column"
            }
            request({
                method: "POST",
                uri: `${SERVER}/item/add`,
                json: true,
                body: item
            }, (err, response, body) => {
                console.log(err)
                expect(response.statusCode).to.be.equal(200)
                expect(response.headers["content-type"]).to.include("application/json")
                expect(body).to.deep.equal(item)
                done()
            })
        })
    })

    describe("POST /item/delete/0", () => {
        it("should return deleted item id", done => {
            request({
                method: "POST",
                uri: `${SERVER}/item/delete/0`
            }, (err, response, body) => {
                console.log(err)
                expect(response.statusCode).to.be.equal(200)
                expect(body).to.be.equal("0")
                done()
            })
        })
    })

    describe("GET /logs", () => {
        it("should return all logs", done => {
            request({
                method: "GET",
                uri: `${SERVER}/logs`,
                json: true
            }, (err, response, body) => {
                expect(response.statusCode).to.be.equal(200)
                expect(response.headers["content-type"]).to.include("application/json")
                expect(body).to.deep.equal(api.fetchLogs())
                done()
            })
        })
    })

})
