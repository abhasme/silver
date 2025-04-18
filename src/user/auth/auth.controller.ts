import { Controller, Get,Put,Post, Body, Patch, Param, Delete, UseInterceptors, HttpCode, UsePipes, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse,ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto, MobileRequestDto, EmailRequestDto, changePasswordRequestDto, passwordRequestDto, FilterPaginationUserDto } from './dto/auth.request.dto';
import { TransformInterceptor } from '../../common/dispatchers/transform.interceptor';
import { SuccessResponse } from '../../common/interfaces/response';
import { LoginResponseDto } from './dto/auth.response.dto';
import { ValidationPipe } from '../../validations/validation.pipe';
import { Request } from 'express';
import { UserResponseDto } from './dto/auth.response.dto'
import { StatusUserDto, CreateUserDto, UpdateUserDto, BulkUsersDto, ImportUserDto } from './dto/auth.request.dto'
import { FilterPaginationChannelPartnerDto } from 'src/dto/channelPartner-dto';

@Controller('user/auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@UseInterceptors(TransformInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @ApiOperation({ summary: 'Create New User' })
    @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
    @ApiForbiddenResponse({ description: 'Email already exist' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post("createUser")
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    protected async createUser(@Req() req: Request, @Body() createUserDto: CreateUserDto ): Promise<any> {
      return await this.authService.createUser(createUserDto,req);
    }


    @ApiOperation({ summary: 'Login into the system' })
    @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
    @ApiBadRequestResponse({ status: 200, description: 'Invalid id or password' })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Post('login')
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    protected async loginUser(@Body() loginDto: LoginRequestDto): Promise<SuccessResponse<LoginResponseDto>> {
        const data = await this.authService.userLogin(loginDto);
        return { data };
    }
   
    @ApiOperation({ summary: 'Get all user' })
    @ApiResponse({ status: 200})
    @Post("all")
    protected async getAllUser(@Req() req: Request, @Body() paginationDto : FilterPaginationUserDto): Promise<SuccessResponse<any>> {
      const data = await this.authService.getAllUser(paginationDto);
      return { data };
    }

     
    @ApiOperation({ summary: 'Get paticular user details' })
    @ApiUnauthorizedResponse({ description: 'Login required' })
    @ApiBadRequestResponse({ description: 'Invalid user id' })
    @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
    @Get('/:id')
    protected async getUserInfo(@Param('id') id: string) : Promise<SuccessResponse<any>> {
      const data = await this.authService.getUserInfo(id);
      return { data };
    };


    @ApiOperation({ summary: 'Get all cp' })
    @ApiResponse({ status: 200})
    @Get("ro/all")
    protected async getAllRoMaster(@Req() req: Request): Promise<SuccessResponse<any>> {
      const data = await this.authService.getAllRoMaster();
      return { data };
    };

    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'Success', type: UpdateUserDto })
    @ApiInternalServerErrorResponse({ description: 'Internal server error' })
    @Put('/:id')
    @HttpCode(200)
    protected async UpdateUser(@Param('id') id: string, @Body() userDto: UpdateUserDto) : Promise<SuccessResponse<any>> {
      const data = await this.authService.UpdateUser(id,userDto);
      return { data };
    };


   @ApiOperation({ summary: 'Update status' })
   @ApiUnauthorizedResponse({ description: 'Login required' })
   @ApiBadRequestResponse({ description: 'Invalid user id' })
   @ApiResponse({ status: 200, description: 'Success', type: StatusUserDto })
   @Patch('/status/:id')
   protected async updateUserStatus(@Param('id') id: string, @Body() updateUserInfoDto: StatusUserDto) : Promise<SuccessResponse<any>> {
    const data = await this.authService.updateUserStatus(id,updateUserInfoDto);
    return { data };
   };


   @ApiOperation({ summary: 'Add Multiple user' })
   @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
   @ApiBadRequestResponse({ description: 'Invalid id or password' })
   @ApiForbiddenResponse({ description: 'Your email is not verified! Please verify your email address.' })
   @ApiInternalServerErrorResponse({ description: 'Internal server error' })
   @Post('import')
   @HttpCode(200)
   protected async importusers(@Req() req: Request, @Body() createUserDto: ImportUserDto[]): Promise<any> {
    const data = await this.authService.importusers(createUserDto);
    return { data };
   };

   @ApiOperation({ summary: 'Get cp  drop down' })
   @ApiResponse({ status: 200, description: 'Success', type: UserResponseDto })
   @Post("/dropdown")
   protected async getOrderDropDown(@Req() req: Request): Promise<SuccessResponse<any>> {
    const data = await this.authService.getOrderDropDown();
    return { data };
   };   
}
