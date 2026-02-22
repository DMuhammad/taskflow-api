import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    /**
     * The constructor injects the PrismaService so we can interact with the database.
     * @param prisma - Prisma DB client service instance.
     */
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Registers a new user in the system.
     * It checks for an existing user by email, hashes the password, and creates the record.
     * 
     * @param registerUserDto - The validated DTO containing the user's register info.
     * @returns An object containing a success message and the created user (without password).
     */
    async registerUser(registerUserDto: RegisterUserDto) {
        const { email, password, name } = registerUserDto;

        // 1. Check if a user with the given email already exists in the database.
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        // 2. If the user exists, throw a ConflictException to indicate the email is in use.
        if (existingUser) {
            throw new ConflictException('User with this email already exists.');
        }

        try {
            // 3. Hash the user's password before storing it to ensure security.
            // 10 is the number of salt rounds.
            const hashedPassword = await bcrypt.hash(password, 10);

            // 4. Create the new user in the database.
            const newUser = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name: name,
                },
            });

            // 5. Exclude the password from the returned object for security reasons.
            const { password: _, ...data } = newUser;

            return {
                message: 'User registered successfully',
                data,
            };
        } catch (error) {
            // Catch any unexpected DB errors and throw a generic 500 error.
            console.error('Error in registerUser:', error);
            throw new InternalServerErrorException('An error occurred while creating the user.');
        }
    }
}
