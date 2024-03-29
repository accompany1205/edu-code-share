import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { Container, Skeleton, Theme, useTheme } from "@mui/material";

import { useSettingsContext } from "@components";
import { StudentDashboardLayout } from "@layouts/dashboard";
import QuestDescription from "@sections/quest/QuestDescription";
import QuestHeader from "@sections/quest/QuestHeader";
import QuestMain from "@sections/quest/QuestMain";
import QuestRating from "@sections/quest/QuestRating";
import { useGetAssignmentStudentQuery } from "src/redux/services/manager/assignments-student";
import { useGetCoursQuery } from "src/redux/services/manager/courses-student";
import { useTranslate } from "src/utils/translateHelper";

Quest.getLayout = (page: React.ReactElement) => (
  <StudentDashboardLayout>{page}</StudentDashboardLayout>
);

export default function Quest(): React.ReactElement | null {
  const { query } = useRouter();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const containerSx = useMemo(() => getContainerSx(theme), [theme]);
  const skeletonSx = useMemo(() => getSkeletonSx(theme), [theme]);
  const { data, isLoading } = useGetAssignmentStudentQuery(
    { assignmentId: query.id as string },
    { skip: !query.id }
  );
  const translate = useTranslate();

  const { data: course, isLoading: isLoadingCourse } = useGetCoursQuery(
    { id: data?.course.id as string },
    { skip: !data?.course.id }
  );

  if (isLoading || !data) {
    return <Skeleton variant="rounded" height="600px" />;
  }

  return (
    <>
      <Head>
        <title>{translate("quest")} | CodeTribe</title>
      </Head>
      <Container maxWidth={themeStretch ? false : "lg"} sx={containerSx}>
        <QuestHeader />
        <QuestMain questName={data.name} />
        <QuestDescription description={data?.description} />
        {isLoadingCourse ? (
          <Skeleton variant="rounded" sx={skeletonSx} />
        ) : (
          <QuestRating
            courseId={course?.id ?? ""}
            courseName={course?.name ?? ""}
            progress={course?.progress ?? 0}
          />
        )}
      </Container>
    </>
  );
}

const getContainerSx = (theme: Theme) => ({
  borderRadius: 1,
  background:
    theme.palette.mode === "light"
      ? "rgba(243, 243, 243, 0.8)"
      : theme.palette.background.paper,
  pt: 2,
  pb: 8,
});

const getSkeletonSx = (theme: Theme) => ({
  height: "98px",
  mt: 3,
  background: theme.palette.mode === "light" ? "#fff" : "initial",
  borderRadius: 2,
});
