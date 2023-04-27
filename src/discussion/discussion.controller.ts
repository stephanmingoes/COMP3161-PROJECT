import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { AuthGuard } from 'src/auth/auth.guard';

UseGuards(AuthGuard);
@Controller('discussion')
export class DiscussionController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('/thread/:id')
  async getDiscussionThreads(@Param('id') id: number) {
    const query = `
      SELECT * FROM threads
      WHERE forum_id = ?;
    `;
    const rows = await this.connection.query(query, [id]);
    return rows;
  }

  @Post('/thread')
  async addDiscussionThread(
    @Body()
    body: {
      forum_id: number;
      parent_thread_id: number;
      created_by: number;
      thread_content: string;
    },
  ) {
    const { forum_id, parent_thread_id, created_by, thread_content } = body;
    const query = `
      INSERT INTO threads (forum_id, parent_thread_id, created_by, thread_content)
      VALUES (?, ?, ?, ?);
    `;
    await this.connection.query(query, [
      forum_id,
      parent_thread_id,
      created_by,
      thread_content,
    ]);
    return { message: 'Discussion thread created successfully' };
  }

  @Post('/reply')
  async addDiscussionReply(
    @Body()
    body: {
      forum_id: number;
      parent_thread_id: number;
      created_by: number;
      thread_content: string;
    },
  ) {
    const { forum_id, parent_thread_id, created_by, thread_content } = body;
    const query = `
      INSERT INTO threads (forum_id, parent_thread_id, created_by, thread_content)
      VALUES (?, ?, ?, ?);
    `;
    await this.connection.query(query, [
      forum_id,
      parent_thread_id,
      created_by,
      thread_content,
    ]);
    return { message: 'Discussion reply added successfully' };
  }
}
