import _ from "lodash"
import low from "lowdb"
import Memory from "lowdb/adapters/Memory"
import sinon from "sinon"

import api from "./api"

describe("API", () => {
  let db = null
  beforeEach(() => db = low(new Memory()))
  afterEach(() => db = null)

  describe("truncateLogs", () => {

    it(`should have 19 records`, () => {
      db.defaults({ logs: _.range(20).map(date => ({ date })) }).write()

      api(db).truncateLogs()
      expect(db.get("logs").size().value()).to.equal(19)
    })

    it(`should truncate the oldest log`, () => {
      db.defaults({ logs: _.range(20).map(date => ({ date })) }).write()

      api(db).truncateLogs()
      expect(db.get("logs").find({ date: 0 }).size().value()).to.be.equal(0)
    })

  })

  describe("log", () => {
    it(`should create log record`, () => {
      db.defaults({ logs: [] }).write()
      const date = 1000
      const clock = sinon.useFakeTimers(date)
      const msg = "msg"

      api(db).log(msg)
      expect(db.get("logs").find({ date, msg }).value()).to.eql({ date, msg })

      clock.restore()
    })
  })

  describe("fetchLogs", () => {
    it(`should fetch 10 records`, () => {
      db.defaults({ logs: _.range(20) }).write()
      const logs = api(db).fetchLogs()

      expect(logs.length).to.be.equal(10)
    })

    it(`should fetch in reverse sorted date order`, () => {
      db.defaults({ logs: _.range(20) }).write()
      const logs = api(db).fetchLogs()

      expect(logs).to.deep.equal(_.range(19, 9, -1))
    })
  })

  describe("addItem", () => {

    it(`should create item record`, () => {
      db.defaults({ items: [], logs: [] }).write()
      const item = {
        item: "addItemItem",
        column: "addItemColumn"
      }

      api(db).addItem(item)
      expect(db.get("items").find(item).value()).to.have.property("id")
      expect(db.get("items").find(item).value()["item"]).to.eql(item.item)
      expect(db.get("items").find(item).value()["column"]).to.be.equal(item.column)
    })

    it(`should truncate and log`, () => {
      db.defaults({ items: [], logs: _.range(30).map(date => ({ date })) }).write()
      const date = 1000
      const clock = sinon.useFakeTimers(date)
      const item = {
        item: "addItemItem",
        column: "addItemColumn"
      }
      const msg = `Added Item "${item.item}" in Column "${item.column}"`

      api(db).addItem(item)
      expect(db.get("logs").size().value()).to.equal(20)
      expect(db.get("logs").find({ date, msg }).value()).to.eql({ date, msg })
      clock.restore()
    })

    describe("deleteItem", () => {

      it(`should delete item record`, () => {
        const item = {
          id: 0,
          item: "deleteItemItem",
          column: "deleteItemColumn"
        }
        db.defaults({ items: [item], logs: [] }).write()

        api(db).deleteItem(item.id)
        expect(db.get("items").find({ id: item.id }).size().value()).to.be.equal(0)
      })

      it(`should truncate and log`, () => {
        const item = {
          id: 0,
          item: "deleteItemItem",
          column: "deleteItemColumn"
        }
        db.defaults({ items: [item], logs: _.range(30).map(date => ({ date })) }).write()
        const date = 1000
        const clock = sinon.useFakeTimers(date)
        const msg = `Deleted Item "${item.item}" in Column "${item.column}"`

        api(db).deleteItem(item.id)
        expect(db.get("logs").size().value()).to.equal(20)
        expect(db.get("logs").find({ date, msg }).value()).to.eql({ date, msg })
        clock.restore()
      })
    })
  })
})
