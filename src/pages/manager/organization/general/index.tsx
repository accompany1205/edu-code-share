import Head from "next/head";
import { useState } from "react";

import SkeletonSchool from "@pages/manager/school/general/skeleton-school";
import { useSnackbar } from "notistack";

import { Box, Card, Container, Stack, Tab, Tabs } from "@mui/material";

import { Iconify, UploadImageModal, useSettingsContext } from "@components";
import DashboardLayout from "@layouts/dashboard";
import ContactsTab from "@sections/dashboard/organization/general/tabs/contacts/contacts";
import CustomizationTab from "@sections/dashboard/organization/general/tabs/customization/customization";
import SkeletonProfileOrg from "@sections/dashboard/organization/general/tabs/profile/SkeletonProfileOrg";
import UserProfileTab from "@sections/dashboard/organization/general/tabs/profile/profile";
import SettingsTab from "@sections/dashboard/organization/general/tabs/settings/settings";
import { ProfileCover } from "@sections/dashboard/user/profile";
import { useLocales } from "src/locales";
import {
  useGetOrganizationQuery,
  useUpdateOrgCoverMutation,
} from "src/redux/services/admin/organization-admin";

UserProfilePage.getLayout = (page: React.ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function UserProfilePage(): React.ReactElement {
  const { translate } = useLocales();
  const TABS = [
    {
      value: "profile",
      label: translate("organizations.general_page.tabs.labels.profile"),
      icon: <Iconify icon="ic:round-account-box" />,
      component: <UserProfileTab />,
    },
    {
      value: "settings",
      label: translate("organizations.general_page.tabs.labels.settings"),
      icon: <Iconify icon="ic:baseline-settings-applications" />,
      component: <SettingsTab />,
    },
    {
      value: "customization",
      label: `${translate(
        "organizations.general_page.tabs.labels.customization"
      )}`,
      icon: <Iconify icon="ic:round-dashboard-customize" />,
      component: <CustomizationTab />,
    },
    {
      value: "contacts",
      label: "Contacts",
      icon: <Iconify icon="ic:outline-contacts" />,
      component: <ContactsTab />,
    },
  ];
  const { enqueueSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState("profile");
  const { themeStretch } = useSettingsContext();
  const [uploadCoverOrgImage] = useUpdateOrgCoverMutation();
  const { data, isLoading } = useGetOrganizationQuery();

  const onUpload = async (data: File): Promise<void> => {
    try {
      const file = new FormData();
      file.append("file", data);
      await uploadCoverOrgImage({ file }).unwrap();
      enqueueSnackbar("Image updated");
    } catch (error: any) {
      enqueueSnackbar("Image not updated", { variant: "error" });
    }
  };
  if (isLoading) {
    return (
      <>
        <SkeletonSchool />
        <Container maxWidth={themeStretch ? false : "lg"}>
          <SkeletonProfileOrg />
        </Container>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>{`${translate("organizations.title")} | CodeTribe`}</title>
      </Head>
      <Container maxWidth={themeStretch ? false : "lg"}>
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: "relative",
          }}
        >
          <Stack
            sx={{
              position: "absolute",
              right: 0,
              zIndex: 10,
              mt: "10px",
              mr: "10px",
            }}
          >
            <UploadImageModal onUpload={onUpload} />
          </Stack>
          <ProfileCover
            name={data?.title ?? ""}
            cover={data?.cover}
            avatar={data?.avatar}
            email={data?.email}
          />
          <Tabs
            value={currentTab}
            onChange={(event, newValue) => {
              setCurrentTab(newValue);
            }}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: "absolute",
              bgcolor: "background.paper",
              "& .MuiTabs-flexContainer": {
                pr: { md: 3 },
                justifyContent: {
                  sm: "center",
                  md: "flex-end",
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                label={tab.label as string}
              />
            ))}
          </Tabs>
        </Card>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value}> {tab.component} </Box>
            )
        )}
      </Container>
    </>
  );
}
