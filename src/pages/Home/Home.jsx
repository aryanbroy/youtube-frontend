import React, { useEffect, useRef, useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import styles from "./Home.module.css";
import { useInfiniteQuery } from '@tanstack/react-query'
import { useIntersection } from '@mantine/hooks'
import { Text, Paper, Box, MantineProvider } from '@mantine/core';
import { ColorRing } from 'react-loader-spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { FaPlay } from "react-icons/fa";
import Sidebar from '../../components/Sidebar/Sidebar';
import useFormatDate from '../../hooks/useFormatDate';
import { Skeleton } from '@mui/material';

export default function Home() {

    const [posts, setPosts] = useState([]);
    const [isPostsFetched, setIsPostsFetched] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("/api/videos/?page=1&limit=20")
                if (res.data.statusCode >= 400 || res.data.success === false) {
                    console.log(res.data.message);
                    return;
                }
                const { data } = res.data;
                data.docs.map((video) => {
                    const date = new Date(video.createdAt);
                    const formattedDate = useFormatDate(date);
                    video.uploadedTimeAgo = formattedDate;
                })
                setPosts(data.docs);
                setIsPostsFetched(true);
            } catch (error) {
                console.log(error)
                setIsPostsFetched(true);
            }
        }
        fetchData();
    }, [])

    const fetchPost = async (page) => {
        // console.log(page)
        try {
            const res = await axios.get(`/api/videos/?page=${page}&limit=20`);
            // console.log(res.data.data.docs)
            // if (res.data.data.docs[0] !== undefined) {
            //     setPosts([...posts, res.data.data.docs[0]]);
            // }
            // return res.data.data.docs;
            // console.log(posts.slice((page - 1) * 10, page * 10))
            // if (res.data.data.docs.length > 0) {
            //     setPosts([...posts, ...res.data.data.docs]);
            // }
            // return posts.slice((page - 1) * 10, page * 10);
            // return posts;
            setIsPostsFetched(true);
            const { data } = res.data;
            data.docs.map((video) => {
                const date = new Date(video.createdAt);
                const formattedDate = useFormatDate(date);
                video.uploadedTimeAgo = formattedDate;
            })
            return data.docs;
        } catch (error) {
            console.log(error)
            setIsPostsFetched(true)
        }
    }

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['query'],
        queryFn: async ({ pageParam = 1 }) => {
            const response = await fetchPost(pageParam);
            return response;
        },
        getNextPageParam: (_, pages) => {
            return pages.length + 1;
            // return pages.length * 10 < posts.length ? pages.length + 1 : undefined;
        },
        enabled: isPostsFetched,
        initialData: isPostsFetched ? {
            // pages: [posts.slice(0, 20)],
            pages: [],
            pageParams: [1],
        } : undefined
    });

    const lastPostRef = useRef(null);
    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    });

    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage();
        }
    }, [entry])

    const _posts = data?.pages.flatMap((page) => {
        return page
    });

    const increaseViews = async (post) => {
        const res = await axios.patch(`/api/videos/increase/view/${post?._id}`, {}, { withCredentials: true });
    }

    const handleVideoClick = async (post) => {

        navigate(`/watch/${post?._id}`);
        try {
            await Promise.all([increaseViews(post)]);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <MantineProvider>
                <div className={styles.mainDiv}>
                    <div className={styles.innerDiv}>
                        {_posts?.map((post, i) => {
                            // if (i === _posts.length) {
                            //     return <div key={post.id} ref={ref}>{post.title}</div>
                            // }
                            return (
                                <div key={post?._id} className={styles.individualVideoDiv} ref={ref} onClick={() => handleVideoClick(post)}>
                                    <Card sx={{ width: 375, backgroundColor: "#343434", boxShadow: "none" }} key={post?._id}>
                                        <div className={styles.cardMediaWrapper} key={post?._id}>
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
                                        <CardContent sx={{
                                            display: "flex",
                                            gap: "1rem",
                                            paddingLeft: '0',
                                            paddingRight: '0',
                                            paddingTop: "0.5rem",
                                        }}>
                                            <div>
                                                <img src={post?.channelOwner[0].avatar} alt="" style={{ width: "45px", borderRadius: "50%" }} />
                                            </div>
                                            <div>
                                                <Typography component="div" sx={{ color: "white", fontWeight: "900", fontSize: '20px' }}>
                                                    {post?.title}
                                                </Typography>
                                                <Typography component={"div"} variant="body2" color="text.secondary" sx={{ color: "white" }}>
                                                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                                                        <span style={{ color: "rgb(196, 195, 195)" }}>{post?.views} Views</span>
                                                        <span style={{ color: "rgb(196, 195, 195)" }}>•</span>
                                                        <span style={{ color: "rgb(196, 195, 195)" }}>{post?.uploadedTimeAgo}</span>
                                                    </div>
                                                </Typography>
                                                <span style={{ color: "rgb(196, 195, 195)", fontSize: "14px" }}>{post?.channelOwner[0].username}</span>
                                            </div>
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

                        {(isFetchingNextPage || !isPostsFetched) && (
                            // <ColorRing
                            //     visible={true}
                            //     height="80"
                            //     width="80"
                            //     ariaLabel="color-ring-loading"
                            //     wrapperStyle={{}}
                            //     wrapperClass="color-ring-wrapper"
                            //     colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                            // />
                            <div style={{ display: "flex", flexWrap: "wrap", gap: '2rem' }}>
                                {Array.from({ length: 8 }, (_, i) => (
                                    <div key={i}>
                                        <Skeleton animation="wave" variant="rounded" width={375} height={230} sx={{ borderRadius: '10px', backgroundColor: '#2c2c2c' }} />
                                        <div style={{ marginTop: '0.3rem', display: 'flex', gap: '1rem' }}>
                                            <Skeleton animation="wave" variant="circular" width={50} height={50} sx={{ fontSize: '1rem', backgroundColor: '#2c2c2c' }} />
                                            <div>
                                                <Skeleton animation="wave" variant="text" width={307} height={30} sx={{ fontSize: '1rem', backgroundColor: '#2c2c2c' }} />
                                                <Skeleton animation="wave" variant="text" width={307} height={23} sx={{ fontSize: '1rem', backgroundColor: '#2c2c2c' }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </MantineProvider>
        </>
    )
}
