import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWrapper } from "../helpers/base_query_wrapper";
import { baseQueryWithAuth } from "../helpers/query_with_auth";

export const managerApi = createApi({
  reducerPath: "api/manager",
  baseQuery: baseQueryWithAuth(
    baseQueryWrapper(`${process.env.NEXT_PUBLIC_API_URL}`)
  ),
  tagTypes: [
    "ClassesStudentList",
    "CoursesManager",
    "School",
    "Students",
    "Classes",
    "SchoolSettings",
    "SchoolContacts",
    "Assignments",
    "Assignment",
    "Modules",
    "Lessons",
    "LessonsContent",
    "Courses",
    "CoursesList",
    "Tasks",
    "Skills",
    "LessonSkill",
    "LessonsContentValidation",
    "Integrations",
    "ContentIntegration",
    "LessonContentItem",
    "Mentors",
    "Author",
    "Pendings",
    "School",
    "Students",
    "ClassesStudent",
    "ClassesStudentProgress",
    "SchoolSettings",
    "SchoolContacts",
    "Assignments",
    "Assignment",
    "Modules",
    "Lessons",
    "Courses",
    "Tasks",
    "Challenges",
    "Progress",
    "Friends",
    "Profile",
    "Projects",
    "Socials",
    "Goal",
    "LastVisitedUnitAndLesson",
    "Media"
  ],
  endpoints: () => ({}),
});
