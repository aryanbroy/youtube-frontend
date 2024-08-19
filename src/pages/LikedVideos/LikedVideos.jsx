import React, { useEffect, useState } from 'react'
import styles from "./LikedVideos.module.css"
import axios from "axios"
import { toast } from 'react-toastify'
import SmallCard from '../../components/SmallCard/SmallCard';
import useFormatDate from '../../hooks/useFormatDate';

export default function LikedVideos() {

    const [likedVideos, setLikedVideos] = useState(null);

    useEffect(() => {
        const fetchLikedVideos = async () => {
            try {
                const res = await axios.get('/api/likes/videos', { withCredentials: true });
                const { data } = res.data;
                // console.log(data)
                data.map((video) => {
                    const createdAt = new Date(video.createdAt);
                    video.uploadedTimeAgo = useFormatDate(createdAt)
                })
                setLikedVideos(data)
            } catch (error) {
                // console.log(error)
                toast.error(error.response?.data.message || "Unable to fetch liked videos")
            }
        }
        fetchLikedVideos();
    }, [])

    return (
        <div className={styles.mainDiv}>
            <div className={styles.innerDiv}>
                <h1 className={styles.likeHeading}>Liked Videos</h1>
                <div className={styles.cardDiv}>
                    {likedVideos?.map((video, i) => (
                        <SmallCard key={i} video={video} />
                    ))}
                </div>
            </div>
        </div>
    )
}
