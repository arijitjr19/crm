import { Box, CircularProgress, Typography } from '@mui/material'
import React from 'react'

const Loader = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, height: "70vh"}}>
            <CircularProgress />
            <Typography sx={{ color: "black", fontSize: 14 }}>Fetching data..</Typography>
        </Box>
    )
}

export default Loader