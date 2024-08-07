import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as Posts } from '@prisma/client';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import { AuthenticatedGuard } from '../auth/authenticated-guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('title') title?: string
  ): Promise<Posts[]> {
    return this.postsService.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      title
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(AuthenticatedGuard) 
  async create(@Body() createPostDto: CreatePostDto, @Req() req: any) {
    const userId = req.user.id;
    return this.postsService.create(createPostDto, userId);
  }

  @Put(':id')
  @UseGuards(AuthenticatedGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: any) {
    const userId = req.user.id;
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @UseGuards(AuthenticatedGuard)
  async delete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.id;
    const userRole = req.user.role;
    return this.postsService.delete(id, userId, userRole);
  }
}
