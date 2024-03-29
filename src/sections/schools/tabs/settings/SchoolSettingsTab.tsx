import React from "react";

import { Box } from "@mui/material";

import { useGetSchoolSettingsQuery } from "src/redux/services/manager/schools-manager";
import { useTranslate } from "src/utils/translateHelper";

import SettingsForm from "./SettingsForm";
import SkeletonSettingsTab from "./SkeletonSettingsTab";

interface Props {
  schoolId: string;
}

export default function SchoolSettingTab({
  schoolId,
}: Props): React.ReactElement | null {
  const { data, isLoading } = useGetSchoolSettingsQuery(
    { schoolId },
    { skip: !schoolId }
  );

  const translate = useTranslate();

  if (isLoading) return <SkeletonSettingsTab />;

  if (!data) return <>{translate("messages_no_data")}</>;

  return (
    <>
      <Box
        sx={{
          backgroundColor: "transparent !important",
          mb: 3,
          height: 420,
          position: "relative",
        }}
      >
        {isLoading ? null : (
          <SettingsForm settings={data} schoolId={schoolId} />
        )}
      </Box>
    </>
  );
}
