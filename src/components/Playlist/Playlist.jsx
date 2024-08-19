import React, { useEffect, useState } from 'react'
import styles from "./Playlist.module.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useFormatDate from '../../hooks/useFormatDate';

export default function Playlist() {

    const [videosData, setVideosData] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const { playlistId } = useParams();
    const navigate = useNavigate();
    // console.log(videosData)

    const fetchPlaylistData = async () => {
        setIsFetching(true)
        try {
            const res = await axios.get(`/api/playlist/${playlistId}`, { withCredentials: true });
            const data = res.data;
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            const date = new Date(data.data.createdAt);
            data.data.playListCreatedTimeAgo = useFormatDate(date);
            data.data.videos.map((video) => {
                const date = new Date(video.createdAt);
                const formattedDate = useFormatDate(date);
                video.uploadedTimeAgo = formattedDate;
            })
            setVideosData(data.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsFetching(false);
        }
    }

    const fetchSubs = async () => {
        try {
            const res = await axios.get(`/api/subscriptions/c/${videosData?.owner?._id}`, { withCredentials: true })
            const data = res.data;
            setFollowers(data.data.length);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPlaylistData();
    }, [])

    useEffect(() => {
        if (videosData) {
            fetchSubs();
        }
    }, [videosData])

    const handleClick = async (post) => {
        navigate(`/watch/${post?._id}`);
        // try {
        //     const res = await axios.patch(`/api/videos/increase/view/${post?._id}`, {}, { withCredentials: true });
        // } catch (error) {
        //     console.log(error)
        // }
    }

    return (
        <>

            {videosData?.videos.length > 0 ? (
                <div className={styles.playListMainDiv}>
                    <div className={styles.leftDiv}>
                        <div className={styles.playlistCard}>
                            <div className={styles.imageContainer}>
                                <img className={styles.playlistImage} src={videosData?.videos[0]?.thumbnail} alt="" />
                            </div>
                            <div className={styles.playlistInfo}>
                                <div className={styles.playlistTitle}>{videosData?.name}</div>
                                <div className={styles.playlistMeta}>
                                    <span>100k Views</span>
                                    <span>•</span>
                                    <span>{videosData?.playListCreatedTimeAgo}</span>
                                </div>
                                <div className={styles.playlistVideos}>{videosData?.videos?.length} videos</div>
                            </div>
                        </div>
                        <div className={styles.descriptionDiv}>
                            <p className={styles.description}>{videosData?.description}</p>
                            <div className={styles.ownerDiv}>
                                <img className={styles.ownerImage} src={videosData?.owner?.avatar} alt="" />
                                <div>
                                    <p className={styles.ownerPara}>{videosData?.owner?.username}</p>
                                    <p className={styles.ownerPara}>{followers && `${followers} followers`} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightDiv}>
                        {videosData?.videos?.map((video, i) => (
                            <div key={i} onClick={() => handleClick(video)}>
                                <Card sx={{ display: 'flex', width: "100%", gap: "0.7rem", background: "transparent", boxShadow: "none", marginBottom: "1rem", "&:hover": { cursor: "pointer" } }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 250, height: 130, borderRadius: "8px" }}
                                        image={video?.thumbnail}
                                        alt="Live from space album cover"
                                    />
                                    <CardContent sx={{ flex: '1 0 auto', background: "transparent" }}>
                                        <Typography component="div" variant="h5" sx={{ color: "white" }}>
                                            {video?.title}
                                        </Typography>
                                        <Typography variant='subtitle1' component="p" sx={{ padding: "0", color: "rgba(255,255,255,0.9)", fontSize: "14px" }}>
                                            {video?.owner.username}
                                        </Typography>
                                        <div style={{ display: "flex", gap: "0.8rem" }}>
                                            <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                                                {video?.views} views
                                            </Typography>
                                            <Typography variant="subtitle1" component="p" sx={{ padding: "0", color: "#AAAAAA", fontSize: "14px" }}>
                                                {video?.uploadedTimeAgo}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !isFetching && (
                    <div style={{ display: "flex", justifyContent: "center", paddingTop: "9rem", paddingRight: '10rem' }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <img
                                className={styles.noVideoImg}
                                src='/images/islandQuality.png'
                                alt="empty_island"
                            />
                            <div className={styles.noVideoTextDiv}>
                                <h2 className={styles.noVideoHeading} >Looks so empty!</h2>
                                <p className={styles.noVideoPara}>Start adding some videos to remove this emptiness!</p>
                            </div>
                        </div>
                    </div>
                )
            )}
        </>
    )
}
