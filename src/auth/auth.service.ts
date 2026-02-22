import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    /**
     * The constructor injects PrismaService for DB access and JwtService to issue tokens.
     * @param prisma - Prisma DB client instance.
     * @param jwtService - Service to sign and issue JSON Web Tokens.
     */
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * Validates a user's credentials and issues a JWT if successful.
     * 
     * @param loginDto - Contain's the user's email and password.
     * @returns An object containing the access token if login is successful.
     */
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // 1. Verify existence: Find the user in the database by their email address.
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // Throw 401 Unauthorized if user not found, 
            // though typically in production we use the same message for email or password failure.
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 2. Verify password: Compare the submitted plaintext password with the stored hash.
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // 3. Issue Token: Create the JWT payload using the user's ID and email.
        // In Day 3, this payload will be decoded by JwtStrategy.
        const payload = { sub: user.id, email: user.email };

        // 4. Return the signed JWT back to the client.
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
