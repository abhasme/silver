export interface Sha512Interface {
    salt: string;
    passwordHash: string;
}
export declare class PasswordHelper {
    compare(plainPassword: string, passwordhash: string): Promise<boolean | object>;
    generateHash(userPassword: string): Promise<string>;
    generateSalt(round?: number): Promise<string | null>;
    generatehash(plainPassword: string, salt: string): Promise<string | null>;
}
