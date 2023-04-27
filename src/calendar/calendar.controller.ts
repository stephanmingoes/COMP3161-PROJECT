import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { AuthGuard } from 'src/auth/auth.guard';

UseGuards(AuthGuard);
@Controller('calendar')
export class CalendarController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('/event/:courseid')
  async getEventsForCourse(@Param('courseid') courseId: number) {
    const query = `
      SELECT * FROM events WHERE course_id = ?
    `;
    const rows = await this.connection.query(query, [courseId]);
    return { events: rows };
  }

  @Get('/event/:date/student/:student_id')
  async getEventsForStudentOnDate(
    @Param('date') date: string,
    @Param('student_id') studentId: number,
  ) {
    const query = `
      SELECT * FROM events WHERE created_by = ? AND created_date = ?
    `;
    const rows = await this.connection.query(query, [studentId, date]);
    return { events: rows };
  }

  @Post('/event')
  async createEvent(
    @Body()
    body: {
      course_id: number;
      created_by: number;
      event_title: string;
      event_description: string;
    },
  ) {
    const { course_id, created_by, event_title, event_description } = body;
    const query = `
      INSERT INTO events (course_id, created_by, event_title, event_description)
      VALUES (?, ?, ?, ?)
    `;
    await this.connection.query(query, [
      course_id,
      created_by,
      event_title,
      event_description,
    ]);
    return { message: 'Event created successfully' };
  }
}
