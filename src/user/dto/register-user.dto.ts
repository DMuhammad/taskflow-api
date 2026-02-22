import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user registration.
 * This class defines the shape and validation rules for the data expected
 * when a new user registers.
 */
export class RegisterUserDto {
    /**
     * User's email address. It must be a valid email string and cannot be empty.
     */
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email!: string;

    /**
     * User's name. It must be a valid string and cannot be empty.
     */
    @IsString({ message: 'Name must be a string.' })
    @IsNotEmpty({ message: 'Name is required.' })
    name!: string;

    /**
     * User's password. It must be at least 8 characters long and cannot be empty.
     */
    @IsString({ message: 'Password must be a string.' })
    @MinLength(8, { message: 'Password must be at least 8 characters long.' })
    @IsNotEmpty({ message: 'Password is required.' })
    password!: string;
}
