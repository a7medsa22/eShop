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
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
    genSalt: jest.fn(),
    hash: jest.fn(),
}));

describe('AuthProvider', () => {
    let authProvider: AuthProvider;
    let userRepository: jest.Mocked<Repository<User>>;
    let mailService: jest.Mocked<MailService>;
    let configService: jest.Mocked<ConfigService>;
    let jwtService: jest.Mocked<JwtService>;



    const registerDto = {
        username: 'test',
        email: 'test@test.com',
        password: 'test1234',
    };
    const loginDto = {
        email: 'test@test.com',
        password: 'test1234',
    }
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
                {
                    provide: JwtService, useValue: {
                        signAsync: jest.fn()
                    }
                },
            ],

        }).compile();

        authProvider = module.get<AuthProvider>(AuthProvider) as jest.Mocked<AuthProvider>;
        userRepository = module.get<Repository<User>>(getRepositoryToken(User)) as jest.Mocked<Repository<User>>;
        mailService = module.get(MailService);
        configService = module.get(ConfigService);
        jwtService = module.get(JwtService);
    });

    it('should authProdvider be defined', () => {
        expect(authProvider).toBeDefined();
    });
    it('should userRepository be defined', () => {
        expect(userRepository).toBeDefined();
    });
    describe('register()', () => {
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
        describe('when email does not exists', () => {
            it('show create user and send verification email', async () => {
                const user = mockUser({ password: 'hash-password' })
                userRepository.findOne.mockResolvedValue(null);
                userRepository.create.mockReturnValue(
                    mockUser({ password: 'hashed-password' }),
                );
                userRepository.save.mockResolvedValue(
                    mockUser({ id: 1 }),
                );

                const result = await authProvider.register(registerDto);

                expect(userRepository.findOne).toHaveBeenCalledWith({
                    where: { email: registerDto.email }
                });
                (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
                (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

                expect(userRepository.create).toHaveBeenCalled();
                expect(userRepository.save).toHaveBeenCalled();

                expect(configService.get).toHaveBeenCalled();
                expect(mailService.sendVerifyEmailTempleate).toHaveBeenCalledTimes(1);

                expect(result).toEqual({
                    message: 'Verification token has been sent to your email'
                });

            });
        });
    });

    describe('login', () => {
        it('shuold throw if email not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(authProvider.login(loginDto)).rejects.toThrow(BadRequestException);

            expect(userRepository.findOne).toHaveBeenCalledWith({
                where: { email: loginDto.email }
            });

            expect(userRepository.save).not.toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTempleate).not.toHaveBeenCalled();

        });

        it('should throw BadRequestException if password is incorrect', async () => {
            const user = mockUser()
            userRepository.findOne.mockResolvedValue(user);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);


            await expect(authProvider.login(loginDto)).rejects.toThrow(BadRequestException);

            expect(userRepository.save).not.toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTempleate).not.toHaveBeenCalled();

        });

        it('should resend verification email if account not verified', async () => {
            const user = mockUser({ isAccountVerified: false, verificationToken: null });
            userRepository.findOne.mockResolvedValue(user);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            userRepository.save.mockResolvedValue({
                ...user,
                verificationToken: 'verify-token',
            });

            const result = await authProvider.login(loginDto);

            expect(userRepository.save).toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTempleate).toHaveBeenCalled();

            expect(result).toEqual({
                message: 'Verification token has been sent to your email'
            });
        });
        it('should return access token if login is successful', async () => {
            const user = mockUser({ isAccountVerified: true });

            userRepository.findOne.mockResolvedValue(user);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            jwtService.signAsync.mockResolvedValue('fake-jwt-token');
            const result = await authProvider.login(loginDto);


            expect(jwtService.signAsync).toHaveBeenCalledWith({
                id: user.id,
                userType: user.userType
            })

            expect(userRepository.save).not.toHaveBeenCalled();
            expect(mailService.sendVerifyEmailTempleate).not.toHaveBeenCalled();

            expect(result).toEqual({ accessToken: 'fake-jwt-token' });


        });




    });
});
