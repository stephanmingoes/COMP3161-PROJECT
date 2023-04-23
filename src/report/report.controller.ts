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
				SELECT courses.course_code, courses.course_name, COUNT(*) as 'No. Of Students'  
				FROM student_courses
				LEFT JOIN courses ON courses.course_id=student_courses.course_id
				GROUP BY student_courses.course_id
				HAVING COUNT(*) >= 50;
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
				SELECT users.first_name, users.last_name, COUNT(*) as 'No. Of Courses'  
				FROM student_courses
				LEFT JOIN users ON student_courses.student_id=users.user_id
				GROUP BY student_courses.student_id
				HAVING COUNT(*) >= 5;
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
				SELECT users.first_name, users.last_name, COUNT(*) as 'No. Of Courses'  
				FROM lecturer_courses
				LEFT JOIN users ON lecturer_courses.lecturer_id=users.user_id
				GROUP BY lecturer_courses.lecturer_id
				HAVING COUNT(*) >= 3;
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
				SELECT courses.course_code, courses.course_name, COUNT(*) as 'No. Of Students'  
				FROM student_courses
				JOIN courses ON student_courses.course_id=courses.course_id
				GROUP BY student_courses.course_id
				ORDER BY COUNT(*) DESC
				LIMIT 10;
			`;
      const data = await this.connection.query(query);
      return data;
    } catch (e) {
      console.error(`ERROR getLecturersWithManyCourses() ${e}`);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
