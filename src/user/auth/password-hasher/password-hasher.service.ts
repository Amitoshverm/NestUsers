import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
// import * as bcrypt from 'bcrypt';

import {scrypt as _scrypt, randomBytes, timingSafeEqual} from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class PasswordHasherService {

    async hashPassword(password: string) {
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = salt + "." + hash.toString('hex');
        return result;
    }

    async comparePassword(password: string, storedHash: string) {
        const [salt, key] = storedHash.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        return timingSafeEqual(Buffer.from(key, 'hex'), hash);
    }
}
