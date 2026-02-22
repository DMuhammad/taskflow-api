import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
    /**
     * The constructor injects the UserService to handle the business logic.
     * @param userService - An instance of UserService.
     */
    constructor(private readonly userService: UserService) { }

    /**
     * Handles POST requests to the /user/register endpoint.
     * It receives the request body, which is validated against RegisterUserDto natively by NestJS pipes.
     * 
     * @param registerDto - The validated incoming registration payload.
     * @returns The result of the registration process from the service layer.
     */
    @Post('register')
    async register(@Body() registerDto: RegisterUserDto) {
        // Delegate the actual registration logic to the UserService.
        return this.userService.registerUser(registerDto);
    }
}
