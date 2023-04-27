import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('course')
export class CourseController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post()
  async createCourse(@Body() body: any, @Request() req: any) {
    if (req?.user?.role !== 'admin') throw new UnauthorizedException();
    try {
      const { course_code, course_name, course_description } = body;
      const query = `
        INSERT INTO courses ( course_code, course_name, course_description )
        VALUES ( ?, ?, ?);
      `;
      const data = await this.connection.query(query, [
        course_code,
        course_name,
        course_description,
      ]);
      return { message: 'Course created successfully' };
    } catch (e) {
      console.error(`ERROR createCourse ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getCourses() {
    try {
      const query = `
        SELECT * FROM courses;
      `;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getCourses ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/student/:id')
  async getCoursesForStudent(@Param('id') studentId: string) {
    try {
      const query = `
        SELECT c.* 
        FROM courses c 
        INNER JOIN student_courses sc ON c.course_id = sc.course_id 
        WHERE sc.student_id = ?;
      `;
      const data = await this.connection.query(query, [studentId]);
      return data;
    } catch (e) {
      console.error(`ERROR getCoursesForStudent ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/lecturer/:id')
  async getCoursesForLecturer(@Param('id') lecturerId: string) {
    try {
      const query = `
        SELECT c.* 
        FROM courses c 
        INNER JOIN lecturer_courses lc ON c.course_id = lc.course_id 
        WHERE lc.lecturer_id = ?;
      `;
      const data = await this.connection.query(query, [lecturerId]);
      return data;
    } catch (e) {
      console.error(`ERROR getCoursesForLecturer ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:course_id/:student_id/student_register')
  async registerStudentForCourse(
    @Param('course_id') courseId: string,
    @Param('student_id') studentId: string,
  ) {
    try {
      const query = `
        INSERT INTO student_courses (course_id, student_id)
        VALUES (?, ?);
      `;
      const data = await this.connection.query(query, [courseId, studentId]);
      return { message: 'Student registered for course successfully' };
    } catch (e) {
      console.error(`ERROR registerStudentForCourse ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('/:course_id/:lecturer_id/lecturer_register')
  async registerLecturerForCourse(
    @Param('course_id') courseId: string,
    @Param('lecturer_id') lecturerId: string,
  ) {
    try {
      const query = `
        INSERT INTO lecturer_courses (course_id, lecturer_id)
        VALUES (?, ?);
      `;
      const data = await this.connection.query(query, [courseId, lecturerId]);
      return { message: 'Lecturer registered for course successfully' };
    } catch (e) {
      console.error(`ERROR registerStudentForCourse ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/:id/members')
  async getMembers(@Param('id') courseId: string) {
    try {
      const query = `
        SELECT u.username, u.role
        FROM users u
        JOIN (
          SELECT student_id AS user_id
          FROM student_courses
          WHERE course_id = ?
          UNION
          SELECT lecturer_id AS user_id
          FROM lecturer_courses
          WHERE course_id = ?
        ) c
        ON u.user_id = c.user_id;
      `;
      const data = await this.connection.query(query, [courseId, courseId]);
      return { members: data };
    } catch (e) {
      console.error(`ERROR getMembers ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
