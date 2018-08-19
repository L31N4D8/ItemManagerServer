import fs from "fs"
import { expect } from "chai"
import _ from "lodash"
import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import api from "./api"

const FILENAME = "test.db.json"
const db = low(new FileSync(FILENAME))
const stubDatenow = date => Date.now = () => date

describe("API", () => {
  after(() => fs.unlinkSync(FILENAME))

  describe("truncateLogs", () => {
    const items = []
    const logs = _.range(21).map(date => ({ date }))
    db.defaults({ items, logs }).write()
    api(db).truncateLogs()

    it(`should have 19 records`, () => expect(db.get("logs").size().value()).to.equal(19))
    it(`should truncate oldest log`, () => expect(db.get("logs").find({ date: 0 }).size().value()).to.equal(0))
  })

  describe("log", () => {
    it(`should create log record`, () => {
      const date = 1000
      const msg = "msg"
      stubDatenow(date)
      api(db).log(msg)

      expect(db.get("logs").find({ date, msg }).value()).to.eql({ date, msg })
    })
  })

  describe("fetchLogs", () => {
    const logs = api(db).fetchLogs()
    const dates = _.map(logs, "date")
    const sortedDates = _.reverse(_.sortBy(dates))

    it(`should fetch 10 records`, () => expect(logs).to.have.length(10))
    it(`should be sorted with descending dates`, () => expect(dates).to.eql(sortedDates))
  })

  // describe("addItem", () => {
  //   const date = 1001
  //   const item = {
  //     item: "addItemItem",
  //     column: "addItemColumn"
  //   }
  //   const log = { date, msg: `Added Item "${item.item}" in Column "${item.column}"`}
  //   stubDatenow(date)
  //   api(db).addItem(item)

  //   it(`should have an id`, () => expect(db.get("logs").find(item).value()).to.have.property("id"))
  //   it(`should create item record`, () => expect(db.get("logs").find(item).value()).to.eql(item))
  //   it(`should have 20 log records`, () => expect(db.get("logs").size().value()).to.equal(20))
  //   it(`should create log record`, () => expect(api(db).fetchLogs({ date }).value()).to.eql(log))
  // })
})
