import { BadRequestException, Body, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './user.userdto';
import { PasswordHasherService } from './auth/password-hasher/password-hasher.service';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UserService {

    constructor(@InjectModel('User') private userRepo: Model<User>,
    private passwordHasher: PasswordHasherService,
    private jwtService: JwtService){}

    createUser(usertoCreate: CreateUserDto) {
        const user = new this.userRepo(usertoCreate);
        return user.save();
    }

    getUsers() {
        return this.userRepo.find();
    }

    getById(id: string) {
        return this.userRepo.findById(id);
    }

    async updateUser(id: string, attr: Partial<CreateUserDto>) {
        const user = await this.getById(id);
        if (!user) {
            throw new NotFoundException(`user not found with id: ${id}`);
        }

        const updatedUser = Object.assign(user, attr);
        updatedUser.save()
        return updatedUser.email;
    }

    async remove(id: string) {
        return await this.userRepo.findByIdAndDelete(id);
    }

    async getByEmail(email: string) {
        return await this.userRepo.findOne({email});
    }

    async signup(dto: CreateUserDto) {
        // const email = dto.email;
        const user = await this.getByEmail(dto.email);
        if (user) {
            throw new BadRequestException('User already present');
        }

        // const hashedPassword = await this.passwordHasher.hashPassword(user.password);
        const hashedPassword = await this.passwordHasher.hashPassword(dto.password);

        const newUser = new this.userRepo(
            {name: dto.name, email: dto.email, 
            password: hashedPassword});

        await newUser.save();
        return {email: newUser.email}; 
    }

    async login(email: string, password: string) {
        const user = await this.getByEmail(email);
        if (!user) {
            throw new NotFoundException('user does not exists');
        }
        const matchedPassword = await this.passwordHasher.comparePassword(
            password, 
            user.password
            );
            if (matchedPassword) {
                const token = await this.jwtService.signAsync({email: user.email, id: user.id});
                return {token};
            }
            else{
                throw new UnauthorizedException('Invalid password')
            }
    }
}
