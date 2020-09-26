import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import config from '../configs/auth.config';

export const verifyToken = (token: string): Promise<{id: string} | JsonWebTokenError | NotBeforeError | TokenExpiredError | null>  => {
    if (typeof token !== 'string') {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err || decoded === undefined) {
                resolve(err);
            }
            resolve({id: (decoded as any).id});
        });
    });
};

