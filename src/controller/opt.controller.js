import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

export const sendOTP = async (req, res) => {

    try {
        console.log("process.env.MSG91_AUTH_KEY:", process.env.MSG91_AUTH_KEY);
        const { mobile } = req.body;

        const response = await axios.post(
            "https://control.msg91.com/api/v5/otp",

            {
                mobile: `91${mobile}`,
            },

            {
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY,
                },
            }
        );

        console.log("response:", response.data);

        return res.json({
            success: true,
            data: response.data,
        });

    } catch (error) {

        console.log(error.response?.data);

        return res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });
    }
};

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