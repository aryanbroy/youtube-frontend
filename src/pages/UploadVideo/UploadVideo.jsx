import React, { useEffect, useRef, useState } from 'react'
import styles from './UploadVideo.module.css'
import { Button, TextField } from '@mui/material'
import Textarea from '@mui/joy/Textarea'
import { IoCloudUploadOutline } from "react-icons/io5";
import { PiImageDuotone } from "react-icons/pi";
import ReactPlayer from 'react-player';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';


const UploadVideo = () => {

    const thumbnailRef = useRef(null);
    const videoRef = useRef(null);

    const [inputDetails, setInputDetails] = useState({})

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailSrc, setThumbnailSrc] = useState(null);

    const [videoFile, setVideoFile] = useState(null);
    const [videoSrc, setVideoSrc] = useState(null);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null);

    const handleThumbnailClick = (e) => {
        const file = e.target.files[0]
        setThumbnailFile(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setThumbnailSrc(imageUrl);
        }
    }

    const thumbnailDivStyling = {
        background: thumbnailSrc ? `url(${thumbnailSrc})` : 'none',
        border: thumbnailSrc && '1px solid rgba(255,255,255,0.6)',
    }

    const uploadVideoBtnClick = (e) => {
        const file = e.target.files[0];
        setVideoFile(file);
        if (file) {
            const videoUrl = URL.createObjectURL(file);
            setVideoSrc(videoUrl)
        }
    }

    const videoDivStyling = {
        border: '1px dashed rgba(255, 255, 255, 0.5)'
    }

    const handleInputChange = (e) => {
        setInputDetails({ ...inputDetails, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('/api/videos/', {
                title: inputDetails?.title,
                description: inputDetails?.description,
                videoFile: videoFile,
                thumbnail: thumbnailFile
            },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            // const data = res.data;
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Something went wrong while upoloading the video")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.mainDiv}>
            <div className={styles.innerDiv}>
                <div className={styles.headingDiv}>
                    <h1 className={styles.uploadHeading}>Details</h1>
                </div>
                <div className={styles.formDiv}>
                    <form
                        className={styles.form}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.upperDiv}>
                            <div className={styles.leftDiv}>
                                <Textarea
                                    name='title'
                                    onChange={handleInputChange}
                                    minRows={3}
                                    id="outlined-basic"
                                    placeholder='Title'
                                    variant="outlined"
                                    sx={{
                                        background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)",
                                        '&:hover': {
                                            color: "white",
                                            border: "1px solid white",
                                        },
                                        '--Textarea-focusedInset': 'none',
                                    }}
                                />
                                <Textarea
                                    name='description'
                                    onChange={handleInputChange}
                                    minRows={5}
                                    placeholder='Description'
                                    size="lg"
                                    variant="outlined"
                                    sx={{
                                        background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.6)",
                                        '&:hover': {
                                            color: "white",
                                            border: "1px solid white",
                                        },
                                        '--Textarea-focusedInset': 'none',
                                    }}
                                />
                            </div>
                            <div className={styles.rightDiv}>
                                <div className={styles.videoDiv} style={videoDivStyling}>
                                    {videoSrc ? (
                                        <div className={styles.videoContainer}>
                                            <ReactPlayer url={videoSrc} controls width={"100%"} height={"100%"} />
                                        </div>
                                    ) : (
                                        <>
                                            <input type="file" accept='video/*' ref={videoRef} onChange={uploadVideoBtnClick} style={{ display: 'none' }} />
                                            <IoCloudUploadOutline size={100} style={{ color: "rgba(255,255,255,0.5)" }} />
                                            <Button
                                                onClick={() => videoRef.current.click()}
                                                variant="contained"
                                                sx={{
                                                    backgroundColor: "rgba(255,255,255,0.2)",
                                                    color: 'white',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                                    },
                                                }}
                                            >Upload Video</Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={styles.lowerDiv}>
                            <div className={styles.thumbnailDiv} style={thumbnailDivStyling}>

                                <input type="file" accept='image/*' ref={thumbnailRef} style={{ display: "none" }} onChange={handleThumbnailClick} />
                                <PiImageDuotone size={100} style={{ color: "rgba(255,255,255,0.5)" }} />
                                <Button
                                    onClick={() => thumbnailRef.current.click()}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.3)',
                                        },
                                    }}
                                >Upload Thumbnail</Button>
                            </div>
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: "rgba(255,255,255,1)",
                                    color: 'black',
                                    fontWeight: '900',
                                    fontSize: "16px",
                                    padding: '6px 12px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.8)',
                                    },
                                }}
                                type='submit'
                            >
                                {
                                    loading ? (
                                        <ColorRing
                                            visible={true}
                                            height="28"
                                            width="40"
                                            ariaLabel="color-ring-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="color-ring-wrapper"
                                            colors={["#000000", "#000000", "#000000", "#000000", "#000000"]}
                                        />
                                    ) : ("Publish")
                                }
                            </Button>
                        </div>
                    </form>
                    {error && (
                        <p style={{ color: "red", paddingLeft: '0', fontSize: "16px" }}>{error}</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UploadVideo
