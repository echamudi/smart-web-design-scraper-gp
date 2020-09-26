import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import config from '../configs/auth.config';

/**
 * Check whether jwt token is valid or not, it returns the id property of the payload
 * @param token JWT token
 */
export const verifyToken = (token: string): Promise<string | JsonWebTokenError | NotBeforeError | TokenExpiredError | null>  => {
    if (typeof token !== 'string') {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err || decoded === undefined) {
                resolve(err);
            }
            resolve(((decoded as any).id as string));
        });
    });
};

