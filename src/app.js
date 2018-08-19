import Koa from "koa"
import KoaRouter from "koa-router"
import KoaCors from "@koa/cors"
import KoaBodyParser from "koa-bodyparser"
import KoaLogger from "koa-logger"

export default api => {
    const router = KoaRouter()
    router.get("/items", ctx => ctx.body = api.fetchItems())
    router.post("/item/add", ctx => ctx.body = api.addItem(ctx.request.body))
    router.post("/item/delete/:id", ctx => ctx.body = api.deleteItem(ctx.params.id))
    router.get("/logs", ctx => ctx.body = api.fetchLogs())
    
    const app = new Koa()
    app.use(KoaCors())
    app.use(KoaBodyParser())
    app.use(KoaLogger())
    app.use(router.routes())
    app.use(router.allowedMethods())
    return app
}