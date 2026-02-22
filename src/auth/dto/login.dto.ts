import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user login.
 * Defines the expected payload when a user attempts to authenticate.
 */
export class LoginDto {
    /**
     * The user's registered email address.
     */
    @IsEmail({}, { message: 'Please provide a valid email address.' })
    @IsNotEmpty({ message: 'Email is required.' })
    email!: string;

    /**
     * The user's password.
     */
    @IsString({ message: 'Password must be a string.' })
    @IsNotEmpty({ message: 'Password is required.' })
    password!: string;
}
