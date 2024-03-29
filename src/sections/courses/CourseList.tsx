import { Stack } from "@mui/material";

import { EmptyContent, SimpleInfiniteList } from "@components";
import { DEFAULT_TAKE_PER_PAGE, FilterMode, useFilters } from "@hooks";
import { ICourseSearchParams } from "src/redux/interfaces/content.interface";
import { useGetCourseQuery } from "src/redux/services/manager/courses-student";
import { useGetPublicCourseQuery } from "src/redux/services/public-student";
import { useTranslate } from "src/utils/translateHelper";

import CoursesItem from "./course-list-item/CourseItem";
import SkeletonCourse from "./course-list-item/SkeletonCourse";

interface Props {
  publicPage?: boolean;
}

export default function CourseList({ publicPage }: Props): React.ReactElement {
  const { filters, setFilter } = useFilters<ICourseSearchParams>(
    {
      name: "",
      take: DEFAULT_TAKE_PER_PAGE,
    },
    FilterMode.global
  );
  const { data, isLoading, isFetching } = useGetCourseQuery(
    { take: DEFAULT_TAKE_PER_PAGE },
    { skip: publicPage }
  );
  const {
    data: publicData,
    isLoading: publicIsLoading,
    isFetching: publicFetching,
  } = useGetPublicCourseQuery(filters, { skip: !publicPage });

  const translate = useTranslate();

  const createSkeletonList = (): React.ReactElement[] => {
    return Array(DEFAULT_TAKE_PER_PAGE)
      .fill(null)
      .map((v, i) => <SkeletonCourse key={i + 14} />);
  };

  if ((!publicPage && isLoading) || (publicPage && publicIsLoading)) {
    return (
      <Stack direction="column" gap={3} sx={{ pb: 4 }}>
        {createSkeletonList()}
      </Stack>
    );
  }

  return (
    <SimpleInfiniteList
      hasNextPage={data?.meta.hasNextPage ?? false}
      onLoadMore={() => {
        if (data?.meta.take !== Number(filters?.take)) return;
        setFilter("take", Number(filters.take) + 10);
      }}
      loading={isLoading ?? isFetching}
    >
      <Stack direction="column" gap={3} sx={{ pb: 4 }}>
        {publicPage ? (
          publicFetching ? (
            <>{createSkeletonList()}</>
          ) : publicData?.data?.length ? (
            publicData?.data?.map((el) => (
              <CoursesItem course={el} key={el.id} />
            ))
          ) : (
            <EmptyContent title={translate("courses_empty")} />
          )
        ) : isFetching ? (
          <>{createSkeletonList()}</>
        ) : data?.data.length ? (
          data?.data?.map((el) => <CoursesItem course={el} key={el.id} />)
        ) : (
          <EmptyContent title={translate("messages_no_data")} />
        )}
      </Stack>
    </SimpleInfiniteList>
  );
}
