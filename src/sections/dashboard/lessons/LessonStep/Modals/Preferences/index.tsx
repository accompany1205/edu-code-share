import React, { useState } from "react";

import { javascript } from "@codemirror/lang-javascript";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";

import { FormProvider, ModalCodeFullscreen, RHFCode, RHFTextField } from "@components";
import { LessonContentComplexity } from "src/redux/services/enums/lesson-content-complexity.enum";
import { useUpdateLessonContentMutation } from "src/redux/services/manager/lesson-content-manager";

import { GeneralTab } from "./GeneralTab";

interface FormValuesProps {
  slug: string;
  title: string;
  description: string;
  active: boolean;
  draft: boolean;
  tags: string[];
  complexity: LessonContentComplexity;
  preload_body: string;
  solution_body: string;
}

const CreateLessonDemonSchema = Yup.object().shape({
  slug: Yup.string().required("Slug is required"),
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  skills: Yup.array(),
});

interface Props {
  children?: React.ReactElement;
  lessonId: string;
  contentId: string;
  defaultValues?: FormValuesProps;
  defaultTab?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): React.ReactElement {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number): Record<string, string> {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Preferences({
  children,
  lessonId,
  contentId,
  defaultValues = {
    active: false,
    draft: false,
    complexity: LessonContentComplexity.Beginner,
    slug: "",
    title: "",
    description: "",
    preload_body: "",
    solution_body: "",
    tags: [],
  },
  defaultTab = 0,
}: Props): React.ReactElement {
  const [open, setOpenDialog] = useState<boolean>( false);
  const [value, setValue] = useState(defaultTab);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  const { enqueueSnackbar } = useSnackbar();
  const [updateLessonContent, { isLoading }] = useUpdateLessonContentMutation();
  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreateLessonDemonSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValuesProps): Promise<void> => {
    try {
      await updateLessonContent({
        lessonId,
        ..._.omit(data, ["createdAt", "updatedAt", "cover"]),
        id: contentId,
      }).unwrap();
      enqueueSnackbar("Your step is udpated successfully");
      setOpenDialog(false);
    } catch (e) {
      enqueueSnackbar("sorry something went wrong", { variant: "error" });
    }
  };

  return (
    <>
      <Box
        onClick={() => {
          setOpenDialog(true);
        }}
      >
        {children}
      </Box>
      <Dialog
        fullWidth
        open={open}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <DialogTitle variant="h5" sx={{ pb: 1, pt: 2 }}>
          Lesson Step Preferences
        </DialogTitle>
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Box sx={{ width: "100%" }}>
            <DialogContent sx={{ p: 0, height: "470px" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 3 }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="General" {...a11yProps(0)} />
                  <Tab label="Solution" {...a11yProps(1)} />
                  <Tab label="Preload" {...a11yProps(2)} />
                  <Tab label="Tips" {...a11yProps(3)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <GeneralTab />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Box>
                  <ModalCodeFullscreen
                    title="This code would be hint for step"
                    name="solution_body"
                  />
                  <RHFCode
                    placeholder="This code would be hint for step"
                    name="solution_body"
                    height="350px"
                    extensions={[javascript({ jsx: true })]}
                  />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Box>
                  <ModalCodeFullscreen
                    title="This code will preload to work space"
                    name="preload_body"
                  />
                  <RHFCode
                    placeholder="This code will preload to work space"
                    name="preload_body"
                    height="350px"
                    extensions={[javascript({ jsx: true })]}
                  />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={3}>
                <RHFTextField
                  multiline
                  rows={3}
                  name="tips"
                  label="Tips"
                />
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  onClick={() => {
                    setOpenDialog(false);
                  }}
                >
                  Close
                </Button>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isLoading}
                >
                  Save
                </LoadingButton>
              </Box>
            </DialogActions>
          </Box>
        </FormProvider>
      </Dialog>
    </>
  );
}
