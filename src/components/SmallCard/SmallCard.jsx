import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'

export default function SmallCard({ video }) {
    return (
        <Card sx={{ display: 'flex', alignItems: "start", width: "100%", gap: "0rem", background: "transparent", boxShadow: "none", marginBottom: "1rem" }}>
            <CardMedia
                component="img"
                sx={{ width: 250, height: 130 }}
                image={video?.thumbnail}
                alt="Live from space album cover"
            />
            <CardContent sx={{ flex: '1 0 auto', background: "transparent", paddingTop: "0" }}>
                <Typography component="div" variant="h5" sx={{ color: "white" }}>
                    {video?.title}
                </Typography>
                <div>
                    <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                        {video?.owner?.username || video?.username}
                    </Typography>
                    <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px", display: "flex", gap: "0.3rem", alignItems: "center" }}>
                        <span>{video?.views} views</span>
                        <span>•</span>
                        <span>{video?.description || video?.uploadedTimeAgo}</span>
                    </Typography>
                </div>
            </CardContent>

        </Card>
    )
}
