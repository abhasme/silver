import { Model } from 'mongoose';
import { User } from '../../entities/users.entity';
import { RoMasterDocument } from '../../entities/Silver/roMaster';
import { LoginRequestDto, FilterPaginationUserDto } from './dto/auth.request.dto';
import { LoginResponseDto } from './dto/auth.response.dto';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StatusUserDto, CreateUserDto, UpdateUserDto, ImportUserDto } from './dto/auth.request.dto';
import { UserResponseDto } from './dto/auth.response.dto';
export declare class AuthService {
    private jwtService;
    private userModel;
    private roMasterModel;
    constructor(jwtService: JwtService, userModel: Model<User>, roMasterModel: Model<RoMasterDocument>);
    createUser(createUserDto: CreateUserDto, req: Request): Promise<UserResponseDto>;
    userLogin(loginDto: LoginRequestDto): Promise<LoginResponseDto>;
    getAllUser(paginationDto: FilterPaginationUserDto): Promise<any>;
    getAllRoMaster(): Promise<any>;
    getUserInfo(id: string): Promise<UserResponseDto>;
    UpdateUser(id: string, userDto: UpdateUserDto): Promise<User>;
    updateUserStatus(id: string, statusUserDto: StatusUserDto): Promise<User>;
    importusers(createUserDto: ImportUserDto[]): Promise<any>;
    getOrderDropDown(): Promise<any>;
}
