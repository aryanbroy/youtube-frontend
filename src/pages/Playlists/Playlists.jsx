import React, { useEffect, useState } from 'react';
import styles from "./Playlists.module.css"
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/material'

export default function Playlists() {

    const { currentUser } = useSelector((state) => state.user);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [isFetchingPlaylists, setIsFetchingPlaylists] = useState(false);
    // console.log(userPlaylists)
    const navigate = useNavigate();

    const fetchPlaylists = async () => {
        setIsFetchingPlaylists(true)
        try {
            const res = await axios.get(`/api/playlist/user/${currentUser?._id}`, { withCredentials: true });
            const data = res.data;
            setUserPlaylists(data.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsFetchingPlaylists(false)
        }
    }

    useEffect(() => {
        if (currentUser) {
            fetchPlaylists();
        }
    }, [])

    const handleClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    }

    return (
        <>
            {currentUser ? (
                <div className={styles.playlistMainDiv}>
                    {isFetchingPlaylists ? (
                        Array.from({ length: 20 }, (_, i) => (

                            <Skeleton key={i} animation="wave" variant="rounded" width={350} height={240} sx={{ borderRadius: '10px', backgroundColor: '#2c2c2c' }} />
                        ))
                    ) : (

                        userPlaylists?.map((playlist, i) => (
                            <div className={styles.playlistCard} key={i} onClick={() => handleClick(playlist?._id)}>
                                <div className={styles.imageContainer}>
                                    <img className={styles.playlistImage} src={playlist?.videos[0]?.thumbnail} alt="" />
                                    <div className={styles.overlay}></div>
                                </div>
                                <div className={styles.playlistInfo}>
                                    <div className={styles.playlistTitle}>{playlist?.name}</div>
                                    <div className={styles.playlistMeta}>
                                        <span>100k Views</span>
                                        <span>•</span>
                                        <span>18 hours ago</span>
                                    </div>
                                    <div className={styles.playlistVideos}>{playlist?.videos?.length} videos</div>
                                </div>
                            </div>
                        ))

                    )}
                </div>
            ) : (
                <div>
                    <h1>Please sign in to view your playlists</h1>
                </div>
            )}
        </>
    )
}
