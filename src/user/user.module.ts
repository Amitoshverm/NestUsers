import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { PasswordHasherService } from './auth/password-hasher/password-hasher.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';


@Module({
  imports:[JwtModule.register({secret: jwtConstants.secret}),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UserController],
  providers: [UserService, PasswordHasherService]
})
export class UserModule {}
