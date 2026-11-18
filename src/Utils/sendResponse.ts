import type { ServerResponse } from "http";

export const sendResponse = (
    res: ServerResponse,
    success: boolean,
    statusCode: number,
    message: string,
    data?: any,
) => {
    const response = {
        success,
        statusCode,
        message,
        data
    }
    
    res.writeHead(statusCode, {"Content-Type": "application/json; charset=utf-8"});
    res.end(JSON.stringify(response))
}