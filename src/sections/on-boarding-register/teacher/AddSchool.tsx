import { useRouter } from "next/router";
import { useEffect } from "react";

import { countries } from "@assets/data";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";

import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  useSnackbar,
} from "@components";
import { SchoolType } from "src/redux/services/enums/school-type.enum";
import {
  useGetMySchoolsQuery,
  useUpdateSchoolProfileMutation,
} from "src/redux/services/manager/schools-manager";

interface SchoolFormProps {
  schoolName: string;
  type: SchoolType;
  city: string;
  zip: string;
  country: string;
}

export default function AddSchool(): React.ReactElement {
  const { reload } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useGetMySchoolsQuery({});
  const [updateSchool, { isLoading: isUpdating }] =
    useUpdateSchoolProfileMutation();

  const CreateSchoolSchema = Yup.object().shape({
    schoolName: Yup.string().required("Name is required"),
    type: Yup.string().required("Choose type of school"),
    city: Yup.string().required("City your surname"),
    zip: Yup.string(),
    country: Yup.string().required("Choose school country"),
  });

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset({
        schoolName: data.data[0].name ?? "",
        type: data.data[0].type ?? SchoolType.Other,
        city: data.data[0].city ?? "",
        zip: data.data[0].zip ?? "",
        country: data.data[0].country ?? "",
      });
    }
  }, [isLoading]);

  const methods = useForm<SchoolFormProps>({
    resolver: yupResolver(CreateSchoolSchema),
    mode: "all",
    defaultValues: {
      schoolName: "",
    },
  });

  const onSubmit = async (schoolData: SchoolFormProps) => {
    try {
      await updateSchool({
        schoolId: data?.data[0].id as string,
        name: schoolData.schoolName,
        type: schoolData.type,
        zip: schoolData.zip,
        country: schoolData.country,
        city: schoolData.city,
      }).unwrap();
      localStorage.setItem("ON-BOARDING", "on-boarding");
      reload();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Stack direction="row" sx={{ ml: { xs: 3, sm: 3, md: 0 }, mt: 1 }}>
          <Typography
            variant="h3"
            sx={{ display: "flex", alignItems: "flex-end", gap: 2 }}
          >
            Add School{" "}
            <Typography sx={{ display: "inline-flex" }} variant="h2">
              🏫
            </Typography>
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ pb: 3, ml: { xs: 3, sm: 3, md: 0 } }}>
          This is the school name students see
        </Typography>
        <Stack gap={2}>
          <RHFTextField
            name="schoolName"
            label="School name"
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
          <RHFSelect
            native
            name="type"
            label="Type of School"
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
          >
            <option key="empty" value="empty"></option>

            {Object.keys(SchoolType).map((c) => (
              <option key={c} value={SchoolType[c as keyof typeof SchoolType]}>
                {c}
              </option>
            ))}
          </RHFSelect>
          <Stack direction="row" sx={{ gap: 2 }}>
            <RHFTextField
              name="city"
              label="City"
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
              name="zip"
              label="Zip code"
              type="number"
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
          </Stack>
          <RHFSelect
            native
            name="country"
            label="Country"
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
          >
            <option key="empty" value="empty"></option>
            <option key={"US"} value={"United States"}>
              United States
            </option>
            <option disabled>─────────────────────────</option>
            {countries
              .filter((el) => el.code !== "US")
              .map((country) => (
                <option key={country.code} value={country.label}>
                  {country.label}
                </option>
              ))}
          </RHFSelect>
        </Stack>
        <LoadingButton
          type="submit"
          sx={{
            background: "#43D4DD33",
            color: "#43D4DD",
            fontSize: "1.5rem",
            mt: 1,
            width: "100%",
          }}
          loading={isUpdating}
        >
          ALL DONE
        </LoadingButton>
      </FormProvider>
    </>
  );
}
