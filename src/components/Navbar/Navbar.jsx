import React, { useEffect, useRef, useState } from 'react'
import styles from "./Navbar.module.css"
import { RiVideoUploadFill } from "react-icons/ri";
import { IoNotifications } from "react-icons/io5";
import { Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'
import { RxCross2 } from "react-icons/rx";

export default function Navbar() {
    const { currentUser } = useSelector((state) => state.user);
    const searchDivRef = useRef(null);
    const [searchWidth, setSearchWidth] = useState("auto");
    const [searchInputValue, setSearchInputValue] = useState("");
    const [suggestions, setSuggestions] = useState(null);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestionBoxOpen, setSuggestionBoxOpen] = useState(false)
    const navigate = useNavigate();
    const suggestionBoxRef = useRef(null)

    useEffect(() => {
        if (searchDivRef.current) {
            setSearchWidth(`${searchDivRef.current.offsetWidth}px`);
        }
    }, [])

    useEffect(() => {
        const fetchSuggestions = async () => {
            // setSuggestions(null)
            setSuggestionsLoading(true)
            setSuggestionBoxOpen(true);
            try {
                const res = await axios.post(`/api/videos/suggestions`, { query: searchInputValue });
                const { data } = res.data;
                setSuggestions(data);
            } catch (error) {
                console.log(error)
            } finally {
                setSuggestionsLoading(false)
            }
        }
        if (searchInputValue.length > 0
            &&
            !suggestions?.some((suggestion) => suggestion.title.startsWith(searchInputValue))
        ) {
            fetchSuggestions();
        }

    }, [searchInputValue])


    const handleClick = (query) => {
        setSuggestionBoxOpen(false)
        setSearchInputValue(query)
        query = query.replace(" ", "+")
        navigate(`/results?query=${query}`)
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
    }

    const handleFocus = () => {
        setSuggestionBoxOpen(true)
    }

    const handleBlur = () => {
        setSuggestionBoxOpen(false)
    }

    const handleUploadClick = () => {
        navigate('/upload/video')
    }

    return (
        <div className={styles.navMainDiv}>
            <div className={styles.navInnerDiv}>
                <div>
                    <Link to={"/"}>
                        <h1 className={styles.heading}>Sometube</h1>
                    </Link>
                </div>
                <div className={styles.searchDiv}>
                    <div>
                        <TextField
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            autoComplete='off'
                            value={searchInputValue}
                            onChange={(e) => setSearchInputValue(e.target.value)}
                            ref={searchDivRef} id="outlined-basic" placeholder='Search'
                            variant="outlined" size='small'
                            InputProps={{
                                endAdornment: (
                                    searchInputValue.length > 0 && (
                                        <InputAdornment style={{ margin: "0" }} position='end'>
                                            <IconButton
                                                style={{ padding: "8px", paddingRight: '8px' }}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: "rgba(255,255,255,0.1)",
                                                        color: 'white'
                                                    }
                                                }}
                                                onClick={() => setSearchInputValue("")}>
                                                <RxCross2 size={30} style={{ color: "rgb(169, 169, 169)" }} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                ),
                                sx: {
                                    borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px", border: "1px #848482 solid", color: "white", 'MuiOutlinedInput-root': {
                                        paddingRight: '0'
                                    }
                                }
                            }}

                            className={styles.inputField}
                            sx={{
                                width: "600px",
                                "& .MuiInputLabel-outlined": {
                                    color: "white",
                                    fontWeight: "bold",
                                },
                                '& .MuiOutlinedInput-root': {
                                    padding: '0',
                                    paddingRight: '5px',
                                    '& .MuiInputBase-input::placeholder': {
                                        color: '#A9A9A9',
                                        opacity: 1,
                                    },
                                },
                            }}
                        />
                        <Button
                            disabled={searchInputValue.length <= 0}
                            onMouseDown={(e) => handleMouseDown(e)}
                            onClick={() => handleClick(searchInputValue)}
                            variant='text'
                            sx={{
                                border: "1px solid #848482",
                                borderTopRightRadius: "25px",
                                borderBottomRightRadius: "25px", color: "#A9A9A9", backgroundColor: "#343434", marginLeft: "-5px",
                                cursor: "pointer",
                            }}>

                            <FaSearch color='#A9A9A9' size={28} />
                        </Button>
                    </div>
                    {(!suggestionsLoading && searchInputValue.length > 0 && suggestionBoxOpen) && (
                        <div ref={suggestionBoxRef} className={styles.suggestionsDiv} style={{ width: searchWidth }}>
                            {suggestions?.map((suggestion, i) => (
                                <Button
                                    onMouseDown={(e) => handleMouseDown(e)}
                                    onClick={() => handleClick(suggestion.title.toLowerCase())}
                                    className={styles.suggestionsPara}
                                    key={i}
                                    sx={{
                                        textTransform: "lowercase",
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "start",
                                        paddingLeft: "10px",
                                        color: "white"
                                    }}
                                >
                                    {suggestion.title.toLowerCase()}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
                <div className={styles.rightSideNav}>
                    <Button
                        className={styles.uploadDiv}
                        onClick={handleUploadClick}
                        style={{
                            minWidth: '40px',
                            maxWidth: '40px'
                        }}
                        sx={{
                            padding: "0",
                            color: "white",
                            '&:hover': {
                                color: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    >
                        <RiVideoUploadFill size={30} />
                    </Button>
                    <Button
                        className={styles.uploadDiv}
                        style={{
                            minWidth: '40px',
                            maxWidth: '40px'
                        }}
                        sx={{
                            padding: "0",
                            color: "white",
                            '&:hover': {
                                color: 'rgba(255, 255, 255, 0.8)',
                            }
                        }}
                    >
                        <IoNotifications size={30} />
                    </Button>
                    {currentUser ? (
                        <div className={styles.avatarDiv}>
                            <img src={currentUser?.avatar} alt="avatar" className={styles.avatar} />
                        </div>
                    ) : (
                        <Link to={"/login"} style={{ color: "white" }}>
                            <Button variant="contained" sx={{ width: "100px", height: "40px", fontSize: "15px", fontWeight: "700" }}>
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
