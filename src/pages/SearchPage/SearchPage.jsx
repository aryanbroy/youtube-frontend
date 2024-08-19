import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from "./SearchPage.module.css"
import { useQuery } from '../../hooks/useQuery'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'
import { Button, Skeleton } from '@mui/material'
import { HiOutlineDotsVertical } from "react-icons/hi";
import useFormatDate from '../../hooks/useFormatDate'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { IoIosShareAlt } from 'react-icons/io'
import { useSelector } from 'react-redux'
import SimpleDialog from '../../components/VideoPlayer/SimpleDialog'
import ShareDialog from '../../components/VideoPlayer/ShareDialog'

const SearchPage = () => {

    const { currentUser } = useSelector((state) => state.user);

    const [videoId, setVideoId] = useState(null);

    const query = useQuery();
    const searchQuery = query.get("query");
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [playlists, setPlaylists] = useState([]);
    const [showPlaylists, setShowPlaylists] = useState(false);
    const [showShareDialogOpen, setShowDialogOpen] = useState(false);
    const [videoLink, setVideoLink] = useState("");
    const handleAddPlaylistBtnClick = () => {
        handleMenuClose();
        setShowPlaylists(true);
    }

    const handleClose = () => {
        setShowPlaylists(false)
        setShowDialogOpen(false);
        playlists?.map((playlist) => playlist.videoAdded = false)
    }

    const handleShareBtnClick = () => {
        handleMenuClose();
        setShowDialogOpen(true)
    }

    const handleMenuClick = (e, videoId) => {
        setAnchorEl(e.currentTarget)
        setVideoId(videoId)
        const parsedUrl = new URL(window.location.href)
        setVideoLink(`${parsedUrl.origin}/watch/${videoId}`)
        playlists?.map((playlist) => {
            if (playlist.videos.some((video) => video._id === videoId)) {
                playlist.videoAdded = true;
            } else {
                playlist.videoAdded = false;
            }
        })
    }

    const handleMenuClose = (e) => {
        setAnchorEl(null)
    }


    const fetchVideos = async (page, query = searchQuery) => {
        const res = await axios.get(`/api/videos/?page=${page}&limit=10&query=${query}`);
        // data contains fields like nextPage, totalPages, etc and also an docs array which contains all videos
        const { data } = res.data;
        data.docs.map((video) => {
            if (video.description.length > 100) {
                video.description = video.description.slice(0, 100) + "...";
            }
            const date = new Date(video.createdAt);
            const formattedDate = useFormatDate(date);
            video.uploadedTimeAgo = formattedDate;
        })
        return data;
    }

    const { data, error, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ["items", searchQuery],
        queryFn: async ({ pageParam = 1 }) => await fetchVideos(pageParam, searchQuery),
        enabled: !!searchQuery,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const handleVideoClick = async (videoId) => {
        navigate(`/watch/${videoId}`)
    }

    const goToChannel = (channelId) => {
        navigate(`/channel/${channelId}`)
    }

    const fetchPlaylists = async () => {
        try {
            const res = await axios.get(`/api/playlist/user/${currentUser?._id}`, { withCredentials: true });
            const { data } = res.data;
            setPlaylists(data);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        if (currentUser) {
            fetchPlaylists();
        }
    }, [currentUser])

    return (
        status === "pending" ? (
            Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={styles.mainDiv}>
                    <div className={styles.innerDiv}>
                        <div className={styles.cardDiv}>
                            <div className={styles.imgDiv}>
                                <Skeleton animation="wave" variant='rounded' width={450} height={270} sx={{ borderRadius: "12px", backgroundColor: '#2c2c2c' }} />
                            </div>
                            <div className={styles.videoContents}>
                                <Skeleton animation="wave" variant='text' width={"100%"} height={40} sx={{ backgroundColor: '#2c2c2c' }} />
                                <Skeleton animation="wave" variant='text' width={"65%"} sx={{ backgroundColor: '#2c2c2c' }} />
                                <Skeleton animation="wave" variant='text' width={"45%"} sx={{ backgroundColor: '#2c2c2c' }} />
                            </div>
                        </div>
                    </div>
                </div>
            ))
        ) :
            status === 'error' ? <div>{error.message}</div> :
                <div className={styles.mainDiv}>
                    {data.pages.map((page, i) => (
                        <div key={i} className={styles.innerDiv}>
                            {page.docs.map((video, i) => (
                                <div key={i} className={styles.cardDiv}>
                                    <div className={styles.imgDiv}
                                        onClick={() => handleVideoClick(video._id)}
                                    >
                                        <img className={styles.videoThumbnail} src={video.thumbnail} alt="" />
                                    </div>
                                    <div className={styles.videoContents}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h4 className={styles.videoTitle} onClick={() => handleVideoClick(video._id)}>{video.title}</h4>
                                            <Button
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={(e) => handleMenuClick(e, video._id)}
                                                size='small'
                                                variant='text'
                                                style={{ maxWidth: '30px', maxHeight: '30px', minWidth: '30px', minHeight: '30px' }}
                                                sx={{
                                                    borderRadius: "50%",
                                                    padding: "0px",
                                                }}
                                            >
                                                <HiOutlineDotsVertical style={{ color: "white", fontWeight: "900" }} size={20} />
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleMenuClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button'
                                                }}
                                                sx={{
                                                    '& .MuiPaper-root': {
                                                        backgroundColor: "#343434",
                                                        color: "white",
                                                        boxShadow: "rgba(0, 0, 0, 0.06) 0px 2px 8px 0px"
                                                    }
                                                }}
                                            >
                                                <MenuItem onClick={() => handleAddPlaylistBtnClick()}>
                                                    <MdOutlinePlaylistAdd size={20} style={{ marginRight: '5px' }} /> Add to playlist
                                                </MenuItem>
                                                <MenuItem onClick={() => handleShareBtnClick()}>
                                                    <IoIosShareAlt size={20} style={{ marginRight: '5px' }} />Share
                                                </MenuItem>
                                            </Menu>
                                        </div>

                                        <div style={{ marginBottom: "6px" }} onClick={() => handleVideoClick(video._id)}>
                                            <span style={{ color: "rgb(196, 195, 195)", fontSize: "14px" }}>{video.views} views • {video.uploadedTimeAgo}</span>
                                        </div>

                                        <div className={styles.ownerInfo}>
                                            <img className={styles.ownerImg} src={video.channelOwner[0].avatar} alt="" />
                                            <p className={styles.videoOwnerName} onClick={() => goToChannel(video.owner)}>{video.channelOwner[0].username}</p>
                                        </div>

                                        <p className={styles.videoDescription} onClick={() => handleVideoClick(video._id)}>{video.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                    <SimpleDialog open={showPlaylists} onClose={handleClose} playlists={playlists} videoId={videoId} />
                    <ShareDialog shareDialogOpen={showShareDialogOpen} onShareClose={handleClose} href={videoLink} />
                    <div ref={ref}></div>
                </div>
    )
}

export default SearchPage
