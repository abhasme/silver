export declare class passwordRequestDto {
    password: string;
}
export declare class LoginMobileRequestDto {
    username: string;
    appVersion: string;
    deviceToken: string;
    deviceType: string;
    deviceName: string;
}
export declare class LoginRequestDto extends LoginMobileRequestDto {
    password: string;
}
export declare class LoginWithOtpRequestDto extends LoginMobileRequestDto {
    otp: string;
}
export declare class EmailRequestDto {
    email: string;
}
export declare class MobileRequestDto {
    mobile: string;
}
export declare class changePasswordRequestDto extends passwordRequestDto {
    currentPassword: string;
}
export declare class CreatePasswordRequestDto {
    username: string;
    password: string;
}
