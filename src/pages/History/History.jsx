import React, { useEffect, useState } from 'react'
import styles from "./History.module.css"
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import SmallCard from '../../components/SmallCard/SmallCard';
import useFormatDate from '../../hooks/useFormatDate';

export default function History() {

    const [historyVideos, setHistoryVideos] = useState([]);

    const fetchWatchHistory = async () => {
        const res = await axios.get("/api/users/history", { withCredentials: true });
        const { data } = res.data;
        data.map((video) => {
            const createdAt = new Date(video.createdAt);
            video.uploadedTimeAgo = useFormatDate(createdAt)
        })
        setHistoryVideos(data)
    }

    useEffect(() => {
        window.scrollTo(0, 0)
        try {
            const fetchData = async () => {
                await Promise.all([fetchWatchHistory()])
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }
    }, [])
    return (
        <div className={styles.mainDiv}>
            <div className={styles.innerDiv}>
                <h1 className={styles.historyHeading}>Watch history</h1>
                <div className={styles.cardDiv}>

                    {historyVideos?.map((video, i) => (
                        // <Card key={i} sx={{ display: 'flex', alignItems: "start", width: "100%", gap: "0rem", background: "transparent", boxShadow: "none", marginBottom: "1rem" }}>
                        //     <CardMedia
                        //         component="img"
                        //         sx={{ width: 250, height: 130 }}
                        //         image={video?.thumbnail}
                        //         alt="Live from space album cover"
                        //     />
                        //     <CardContent sx={{ flex: '1 0 auto', background: "transparent", paddingTop: "0" }}>
                        //         <Typography component="div" variant="h5" sx={{ color: "white" }}>
                        //             {video?.title}
                        //         </Typography>
                        //         <div>
                        //             <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                        //                 {video?.owner.username}
                        //             </Typography>
                        //             <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                        //                 {video?.views} views
                        //             </Typography>
                        //         </div>
                        //         <Typography variant='subtitle1' component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                        //             {video?.description}
                        //         </Typography>
                        //     </CardContent>

                        // </Card>
                        <SmallCard key={i} video={video} />
                    ))}
                </div>
            </div>
        </div>
    )
}
