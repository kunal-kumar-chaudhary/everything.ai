import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
    try{
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "verification code",
            react: VerificationEmail({username:username, otp:verifyCode})
        })
        return {success: true, message: "verification code sent successfully"}
    }
    catch(err: unknown){
        return {success: false, message: "error sending verification code"}
    }
}
