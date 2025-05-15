import { authMiddleware } from "@/middlewares/authMiddleware";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest){
    return authMiddleware(request)
}

export const config = {
    matcher: [
        '/api/protected/:path',
        '/api/admin/:path'
    ]
}