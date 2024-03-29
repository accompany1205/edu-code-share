import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Stack } from "@mui/system";

import { FormProvider, RHFTextField } from "@components";
import {
  useCreateSkillMutation,
  useUpdateSkillMutation,
} from "src/redux/services/manager/skills-manager";
import { useTranslate } from "src/utils/translateHelper";

const IntegrationSchema = Yup.object().shape({
  name: Yup.string().required("Skill name is required"),
  description: Yup.string().required("Description is required"),
});

interface Props {
  id?: string;
  defaultValues?: IntegrationForm;
  children: React.ReactElement;
}
interface IntegrationForm {
  name: string;
  description: string;
}

export default function UpdateModalSkills({
  children,
  id,
  defaultValues = {
    name: "",
    description: "",
  },
}: Props): React.ReactElement {
  const [createSkill, { isLoading: creatLoading }] = useCreateSkillMutation();
  const [updateSkill, { isLoading: updateLoading }] = useUpdateSkillMutation();
  const { enqueueSnackbar } = useSnackbar();
  const translate = useTranslate();

  const [open, setOpen] = useState(false);
  const handleOpen = (): void => {
    setOpen(true);
  };
  const handleClose = (): void => {
    setOpen(false);
  };
  const methods = useForm<IntegrationForm>({
    resolver: yupResolver(IntegrationSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;
  const onSubmit = async (data: IntegrationForm): Promise<void> => {
    try {
      if (id) {
        await updateSkill({
          id,
          name: data.name,
          description: data.description,
        }).unwrap();
      } else {
        await createSkill({
          name: data.name,
          description: data.description,
        }).unwrap();
      }
      methods.reset();
      handleClose();
      enqueueSnackbar(
        id ? translate("skills_updated_msg") : translate("skills_created_msg")
      );
    } catch (e: any) {
      enqueueSnackbar(translate("messages_error"), { variant: "error" });
    }
  };

  return (
    <>
      <div onClick={handleOpen}>{children}</div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ pb: 3 }}>{translate("skills")}</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={4}>
              <Box display="flex" flexDirection="column" gap={2} mb={3}>
                <RHFTextField placeholder={translate("name")} name="name" />
                <RHFTextField
                  name="description"
                  label={translate("skills_description")}
                  required
                  multiline
                  rows={3}
                />
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={handleClose}>
              {translate("actions_cancel")}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={creatLoading || updateLoading}
            >
              {translate("actions_save")}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
