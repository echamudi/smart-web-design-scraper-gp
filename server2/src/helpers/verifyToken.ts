import jwt from 'jsonwebtoken';
import config from '../configs/auth.config';

export const verifyToken = (token: string): {id: string} | false  => {
    if (typeof token !== 'string') {
        return false;
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err || decoded === undefined) {
            return false;
        }

        return (decoded as any).id;
    });

    return false;
};

