import type { IncomingMessage, ServerResponse } from "http";
import productController from "../controller/product.controller";

const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method

    if(url === "/" && method === "GET"){
        // console.log("This is root route")
        res.writeHead(200,{"Content-type": "application/json; charset=utf-8"})
        res.end(JSON.stringify({ message: "This is root route" }))
    } 
    else if(url?.startsWith("/products")) {
        productController(req,res)
    }
    else {
        // console.log("This is route is not defined")
        res.writeHead(404,{"Content-type": "application/json; charset=utf-8"})
        res.end(JSON.stringify({message: "This is route is not defined"}))
    }
}

export default routeHandler