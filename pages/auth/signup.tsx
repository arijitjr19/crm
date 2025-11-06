import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { useState } from "react";
import {
  signupMutation,
  signupMutationPayload
} from "@/api/functions/user.api";
import Logo from "@/components/logo/logo";
import { useAppSelector } from "@/hooks/redux/useAppSelector";
import validationText from "@/json/messages/validationText";
import { setCookieClient } from "@/lib/functions/storage.lib";
import { bgGradient } from "@/themes/css";
import CustomInput from "@/ui/Inputs/CustomInput";
import styled from "@emotion/styled";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
// ----------------------------------------------------------------------

const StyledSignUpPage = styled(Box)`
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 40px;

  h6 {
    margin-bottom: 40px;
    a {
      color: inherit;
    }
  }

  .MuiToggleButton-root {
    letter-spacing: normal;
    &.Mui-selected {
      svg {
        color: #3b719f;
      }
    }
  }

  .more-info {
    font-size: 14px;
    margin-top: 15px;
    margin-bottom: 20px;
    .MuiTypography-root {
      font-size: inherit;
    }

    a {
      text-decoration: none;
    }
  }

  .MuiButton-root {
    letter-spacing: normal;
  }
`;

const schema = yup.object().shape({
  name: yup.string().trim().required(validationText.error.fullName),
  company: yup.string().trim().required(validationText.error.company_name),
  email: yup
    .string()
    .trim()
    .email(validationText.error.email_format)
    .required(validationText.error.enter_email)
  // role: yup.string().required(validationText.error.role),
  // manager_email: yup.string().when("role", {
  //   is: "employee",
  //   then: yup
  //     .string()
  //     .trim()
  //     .email(validationText.error.email_format)
  //     .required(validationText.error.enter_email)
  // })
});

export default function LoginView() {
  const { isLoggedIn } = useAppSelector((s) => s.userSlice);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(schema),
    // mode: "all",
    defaultValues: {
      email: "",
      name: "",
      company: ""
      // role: "business",
      // manager_email: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signupMutation,
    onSuccess: () => {
      methods.reset();
    }
  });

  const theme = useTheme();

  const handleSignup = (data: signupMutationPayload) => {
    mutate(data);
  };

  return (
    <StyledSignUpPage
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.4),
          imgUrl: "/assets/background/overlay-4.jpg"
        })
      }}
    >
      <Logo
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 }
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Typography variant="h2">Create a new account</Typography>
        <Typography variant="h6">
          Or <Link href="/auth/employee/signin">sign in to your account</Link>
        </Typography>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          <Box component="form" onSubmit={methods.handleSubmit(handleSignup)}>
            <FormProvider {...methods}>
              <Stack spacing={3}>
                <CustomInput
                  name="name"
                  label="Full name"
                  placeholder="Enter your full name"
                  size="small"
                  type="text"
                  sx={{width: "100%"}}
                />
                <CustomInput
                  label="Email Address"
                  name="email"
                  placeholder="Enter you email address"
                  type="email"
                  size="small"
                  sx={{width: "100%"}}
                />
                <CustomInput
                  label="Company Name"
                  type="text"
                  name="company"
                  placeholder="Enter your company name"
                  size="small"
                  sx={{width: "100%"}}
                />
                {/* <Controller
                control={control}
                name="role"
                render={({
                  field: { value, onChange },
                  fieldState: { error, invalid }
                }) => (
                  <>
                    <FormLabel>Choose your Account Type</FormLabel>
                    <ToggleButtonGroup
                      value={value}
                      exclusive
                      onChange={(_, newAlignment) => {
                        if (newAlignment !== null) {
                          onChange(newAlignment);
                        }
                      }}
                    >
                      <ToggleButton value="business">
                        <BusinessCenterIcon
                          fontSize="small"
                          sx={{ marginRight: "5px" }}
                        />
                        <Typography>Business</Typography>
                      </ToggleButton>
                      <ToggleButton value="employee">
                        <PersonIcon
                          fontSize="small"
                          sx={{ marginRight: "5px" }}
                        />
                        <Typography>Employee</Typography>
                      </ToggleButton>
                    </ToggleButtonGroup>
                    {invalid && (
                      <FormHelperText sx={{ color: "#FF5630" }}>
                        {error?.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
              {watch("role") === "employee" && (
                <Controller
                  control={control}
                  name="manager_email"
                  render={({
                    field: { value, onChange },
                    fieldState: { invalid, error }
                  }) => (
                    <CustomInput
                      label="Manager Email"
                      placeholder="Enter your manager email"
                      type="email"
                      size="small"
                      value={value}
                      onChange={onChange}
                      error={invalid}
                      helperText={error?.message}
                    />
                  )}
                />
              )} */}

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isPending}
                >
                  Sign Up
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Card>
      </Stack>
    </StyledSignUpPage>
  );
}
