import { Repository } from 'typeorm';
import { AuthProvider } from './auth.provider';
import { User, UserType } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MailService } from 'src/mails/mails.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

describe('AuthProvider', () => {
    let authProvider: AuthProvider;
    let userRepository: jest.Mocked<Repository<User>>;
    let mailService: jest.Mocked<MailService>;
    let configService: jest.Mocked<ConfigService>;

    const registerDto = {
        username: 'test',
        email: 'test@test.com',
        password: 'test1234',
    };
    const mockUser = (overrides?: Partial<User>): User => ({
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password: 'test1234',
        createAt: new Date(),
        updateAt: new Date(),
        isAccountVerified: false,
        verificationToken: 'verify-token',
        userType: UserType.NORMAL_USER,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        nameProfileImage: '',
        products: [],
        reviews: [],
        ...overrides,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthProvider,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                    },
                },
                { provide: UsersService, useValue: {} },
                {
                    provide: MailService,
                    useValue: {
                        sendVerifyEmailTempleate: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(),
                    },
                },
                { provide: JwtService, useValue: {} },
            ],
        }).compile();

        authProvider = module.get<AuthProvider>( AuthProvider) as jest.Mocked<AuthProvider>;
        userRepository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
        mailService = module.get(MailService);
        configService = module.get(ConfigService);
    });

    it('should authProdvider be defined', () => {
        expect(authProvider).toBeDefined();
    });
    it('should userRepository be defined', () => {
        expect(userRepository).toBeDefined();
    });
    describe('when email already exists', () => {
        it('should throw BadRequestException', async () => {
            const user = mockUser();
            userRepository.findOne.mockResolvedValue(user);

            await expect(authProvider.register(registerDto)).rejects.toThrow(BadRequestException);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: registerDto.email },
            });

            expect(userRepository.create).not.toHaveBeenCalled();
            expect(userRepository.save).not.toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTempleate).not.toHaveBeenCalled();
        });
    });
    
});
