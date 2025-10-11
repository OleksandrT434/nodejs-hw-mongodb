import nodemailer from 'nodemailer';
import { getEnvVariable } from './getEnvVariable.js';
import { SMTP } from '../constans/index.js';

const transporter = nodemailer.createTransport({
    host: getEnvVariable(SMTP.SMTP_HOST),
    port: Number(getEnvVariable(SMTP.SMTP_PORT)),
    auth: {
        user: getEnvVariable(SMTP.SMTP_USER),
        pass: getEnvVariable(SMTP.SMTP_PASSWORD),
    },
});
export const sendMail = async (options) => {
    return await transporter.sendMail(options)
}