import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';

@Controller('forum')
export class ForumController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('/:id')
  async getAllForums(@Param('id') courseId: number) {
    const query = `
      SELECT *
      FROM forums
      WHERE course_id = ?
    `;
    const forums = await this.connection.query(query, [courseId]);
    return forums;
  }

  @Post()
  async createForum(@Body() body: any) {
    const { course_id, created_by, forum_title, forum_description } = body;
    const query = `
      INSERT INTO forums (course_id, created_by, forum_title, forum_description)
      VALUES (?, ?, ?, ?);
    `;
    await this.connection.query(query, [
      course_id,
      created_by,
      forum_title,
      forum_description,
    ]);
    return { message: 'Forum created successfully' };
  }
}
