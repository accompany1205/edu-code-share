import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import _ from "lodash";
import { useForm } from "react-hook-form";
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from "unique-names-generator";
import * as Yup from "yup";

import { Stack } from "@mui/material";

import { FormProvider, useSnackbar } from "@components";
import { generateRandomEmoji } from "@utils";
import { useAuthContext } from "src/auth/useAuthContext";
import { Role } from "src/redux/services/enums/role.enum";
import { useTranslate } from "src/utils/translateHelper";

import { RegisterStudenTeacher, SingLink } from "../links";
import SingUp from "../teacher/SingUp";
import StepperInfo from "./StepperInfo";
import StepperProgres from "./StepperProgress";
import StepperRegister from "./StepperRegister";

interface FormValuesProps {
  email: string;
  firstName: string;
  username: string;
  lastName: string;
  password: string;
}

export default function StudentStepper(): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const { register } = useAuthContext();
  const [activeStep, setActiveStep] = useState(0);
  const translate = useTranslate();

  const nextStep = () => {
    setActiveStep(activeStep + 1);
  };
  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };
  const goToStep = (step: number) => {
    setActiveStep(step);
  };

  const randomUserName = `${uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "",
    length: 2,
    style: "capital",
  })}${_.random(10, 99)}`;

  const randomEmoji = generateRandomEmoji(true);

  const CreateRegisterSchema = Yup.object().shape({
    email: Yup.string()
      .required(translate("required_email"))
      .email(translate("must_be_valid_email")),
    firstName: Yup.string().required(translate("enter_name")),
    lastName: Yup.string().required(translate("enter_surname")),
    username: Yup.string().required(translate("enter_username")),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        translate("required_password_includes")
      )
      .min(10, translate("required_password_length")),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(CreateRegisterSchema),
    mode: "all",
    defaultValues: { username: randomUserName },
  });

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        role: Role.Student,
        emojiAvatar: randomEmoji,
      });
    } catch (error) {
      methods.setError("root", {
        ...error,
        message: error.message,
      });
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <Stack
      sx={{
        minHeight: "460px",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <RegisterStudenTeacher />
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        {activeStep === 0 && (
          <SingUp
            goToStep={goToStep}
            nextStep={nextStep}
            isValid={
              !methods.formState.errors.email &&
              methods.formState.dirtyFields.email
            }
            isTeacher={false}
          />
        )}
        {(activeStep === 1 || activeStep === 2) && (
          <StepperProgres activeStep={activeStep} prevStep={prevStep} />
        )}

        {activeStep === 1 && (
          <StepperRegister
            nextStep={nextStep}
            isSubmiting={methods.formState.isSubmitting}
            isSubmitSuccessful={methods.formState.isSubmitSuccessful}
          />
        )}
      </FormProvider>
      {activeStep === 2 && <StepperInfo />}
      <SingLink />
    </Stack>
  );
}
