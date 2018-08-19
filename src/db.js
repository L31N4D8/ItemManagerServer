import low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"

export default filename => {
    const adapter = new FileSync(filename)
    const db = low(adapter)
    db.defaults({ items: [], logs: [] }).write()
    return db
}