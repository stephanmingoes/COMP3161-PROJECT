import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { CalendarModule } from './calendar/calendar.module';
import { ForumModule } from './forum/forum.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ContentModule } from './content/content.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ReportModule } from './report/report.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    AuthModule,
    CourseModule,
    CalendarModule,
    ForumModule,
    DiscussionModule,
    ContentModule,
    AssignmentModule,
    ReportModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '@tomic2001',
      database: 'course_management',
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
