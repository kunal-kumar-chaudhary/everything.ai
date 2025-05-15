import { cookies } from "next/headers";

export async function logout(request: Request){
    // clear cookies
    (await cookies()).delete("token");
    return Response.json(
        {
            success: true,
            message: "Logged out successfully"
        },
        { status: 200 }
    );
}