import { useEffect, useState } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";

import { Iconify, RHFTextField } from "@components";

interface Props {
  isSubmiting: boolean;
  isSubmitSuccessful: boolean;
  nextStep: () => void;
}

export default function AddTeacher({
  isSubmiting,
  isSubmitSuccessful,
  nextStep,
}: Props): React.ReactElement {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      nextStep();
    }
  }, [isSubmitSuccessful]);

  return (
    <>
      <Stack direction="row" sx={{ ml: { xs: 3, sm: 3, md: 0 }, mt: 3 }}>
        <Typography variant="h3">Register as Teacher</Typography>
      </Stack>
      <Typography
        variant="body1"
        sx={{ pb: 3, ml: { xs: 3, sm: 3, md: 0 }, mb: 4 }}
      >
        Get ready for awesome
      </Typography>
      <Stack gap={2}>
        <RHFTextField
          name="firstName"
          label="First Name"
          sx={(theme) => ({
            "& .MuiInputBase-root": {
              height: "52px",
              background: theme.palette.grey[200],
            },
            "& fieldset": { border: "none" },
            "& input:-webkit-autofill": {
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "#000",
              transition: "background-color 5000s ease-in-out 0s",
              boxShadow: `inset 0 0 .1px .1px ${theme.palette.grey[200]}`,
            },
          })}
        />
        <RHFTextField
          name="lastName"
          label="Surname"
          sx={(theme) => ({
            "& .MuiInputBase-root": {
              height: "52px",
              background: theme.palette.grey[200],
            },
            "& fieldset": { border: "none" },
            "& input:-webkit-autofill": {
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "#000",
              transition: "background-color 5000s ease-in-out 0s",
              boxShadow: `inset 0 0 .1px .1px ${theme.palette.grey[200]}`,
            },
          })}
        />
        <Divider sx={{ my: 1 }} />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          sx={(theme) => ({
            "& .MuiInputBase-root": {
              height: "52px",
              background: theme.palette.grey[200],
            },
            "& fieldset": { border: "none" },
            "& input:-webkit-autofill": {
              "-webkit-background-clip": "text",
              "-webkit-text-fill-color": "#000",
              transition: "background-color 5000s ease-in-out 0s",
              boxShadow: `inset 0 0 .1px .1px ${theme.palette.grey[200]}`,
            },
          })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                  edge="end"
                  sx={{ color: "#02D3D7" }}
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <LoadingButton
        type="submit"
        loading={isSubmiting}
        sx={{
          background: "#43D4DD33",
          color: "#43D4DD",
          fontSize: "1.5rem",
          mt: 2,
          width: "100%",
        }}
      >
        WHOOPIE
      </LoadingButton>
    </>
  );
}
