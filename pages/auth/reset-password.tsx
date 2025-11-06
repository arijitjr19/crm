import { Card, IconButton, InputAdornment, Typography } from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CustomInput from "@/ui/Inputs/CustomInput";
import { LoadingButton } from "@mui/lab";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import validationText from "@/json/messages/validationText";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useMutation } from "@tanstack/react-query";
import { setCookieClient } from "@/lib/functions/storage.lib";
import { useRouter } from "next/router";
import {
  resetPasswordMutation,
  setPasswordMutation,
  setPasswordPayload
} from "@/api/functions/user.api";
import { bgGradient } from "@/themes/css";
import { alpha, useTheme } from "@mui/material/styles";
import Logo from "@/components/logo/logo";

const StyledResetPasswordPage = styled(Box)`
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 40px;

  h2 {
    margin-top: 40px;
    margin-bottom: 40px;
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
  password: yup.string().trim().required(validationText.error.enter_password),
  reEnteredPassword: yup
    .string()
    .trim()
    .required(validationText.error.enter_password)
});

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const theme = useTheme();

  const methods = useForm({
    resolver: yupResolver(schema),
    // mode: "all",
    defaultValues: {
      password: "",
      reEnteredPassword: ""
      // role: "business",
      // manager_email: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordMutation,
    onSuccess: () => {
      router.push("/auth/employee/signin");
    }
  });

  const onSubmit = (data: Omit<setPasswordPayload, "verificationToken">) => {
    mutate({
      ...data,
      verificationToken: router.query.token as string
    });
  };

  return (
    <StyledResetPasswordPage
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
        <Typography variant="h2">Reset Password</Typography>
        {/* <Typography variant="h6">
          Or <Link href="/auth/signin">sign in to your account</Link>
        </Typography> */}
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420
          }}
        >
          <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
            <FormProvider {...methods}>
              <Stack spacing={3}>
                <CustomInput
                  name="password"
                  label="Password"
                  placeholder="********"
                  type="password"
                  size="small"
                  autoComplete="password"
                  fullWidth
                />

                <CustomInput
                  label="Confirm Password"
                  name="reEnteredPassword"
                  autoComplete="false"
                  size="small"
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <RemoveRedEyeIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
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
                  Set Password
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Card>
      </Stack>
    </StyledResetPasswordPage>
  );
}
