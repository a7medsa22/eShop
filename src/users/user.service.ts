import {
    Injectable,
    BadRequestException,
    NotFoundException
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../utils/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRegisterDto } from "./dtos/user.register";
import * as bcrypt from "bcryptjs";
import { userLoginDto } from "./dtos/user.login";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenType, JwtPayloadType } from "src/utils/type";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,

    ) { }
    /**
 * create new register account
 * @param registerDto UserRegisterDto
 * @returns JWT Token
 */
    public async register(registerDto: UserRegisterDto): Promise<AccessTokenType> {
        const { username, email, password } = registerDto;
        const user = await this.userRepository.findOne({ where: { email } })
        if (user) throw new BadRequestException('email already exists')

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        let newUser = this.userRepository.create({
            username,
            email,
            password: hashPassword
        });
        await this.userRepository.save(newUser);

        const accessToken = await this.createToken({ id: newUser.id, userType: newUser.userType })

        return { accessToken };
    }
    /**
 * login user account
 * @param loginDto userLoginDto
 * @returns JWT Token
 */
    public async login(loginDto: userLoginDto): Promise<AccessTokenType> {
        const { email, password } = loginDto
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) throw new BadRequestException("Invalid email or password");

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) throw new BadRequestException("Invalid email or password");

        const accessToken = await this.createToken({ id: user.id, userType: user.userType })
        return { accessToken };
    }
    /**
     * get current user by id account       
     * @param id number
     * @returns User
     */
    public async getCurrentUser(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException("user Not Found")
        return user;
    }
    /**
     * get all user account
     * @param id number
     * @returns User[]
     */
    public async getAllCurrentUser(): Promise<User[]> {
        const user = await this.userRepository.find()
        if (!user) throw new BadRequestException("user Not Found");
        return user;
    }

    /**
 * create token account
 * @param payload JwtPayloadType
 * @returns string
 */
    private createToken(payload: JwtPayloadType): Promise<string> {
        return this.jwtService.signAsync(payload)
    }
}