import uuidv4 from "uuid/v4"

export default db => {
    const truncateLogs = () => db.get("logs").sortBy("date").reverse().drop(19).value().map(log => db.get("logs").remove(log).write())

    const log = msg => db.get("logs").push({ date: Date.now(), msg }).write()
    
    const fetchLogs = () => db.get("logs").sortBy("date").reverse().take(10).value()
    
    const fetchItems = () => db.get("items").value()
    
    const addItem = ({ item, column }) => {
        const id = uuidv4()
        const newItem = { id, item, column }
        db.get("items").push(newItem).write()
        truncateLogs()
        log(`Added Item "${item}" in Column "${column}"`)
        return newItem
    }
    
    const deleteItem = id => {
        const item = db.get("items").find({ id }).value()
        db.get("items").remove({ id }).write()
        truncateLogs()
        log(`Deleted Item "${item.item}" in Column "${item.column}"`)
        return item
    }

    return {
        truncateLogs,
        log,
        fetchLogs,
        fetchItems,
        addItem,
        deleteItem
    }
}