import { AuthService } from './auth.service';
import { LoginRequestDto, FilterPaginationUserDto } from './dto/auth.request.dto';
import { SuccessResponse } from '../../common/interfaces/response';
import { LoginResponseDto } from './dto/auth.response.dto';
import { Request } from 'express';
import { StatusUserDto, CreateUserDto, UpdateUserDto, ImportUserDto } from './dto/auth.request.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    protected createUser(req: Request, createUserDto: CreateUserDto): Promise<any>;
    protected loginUser(loginDto: LoginRequestDto): Promise<SuccessResponse<LoginResponseDto>>;
    protected getAllUser(req: Request, paginationDto: FilterPaginationUserDto): Promise<SuccessResponse<any>>;
    protected getUserInfo(id: string): Promise<SuccessResponse<any>>;
    protected getAllRoMaster(req: Request): Promise<SuccessResponse<any>>;
    protected UpdateUser(id: string, userDto: UpdateUserDto): Promise<SuccessResponse<any>>;
    protected updateUserStatus(id: string, updateUserInfoDto: StatusUserDto): Promise<SuccessResponse<any>>;
    protected importusers(req: Request, createUserDto: ImportUserDto[]): Promise<any>;
    protected getOrderDropDown(req: Request): Promise<SuccessResponse<any>>;
}
