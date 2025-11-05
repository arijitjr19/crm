import { Box, Typography } from '@mui/material'
import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Error = ({error = "Oops, something went wrong."}: {error: any}) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, height: "70vh" }}>
            <ErrorOutlineIcon sx={{fontSize: 52, color: "#f25e5eff"}} />
            <Typography sx={{ color: "black", fontSize: 15 }}>{error ? error : "Oops, something went wrong."}</Typography>
        </Box>
    )
}

export default Error