import React, { useEffect, useState } from 'react'
import styles from './YourChannel.module.css'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardContent, CardMedia, Menu, MenuItem, TextField, Typography } from '@mui/material'
import { FaPlay } from 'react-icons/fa';
import useFormatDate from '../../hooks/useFormatDate';
import Tweet from '../../components/Tweet/Tweet';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from 'react-toastify';


export default function YourChannel() {
    const [isOwner, setIsOwner] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const { channelId } = useParams();
    const [channelDetails, setChannelDetails] = useState(null);
    // const [isFetching, setIsFetching] = useState(false);
    const [buttonSelected, setButtonSelected] = useState("video");
    const [channelVideos, setChannelVideos] = useState(null);
    const [subscribers, setSubscribers] = useState(null)
    const [subscribedTo, setSubscribedTo] = useState(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState({});
    const [followerSearchValue, setFollowerSearchValue] = useState("");
    const [filteredValues, setFilteredValues] = useState(null);
    const [videoId, setVideoId] = useState(null)

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleButtonClick = (e) => {
        setButtonSelected(e.target.id);
    }

    useEffect(() => {
        setButtonSelected("videos")
    }, [])

    const isSubscribed = (subscriberId) => {
        return subscribedTo?.some((sub) => sub.channel === subscriberId)
    }

    useEffect(() => {
        const status = {};
        subscribers?.forEach((subscriber) => {
            status[subscriber.subscriber._id] = isSubscribed(subscriber.subscriber._id);
        })
        setSubscriptionStatus(status)
    }, [subscribers, subscribedTo])

    const fetchSubscribers = async () => {
        try {
            const res = await axios.get(`/api/subscriptions/c/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            setSubscribers(data)
            setFilteredValues(data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSubscribedChannels = async () => {
        try {
            const res = await axios.get(`/api/subscriptions/u/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            setSubscribedTo(data);
        } catch (error) {
            console.log(error)
        }
    }

    const fetchChannelVideos = async () => {
        try {
            const res = await axios.get(`/api/dashboard/videos/${channelId}`, { withCredentials: true });
            const { data } = res.data;
            // console.log(res.data);
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            data.map((video) => {
                const date = new Date(video.createdAt);
                const formattedDate = useFormatDate(date);
                video.uploadedTimeAgo = formattedDate;
            })
            setChannelVideos(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (channelId && currentUser?._id === channelId) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [channelId, currentUser]);

    const fetchChannelDetails = async () => {
        try {
            const res = await axios.get(`/api/users/${channelId}`, { withCredentials: true });
            const data = res.data;
            // console.log(data)

            setChannelDetails(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (channelId) {
            fetchChannelDetails();
            fetchChannelVideos();
            fetchSubscribers();
            fetchSubscribedChannels();
        }
    }, [channelId])

    const handleSubscription = async (channelId) => {
        setSubscriptionStatus({ ...subscriptionStatus, [channelId]: !subscriptionStatus[channelId] })
        try {
            const res = await axios.post(`/api/subscriptions/c/${channelId}`, {}, { withCredentials: true });
            const { data } = res.data;
        } catch (error) {
            console.log(error)
        }
    }

    const handleFollowerSearch = (e) => {
        setFollowerSearchValue(e.target.value);
        setFilteredValues(subscribers?.filter((subscriber) => subscriber.subscriber.username.toLowerCase().includes(e.target.value.toLowerCase())))
    }

    const handleMenuClose = (e) => {
        setAnchorEl(null)
    }

    const handleMenuClick = (e, videoId) => {
        setAnchorEl(e.currentTarget)
        setVideoId(videoId)
    }

    const handleEditBtnClick = () => {
        setAnchorEl(null);
        console.log(videoId)
    }

    const handleVideoDeleteBtnClick = async () => {
        setAnchorEl(null);
        setChannelVideos(channelVideos.filter((video) => video._id !== videoId));
        try {
            const res = await axios.delete(`/api/videos/${videoId}`, { withCredentials: true });
            const data = res.data;
            toast.success(data.message, {
                position: 'top-center',
                style: {
                    backgroundColor: '#343434',
                }

            })
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error deleting video");
        }
    }

    return (
        <>
            <div className={styles.upperDiv}>
                {(channelId && channelDetails) ? (
                    <>
                        <div className={styles.innerDiv}>
                            <img src={channelDetails?.coverImage || ""} className={styles.channelCover} />
                            <div className={styles.channelDetailsDiv}>
                                <img src={channelDetails?.avatar} alt="" className={styles.channelAvatar} />
                                <div className={styles.channelDetails}>
                                    <h1 className={styles.channelHeading}>{channelDetails?.fullName}</h1>
                                    <p className={styles.channelUsernamePara}>@{channelDetails?.username}</p>
                                    <div className={styles.playlistMeta}>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>{subscribers && subscribers.length} subscribers</span>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>•</span>
                                        <span style={{ color: "rgb(196, 195, 195)" }}>{subscribedTo && subscribedTo.length} subscribed</span>
                                    </div>
                                    <div className={styles.buttonDiv}>
                                        {isOwner ? (
                                            <>
                                                <Button variant="contained" sx={{
                                                    borderRadius: "20px", textTransform: "none", backgroundColor: "rgba(48,48,48, 0.8)", boxShadow: "none", color: "white", '&:hover': {
                                                        backgroundColor: 'rgba(48,48,48, 0.2)',
                                                    },
                                                }}>Customize channel</Button>
                                                <Button variant="contained" sx={{
                                                    borderRadius: "20px", textTransform: "none", backgroundColor: "rgba(48,48,48, 0.8)", boxShadow: "none", color: "white", '&:hover': {
                                                        backgroundColor: 'rgba(48,48,48, 0.2)',
                                                    },
                                                }}>Manage videos</Button>
                                            </>
                                        ) : (

                                            <Button variant="contained" sx={{
                                                fontWeight: 900, backgroundColor: "white", color: "black", borderRadius: "20px", '&:hover': {
                                                    opacity: "0.8",
                                                    backgroundColor: "white"
                                                }
                                            }}>Subscribe</Button>

                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.userButtons}>
                                <Button variant="text" className={buttonSelected === "videos" ? styles.active : ""} id='videos' onClick={handleButtonClick} sx={{
                                    fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                        opacity: "0.8",
                                        backgroundColor: "white",
                                        color: "black"
                                    }
                                }}>Videos</Button>
                                <Button variant="text" className={buttonSelected === "tweets" ? styles.active : ""} id='tweets' onClick={handleButtonClick} sx={{
                                    fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                        opacity: "0.8",
                                        backgroundColor: "white",
                                        color: "black"
                                    }
                                }}>Tweets</Button>
                                {currentUser?._id === channelId && (
                                    <Button variant="text" id='followings' className={buttonSelected === "followings" ? styles.active : ""} onClick={handleButtonClick} sx={{
                                        fontWeight: 900, width: "250px", color: "#e0dede85", '&:hover': {
                                            opacity: "0.8",
                                            backgroundColor: "white",
                                            color: "black"
                                        }
                                    }}>Followings</Button>
                                )}
                            </div>
                        </div>
                        {buttonSelected === "videos" && (
                            <div className={styles.cardContainer}>
                                {!channelVideos || channelVideos?.length === 0 ? (
                                    <div>
                                        <p>No videos by this user</p>
                                    </div>
                                ) : (
                                    channelVideos && channelVideos?.map((video, i) => (
                                        <div key={i} className={styles.individualVideoDiv}>
                                            <Card sx={{ width: 360, backgroundColor: "#343434", boxShadow: "none" }}>
                                                <div className={styles.cardMediaWrapper}>
                                                    <CardMedia
                                                        sx={{ height: 210 }}
                                                        image={video?.thumbnail}
                                                        className={styles.cardMedia}
                                                    />
                                                    <div className={styles.overlay}>
                                                        <div className={styles.playDiv}>
                                                            <FaPlay size={15} style={{ marginTop: "-2px" }} />
                                                            <p className={styles.playPara}>Play</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <CardContent sx={{ padding: "0", paddingTop: '8px', paddingRight: '5px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <Typography gutterBottom variant="h5" component="div" sx={{ color: "white", fontSize: "22px" }}>
                                                            {video?.title}
                                                        </Typography>
                                                        <Button
                                                            style={{ maxWidth: '35px', maxHeight: '35px', minWidth: '35px', minHeight: '35px' }}
                                                            sx={{
                                                                borderRadius: "50%",
                                                                padding: "0px",
                                                                '&:hover': {
                                                                    backgroundColor: "rgba(255,255,255,0.1)",
                                                                }
                                                            }}
                                                            onClick={(e) => handleMenuClick(e, video?._id)}
                                                        >
                                                            <HiOutlineDotsVertical style={{ color: 'white' }} size={20} />
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
                                                                    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px'
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    textAlign: 'left'
                                                                }}
                                                                onClick={() => handleEditBtnClick()}
                                                            >
                                                                <FiEdit style={{ marginRight: '8px' }} size={18} /> Edit
                                                            </MenuItem>
                                                            <MenuItem
                                                                style={{ color: 'red', display: 'flex', alignItems: 'center', textAlign: 'left' }}
                                                                onClick={() => handleVideoDeleteBtnClick()}
                                                            >
                                                                <RiDeleteBinLine style={{ marginRight: '8px' }} size={18} /> Delete
                                                            </MenuItem>
                                                        </Menu>
                                                    </div>
                                                    <Typography component={"div"} variant="body2" color="text.secondary" sx={{ color: "white", padding: "0" }}>
                                                        <div className={styles.playlistMeta}>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>{video?.views} Views</span>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>•</span>
                                                            <span style={{ color: "rgb(196, 195, 195)" }}>{video?.uploadedTimeAgo}</span>
                                                        </div>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        {buttonSelected === "tweets" && (
                            <Tweet />
                        )}
                        {buttonSelected === "followings" && (
                            <>
                                {/* <input type="text" name="search" id="" placeholder='Search' value={followerSearchValue} onChange={handleFollowerSearch} /> */}


                                <TextField id="outlined-basic" placeholder='Search' variant="outlined" value={followerSearchValue} onChange={handleFollowerSearch}
                                    InputProps={{ sx: { border: "1px #848482 solid", padding: "0" } }}
                                    sx={{
                                        padding: "0",
                                        "& .MuiInputLabel-outlined": {
                                            color: "#A9A9A9",
                                            fontWeight: "bold",
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& .MuiInputBase-input': {
                                                color: 'white',
                                            },
                                            '& .MuiInputBase-input::placeholder': {
                                                color: '#A9A9A9',
                                                opacity: 1,
                                            },
                                            '& .MuiOutlinedInput-input': {
                                                padding: "8px",
                                            },
                                        },
                                    }}
                                />


                                {(!subscribers || subscribers?.length === 0) && (!subscribedTo || subscribedTo?.length === 0) ? (
                                    <p>No followers</p>
                                ) : (
                                    filteredValues && filteredValues?.map((subscriber, i) => (
                                        <div key={i} className={styles.followingsDiv}>
                                            <div className={styles.singleFollowing}>
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    <img src={subscriber?.subscriber?.avatar} style={{ width: "40px", borderRadius: "50%" }} />
                                                    <p>{subscriber?.subscriber?.username}</p>
                                                </div>

                                                <Button variant='contained' className={subscriptionStatus[subscriber?.subscriber?._id] ? styles.subscribed : ""} onClick={() => handleSubscription(subscriber?.subscriber?._id)}>{subscriptionStatus[subscriber?.subscriber?._id] ? "Subscribed" : "Subscribe"}</Button>
                                            </div>
                                        </div>
                                    ))
                                )
                                }
                            </>
                        )}
                    </>
                ) : (
                    <p>Create account</p>
                )}
            </div >
        </>
    )
}
