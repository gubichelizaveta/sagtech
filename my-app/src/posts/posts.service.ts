import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaClient, Post } from '@prisma/client';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostsService {
  private prisma = new PrismaClient();

  async findAll({
    page = 1,
    limit = 10,
    title,
  }: {
    page: number;
    limit: number;
    title?: string;
  }): Promise<Post[]> {
    const skip = (page - 1) * limit;
    const take = limit;

    return this.prisma.post.findMany({
      skip,
      take,
      where: {
        ...(title && { title: { contains: title } }),
      },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({ where: { id: parseInt(id, 10) } });
    if (!post) {
      throw new NotFoundException('запись не найдена');
    }
    return post;
  }

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        userId: userId,
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {
    const post = await this.findOne(id);
    if (post.userId !== userId) {
      throw new ForbiddenException('Вы не автор');
    }
    return this.prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: updatePostDto,
    });
  }

  async delete(id: string, userId: number, userRole: string): Promise<Post> {
    const post = await this.findOne(id);
    if (post.userId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenException('Доступ запрещен');
    }
    return this.prisma.post.delete({ where: { id: parseInt(id, 10) } });
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
