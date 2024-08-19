import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaPlay } from "react-icons/fa";
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import styles from "./Subscription.module.css";

export default function Subscription() {

    const [subscribedVideos, setSubscribedVideos] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const fetchSubscribedVideos = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`/api/subscriptions/getSubscriptionVideos`, { withCredentials: true });
            const data = res.data;
            // console.log(data);
            setSubscribedVideos(data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscribedVideos()
    }, [])

    const handleVideoClick = async (post) => {
        navigate(`/watch/${post?._id}`);
        try {
            const res = await axios.patch(`/api/videos/increase/view/${post?._id}`, {}, { withCredentials: true });
            const data = res.data;
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.mainDiv}>
            <div className={styles.innerDiv}>
                {subscribedVideos?.map((post, i) => {
                    return (
                        <div key={post?._id} className={styles.individualVideoDiv} onClick={() => handleVideoClick(post)}>
                            <Card sx={{ width: 375, backgroundColor: "#343434", boxShadow: "none" }} key={post?.id}>
                                <div className={styles.cardMediaWrapper}>
                                    <CardMedia
                                        sx={{ height: 230, borderRadius: "16px" }}
                                        image={post?.thumbnail}
                                        title={post?.title}
                                        className={styles.cardMedia}
                                    />
                                    <div className={styles.overlay}>
                                        <div className={styles.playDiv}>
                                            <FaPlay size={15} style={{ marginTop: "-2px" }} />
                                            <p className={styles.playPara}>Play</p>
                                        </div>
                                    </div>
                                </div>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ color: "white" }}>
                                        {post?.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ color: "white" }}>
                                        {post?.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </div>
                    )
                })}
            </div>
            <div className={styles.loadingDiv}>
                {/* {isFetchingNextPage
                            ? "Loding more.."
                            : (data?.pages.length ?? 0) < 3
                                ? "Load more"
                                : "Nothing to load"
                        } */}

                {(loading) && (
                    <ColorRing
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                    />
                )}
            </div>
        </div>
    )
}
