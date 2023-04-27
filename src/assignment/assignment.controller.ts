import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'mysql2';

@Controller('assignment')
export class AssignmentController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Post('/:student_id/:assignment_id/submit')
  async submitAssignment(
    @Param('student_id') studentId: number,
    @Param('assignment_id') assignmentId: number,
    @Body() body: { submission_content: string },
  ) {
    const { submission_content } = body;
    const query = `
      INSERT INTO submissions (assignment_id, student_id, submission_content)
      VALUES (?, ?, ?);
    `;
    await this.connection.query(query, [
      assignmentId,
      studentId,
      submission_content,
    ]);
    return { message: 'Assignment submitted successfully' };
  }

  @Put('/submit-grade-for-student')
  async submitGradeForStudent(
    @Body() body: { grade: number; submission_id: number },
  ) {
    const { grade, submission_id } = body;
    const query = `
      UPDATE submissions 
      SET grade = ?
      WHERE submission_id = ?;
    `;
    await this.connection.query(query, [grade, submission_id]);
    return { message: 'Grade submitted successfully' };
  }
}
