import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    /**
     * The constructor injects the AuthService.
     * @param authService - The authentication logic service layer.
     */
    constructor(private readonly authService: AuthService) { }

    /**
     * Handles POST requests to the /auth/login endpoint.
     * 
     * @param loginDto - The validated credentials from the request body.
     * @returns A signed JWT token upon successful authentication.
     */
    @Post('login')
    @HttpCode(HttpStatus.OK) // Because POST defaults to 201, 200 is more appropriate for a login.
    async login(@Body() loginDto: LoginDto) {
        // Forward the login credentials to the service layer.
        return this.authService.login(loginDto);
    }
}
