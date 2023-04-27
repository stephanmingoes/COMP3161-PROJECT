import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { AuthGuard } from 'src/auth/auth.guard';

UseGuards(AuthGuard);
@Controller('content')
export class ContentController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post('/')
  async createCourseContent(@Body() body: any) {
    try {
      const { section_id, course_content } = body;
      const query = `
        INSERT INTO course_contents (section_id, course_content)
        VALUES (?, ?);
      `;
      const data = await this.connection.query(query, [
        section_id,
        course_content,
      ]);
      return { message: 'Course content created successfully' };
    } catch (e) {
      console.error(`ERROR createCourseContent ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:course_id')
  async retrieveCourseContent(@Param('course_id') courseId: string) {
    try {
      const query = `
        SELECT cc.*, s.section_title 
        FROM course_contents cc 
        INNER JOIN sections s ON cc.section_id = s.section_id 
        WHERE s.course_id = ?;
      `;
      const data = await this.connection.query(query, [courseId]);
      return data;
    } catch (e) {
      console.error(`ERROR retrieveCourseContent ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
