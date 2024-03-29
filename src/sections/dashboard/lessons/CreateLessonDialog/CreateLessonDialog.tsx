import { useRouter } from "next/router";
import * as React from "react";
import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogActions, Stack, Tab, Tabs } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import {
  FormProvider,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  useSnackbar,
} from "@components";
import { useAddLessonToModuleMutation } from "src/redux/services/manager/modules-manager";
import { useTranslate } from "src/utils/translateHelper";

import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
} from "../../../../redux/services/manager/lessons-manager";
import { IntegrationsTab } from "../LessonStep/Modals/Preferences/IntegrationsTab";
import SkillsTab from "./SkillsTab";
import TipsTab from "./TipsTab";

interface FormValuesProps {
  name: string;
  description: string;
  active: boolean;
  tips: string;
  independent: boolean;
  type: "practical" | "exercise" | "quiz";
}

interface ICreateLessonDialogProps {
  defaultValues?: FormValuesProps;
  children: React.ReactElement;
  isEdit?: boolean;
  id?: string;
  contentId?: string;
  lessonTips: string[];
}

export default function CreateLessonDialog({
  id,
  isEdit,
  children,
  defaultValues,
  lessonTips,
}: ICreateLessonDialogProps): React.ReactElement {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const translate = useTranslate();

  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);

  const [editLesson, { isLoading: isLoadingUpdate }] =
    useUpdateLessonMutation();
  const [createLesson, { isLoading: isLoadingCreate }] =
    useCreateLessonMutation();
  const [addLessonToModule, { isLoading: isLoadingAdd }] =
    useAddLessonToModuleMutation();

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const CreateCourseSchema = Yup.object().shape({
    name: Yup.string().required(translate("required_name")),
    description: Yup.string().required(translate("required_description")),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreateCourseSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValuesProps): Promise<void> => {
    try {
      if (isEdit && id) {
        await editLesson({
          id,
          ...data,
          tips:
            data.tips.trim() !== "" ? [...lessonTips, data.tips] : lessonTips,
        }).unwrap();
        methods.resetField("tips");
      } else {
        const lesson = await createLesson({
          ...data,
        }).unwrap();
        if (router.query.module_id) {
          addLessonToModule({
            id: router.query.module_id as string,
            lesson_id: lesson.id,
          });
        }
        methods.reset();
      }
      enqueueSnackbar(
        !isEdit
          ? translate("messages_create_success")
          : translate("messages_update_success")
      );
    } catch (error: any) {
      enqueueSnackbar(error?.data?.message, {
        variant: "error",
      });
    }
    if (!isEdit) {
      handleClose();
    }
  };

  const deleteTip = async (tips: string[]): Promise<void> => {
    try {
      if (isEdit && id) {
        await editLesson({
          id,
          ...methods.getValues(),
          tips: lessonTips.filter((t) => !tips.includes(t)),
        }).unwrap();
        enqueueSnackbar(translate("messages_tip_deleted"));
      }
    } catch (error) {
      enqueueSnackbar(error?.data?.message, {
        variant: "error",
      });
    }
  };

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  return (
    <>
      <Box onClick={handleClickOpen}>{children}</Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEdit
            ? translate("lessons_edit_lesson")
            : translate("lessons_create_lesson")}
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <FormProvider
            methods={methods}
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 2 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label={translate("main")} {...a11yProps(0)} />
                <Tab label={translate("skills")} {...a11yProps(1)} />
                <Tab label={translate("integration")} {...a11yProps(2)} />
                {isEdit ? (
                  <Tab label={translate("tips")} {...a11yProps(3)} />
                ) : null}
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Stack gap={2} mt={1}>
                <RHFTextField
                  name="name"
                  label={translate("lessons_name")}
                  required
                />

                <RHFTextField
                  name="description"
                  label={translate("lessons_description")}
                  required
                  multiline
                  rows={3}
                />

                <RHFTextField
                  name="tips"
                  placeholder={translate("actions_enter_tip")}
                  label={translate("actions_add_tip")}
                />

                <RHFSelect native name="type" size="small">
                  <option key="practical" value="practical">
                    {translate("lessons_practical")}
                  </option>
                  <option key="exercise" value="exercise">
                    {translate("lessons_exercise")}
                  </option>
                </RHFSelect>

                <RHFSwitch name="active" label={translate("lessons_active")} />
                <RHFSwitch
                  name="independent"
                  label={translate("lessons_inependent_lesson")}
                />
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SkillsTab lessonId={id as string} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <IntegrationsTab contentId={id as string} />
            </TabPanel>
            {isEdit ? (
              <TabPanel value={value} index={3}>
                <TipsTab
                  tips={lessonTips ?? []}
                  deleteTip={deleteTip}
                  isLoading={isLoadingUpdate}
                />
              </TabPanel>
            ) : null}

            {value === 0 ? (
              <DialogActions>
                <Box
                  sx={{
                    mt: 14,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    {translate("actions_close")}
                  </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isLoadingAdd || isLoadingCreate || isLoadingUpdate}
                  >
                    {translate("actions_save")}
                  </LoadingButton>
                </Box>
              </DialogActions>
            ) : (
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
                      setOpen(false);
                    }}
                  >
                    {translate("actions_close")}
                  </Button>
                </Box>
              </DialogActions>
            )}
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
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
      {value === index && (
        <Box
          sx={{
            px: { xs: 2, sm: 3 },
            pt: 2,
            width: { xs: "320px", sm: "370px" },
            height: "320px",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number): Record<string, string> {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
