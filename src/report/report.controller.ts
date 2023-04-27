import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';

@Controller('report')
export class ReportController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly reportService: ReportService,
  ) {}

  @Get('/courses/50-or-more-students')
  async getCoursesWithManyStudents() {
    try {
      const query = `
				SELECT * FROM courses_with_50_or_more_students;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getCoursesWithManyStudents() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/students/5-or-more-courses')
  async getStudentWithManyCourses() {
    try {
      const query = `
				SELECT * FROM students_with_5_or_more_courses;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getStudentWithManyCourses() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/lecturers/3-or-more-courses')
  async getLecturersWithManyCourses() {
    try {
      const query = `
				SELECT * FROM lecturers_with_3_or_more_courses;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getLecturersWithManyCourses() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/courses/top-10-enrollment')
  async getMostCourseEnrollments() {
    try {
      const query = `
				SELECT * FROM top_10_enrolled_courses;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getLecturersWithManyCourses() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/students/top-10-highest-averages')
  async getHighestAverages() {
    try {
      const query = `
				SELECT users.first_name, users.last_name, AVG(student_courses.grade) as 'Average'  
				FROM student_courses
				JOIN users ON users.user_id=student_courses.student_id
				GROUP BY student_courses.student_id
				ORDER BY AVG(student_courses.grade) DESC
				LIMIT 10;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getHighestAverages() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
