import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { CalendarModule } from './calendar/calendar.module';
import { ForumModule } from './forum/forum.module';
import { DiscussionModule } from './discussion/discussion.module';
import { ContentModule } from './content/content.module';
import { AssignmentModule } from './assignment/assignment.module';
import { ReportModule } from './report/report.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
