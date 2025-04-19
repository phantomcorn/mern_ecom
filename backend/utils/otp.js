import speakeasy from "speakeasy"

const secret = speakeasy.generateSecret()

function generateOTP() {
    const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
        step: 300 /* Token expires every 300s (5min)*/
    })
    return otp
}

function verifyOTP(otp) {
    return speakeasy.totp.verify({
        secret: secret.base32,
        encoding: "base32",
        token: otp,
        step: 300, /* Must match step during generation */
        window: 1 /* Allow +/- 1 sec of margin error */
    })
}

export {generateOTP, verifyOTP}