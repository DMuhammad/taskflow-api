import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        // Register JwtModule dynamically to use environment variables for secret config.
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                // Use the secret specified in .env, falling back to a dev string if none exists.
                secret: configService.get<string>('JWT_SECRET', 'super-secret-default-key'),
                signOptions: {
                    // Set JWT to expire in 1 day.
                    expiresIn: '1d',
                },
            }),
        }),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService], // Exported in case other modules need auth logic
})
export class AuthModule { }
