import React, { useState } from 'react';
import { getAdminDashboard } from '@/api/functions/admin.api';
import { Card, CircularProgress, Container, Grid, MenuItem, Select, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Box, Stack } from '@mui/system';
import AdminDashboardGraph from './AdminDashboardBarGraph';
import Loader from '../Loader';
import Error from '../Error';
import AdminDashboardHeatMap from './AdminDashboardHeatmap';

const Cockpit = () => {
  // const [filterByShiftGraph, setFilterByShiftGraph] = useState("yearly");

  const today = new Date();
  const date = `${today.getFullYear()}-${today.getMonth() + 1}`;

  const { data, isLoading, isError } = useQuery({
    enabled: !!date,
    queryKey: ['admin_dashboard', date],
    queryFn: () => getAdminDashboard(date)
  });

  console.log("Dashboard data===================>", data)

  if (isLoading) {
    return <Loader />
  }

  if (isError) {
    return <Error error={""} />
  }

  return (
    <Container>
      <Typography variant='h5' mb={2}>Dashboard</Typography>
      <Grid item xs={12} md={12} lg={12} display={"flex"} gap={2.5} flexWrap={"wrap"} mb={5}>
        {data && data?.kpis && data?.kpis?.length > 0 &&
          data?.kpis?.map((item: any, i: any) => (
            <Card key={i} sx={{ p: 3, width: "30%", backgroundColor: "var(--colorB4DFDD)" }}>
              <Typography variant='h6' mb={2} sx={{ color: "black" }}>{item?.label}</Typography>
              <Stack display={"flex"} flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
                <Box sx={{ width: 40, height: 40, borderRadius: 50, background: "rgba(0,0, 0, 0.05)", textAlign: "center", alignContent: "center" }}>
                  <Typography variant='h5' sx={{ color: "black" }}>{item?.current}</Typography>
                </Box>
                {item?.trend !== 2 && <Typography sx={{ color: item?.trend === 0 ? "green" : "red", fontSize: 12, fontWeight: 500 }}> ↑ {item?.trend === 0 ? "increase" : "decrease"} {item?.percentChange}%</Typography>}
              </Stack>
            </Card>
          ))}
      </Grid>

      <Typography variant='h6'>Analytics</Typography>
      <Box sx={{ p: 1, py: 2, mt: 1, width: "94%", backgroundColor: "white", borderRadius: 2, boxShadow: "0 0 10px 0 #eee" }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ marginBottom: 4, marginTop: 1.5 }}>
            <Typography sx={{ marginLeft: 5 }} variant='h6'>Shifts by yearly</Typography>
            <Typography sx={{ marginLeft: 5 }}>{today.getFullYear()}</Typography>
          </Box>
        </Box>
        <AdminDashboardGraph data={data?.shiftsByMonth} />
      </Box>


      <Box sx={{ p: 1, py: 2, mt: 4, width: "94%", backgroundColor: "white", borderRadius: 2, boxShadow: "0 0 10px 0 #eee" }}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ marginBottom: 4, marginTop: 1.5 }}>
            <Typography sx={{ marginLeft: 5 }} variant='h6'>Shifts by monthly</Typography>
            <Typography sx={{ marginLeft: 5 }}>{today.toLocaleString("default", { month: "long" })}</Typography>
          </Box>
        </Box>
        <AdminDashboardHeatMap data={data?.shiftsByDayCurrentMonth} />
      </Box>
    </Container>
  )
}

export default Cockpit