import axios from "axios";

export const verifyOTP = async (req, res) => {

    try {

        const { mobile, otp } = req.body;

        const response = await axios.post(
            "https://control.msg91.com/api/v5/otp/verify",

            {
                mobile: `91${mobile}`,
                otp,
            },

            {
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY,
                },
            }
        );

        return res.json({
            success: true,
            data: response.data,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
};