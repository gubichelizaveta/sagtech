import { Module } from '@nestjs/common';
import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';


@Module({
  imports: [AuthModule, UsersModule, PostsModule],
  controllers: [UsersController],
  providers: [UserService],
})
export class AppModule {}
