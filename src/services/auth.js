import bcrypt from 'bcrypt';
import { User } from "../db/models/user.js";
import createHttpError from 'http-errors'
import { FIFTIEEN_MINUTES, ONE_MONTH, TEMPLATES_DIR } from '../constans/index.js';
import { Session } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { getEnvVariable } from '../utils/getEnvVariable.js';
import { sendMail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { resetPasswordSchema } from '../validation/auth.js';



////////////////////REGISTER USER//////////////////////
export const registerUser = async (payload) => {
    const user = await User.findOne({
        email: payload.email,
    });
    if (user !== null) {
        throw new createHttpError.Conflict('Email in use');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    return await User.create({
        ...payload,
    password: encryptedPassword,
    });
}

////////////////////LOGIN USER//////////////////////
export const loginUser = async (email, password) => {
    
    const user = await User.findOne({ email });
    if (!user) {
        throw new createHttpError.Unauthorized('Email or password is wrong');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch !== true) {
        throw new createHttpError.Unauthorized('Email or password is wrong');
    }
    await Session.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + FIFTIEEN_MINUTES,
        refreshTokenValidUntil: Date.now() + ONE_MONTH,
    });
}
////////////////////LOGOUT USER//////////////////////

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
}
////////////////////REFRESH TOKEN//////////////////////

export async function refreshSession(sessionId, refreshToken) {
    const session = await Session.findById(sessionId);
    if (session === null) {
        throw new createHttpError.Unauthorized('Sesssion not found');
    }
    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('Invalid refresh token');
    }
    if (session.refreshTokenValidUntil < Date.now()) {
        throw new createHttpError.Unauthorized('Refresh token expired');
    }

    await Session.deleteOne({ userId: session.userId });

    return Session.create({
        userId: session.userId ,
        accessToken: randomBytes(30).toString('base64'),
        refreshToken: randomBytes(30).toString('base64'),
        accessTokenValidUntil: Date.now() + FIFTIEEN_MINUTES,
        refreshTokenValidUntil: Date.now() + ONE_MONTH,
    });
}
////////////////////REQUEST EMAIL//////////////////////
 
export const requestEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const token = jwt.sign({ sub: user._id, email }, getEnvVariable('JWT_SECRET'), { expiresIn: '15m' });

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html'
    );
    const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();
    
    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${getEnvVariable('APP_DOMAIN')}/reset-password?token=${token}`,
    });
    try {
        await sendMail({
            from: getEnvVariable('SMTP_FROM'),
            to: email,
            subject: 'Reset your password',
            html,
        });
    }
    catch (error) {
        throw new createHttpError(500, 'Failed to send the email, please try again later');
    }
}
////////////////////RESET PASSWORD//////////////////////
export const resetPassword = async (payload) => {
    let entries;
    try {
        entries = jwt.verify(payload.token, getEnvVariable('JWT_SECRET')
        );
    } catch (error) {
        if (error instanceof Error) throw new createHttpError(401, error.message);
        throw error;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });
    if (!user) {
        throw new createHttpError(404, 'User not found');
    }
    const encryptedPassword = await bcrypt.hash(payload.password, 10);
    await User.updateOne(
        { _id: entries.sub },
        { password: encryptedPassword },
    );
}