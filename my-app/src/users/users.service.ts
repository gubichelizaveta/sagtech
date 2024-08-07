import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }
  async update(id: string, updateUserDto: any): Promise<User> {
    return this.prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: updateUserDto,
    });
  }
  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id: parseInt(id, 10) } });
  }
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}