import { Body, Controller, Delete, Get, HttpCode, HttpException, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';
import mongoose from 'mongoose';
import { CreateUserDto } from './user.userdto';


@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post()
    create(@Body() user: CreateUserDto) {
        return this.userService.createUser(user);
    }

    @Post('signup')
    signup(@Body() user: CreateUserDto) {
        return this.userService.signup(user);
    }

    @Post('login')
    login(@Body() user: CreateUserDto) {
        return this.userService.login(user.email, user.password);
    }


    @Get('users') 
    getAllUser() {
        return this.userService.getUsers();
    }

    @Get('/:id')
    getUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('User not found', 404);
        }
        const user = this.userService.getById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() user: User) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) {
            throw new HttpException('User not found', 404);
        }
        return this.userService.updateUser(id, user);
    }

    @Delete('/:id')
    async deleteUser(@Param('id') id: string) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) {
            throw new HttpException('user not found',400);
        }
        const searchUser = this.userService.getById(id);
        // if (!searchUser) {
        //     throw new NotFoundException('User not found');
        // }
        const user = await this.userService.remove(id);
    }

    @Get() 
    getByEmail(@Query('email') email: string) {
        console.log(email);
        return this.userService.getByEmail(email);
        
    }
}
