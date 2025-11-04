import {
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import { useEffect } from "react";

function formatTime(time: number[]) {
  if (!Array.isArray(time) || time.length < 2) return "Invalid time";
  const [hour, minute] = time;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

export default function ShiftDetails({ shiftdata }: any) {
  useEffect(() => {
    if (shiftdata) {
      console.log(
        "------------ :Shift Data in Shift_Details Screen: ------------",
        shiftdata[0]?.client?.displayName
      );
    }
  }, [shiftdata]);
  return (
    <Container sx={{ mt: 4 }}>
      {shiftdata && shiftdata.length > 0 ? (
        <Grid container spacing={3}>
          {/* Client Details Card */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Client Details
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>
                  Name: {shiftdata[0].client?.displayName}
                </Typography>
                <Typography>
                  Phone: {shiftdata[0].client?.clientMobileNumber}
                </Typography>
                <Typography>
                  Email: {shiftdata[0].client?.clientEmail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Carer Details Card */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Carer Details
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>
                  Name: {shiftdata[0].employee?.displayName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Instruction Card */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Instruction
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>
                  {shiftdata[0].instruction?.trim()
                    ? shiftdata[0].instruction
                    : "No instructions provided."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Time & Location Card */}
          <Grid item xs={12}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Time & Location
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography>
                  Start Time: {formatTime(shiftdata[0].startTime)}
                </Typography>
                <Typography>
                  End Time: {formatTime(shiftdata[0].endTime)}
                </Typography>
                <Typography>
                  Shift Date:{" "}
                  {new Date(shiftdata[0].startDate).toLocaleDateString("en-GB")}
                </Typography>
                <Typography>
                  Address: {shiftdata[0].address || "Not provided"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6" color="textSecondary">
          No shift data available.
        </Typography>
      )}
    </Container>
  );
}
