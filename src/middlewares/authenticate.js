import createHttpError from "http-errors";
import { Session } from "../db/models/session.js";
import { User } from "../db/models/user.js";

export async function auth(req, res, next) {
    const { authorization } = req.headers;
    if (typeof authorization !== 'string')
        throw new createHttpError.Unauthorized('Please provide access token');

    const [bearer, accessToken] = authorization.split(' ', 2);
    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
        throw new createHttpError.Unauthorized('Please provide access token');
    }
    const session = await Session.findOne({ accessToken });
    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    }
    if (session.accessTokenValidUntil < Date.now()) {
        throw new createHttpError.Unauthorized('Access token expired');
    }

    const user = await User.findById(session.userId);
    if (user === null) {
        throw new createHttpError.Unauthorized('User not found');
    }
    
    req.user = { id: user._id }

    next();
}

