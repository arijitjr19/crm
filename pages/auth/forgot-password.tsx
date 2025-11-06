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
  forgotPasswordMutatuion,
  forgotPasswordPayload
} from "@/api/functions/user.api";
import { bgGradient } from "@/themes/css";
import { alpha, useTheme } from "@mui/material/styles";
import Logo from "@/components/logo/logo";

const StyledForgotPasswordPage = styled(Box)`
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
  email: yup.string().email().trim().required(validationText.error.enter_email)
});

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const theme = useTheme();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: ""
    }
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPasswordMutatuion,
    onSuccess: () => {
      router.push("/auth/employee/signin");
    }
  });

  const onSubmit = (data: forgotPasswordPayload) => {
    mutate(data);
  };

  return (
    <StyledForgotPasswordPage
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
        <Typography variant="h2">Forgot Password</Typography>
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
              <Stack spacing={2}>
              <CustomInput
                name="email"
                label="Email"
                placeholder="johndoe@example.com"
                type="email"
                size="small"
                fullWidth
              />


                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={isPending}
                >
                  Submit
                </LoadingButton>
              </Stack>
            </FormProvider>
          </Box>
        </Card>
      </Stack>
    </StyledForgotPasswordPage>
  );
}
