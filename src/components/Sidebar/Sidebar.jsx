import React, { useState } from 'react';
import styles from "./Sidebar.module.css"
import { IoMdHome } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlinePlaylistPlay } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { LuHistory, LuUserSquare2 } from "react-icons/lu";
import { AiOutlineLike } from "react-icons/ai";
import { useSelector } from 'react-redux';


export default function Sidebar() {
    const [activePara, setActivePara] = useState("home");
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user)
    const handleSidebarClick = (e) => {
        setActivePara(e);
        // if (e !== "home") {
        //     navigate(`/${e}`)
        // }
        // else {
        //     navigate("/")
        // }
        if (e === "home") {
            navigate("/")
            return
        }
        if (e === "yourChannel") {
            if (currentUser) {
                navigate(`/channel/${currentUser._id}`)
                return
            } else {
                navigate("/channel/you")
                return
            }
        }
        navigate(`/${e}`)
    }

    return (
        <div className={styles.sidebar}>
            <div className={styles.paraDiv}>
                <p id={styles.paraId} className={activePara === "home" ? styles.active : ""} onClick={() => handleSidebarClick("home")}><IoMdHome size={25} style={{ marginBottom: "5px" }} /> Home</p>
                <p id={styles.paraId} className={activePara === "subscriptions" ? styles.active : ""} onClick={() => handleSidebarClick("subscriptions")}><MdOutlineSubscriptions size={25} />Subscriptions</p>
                <p id={styles.paraId} className={activePara === "playlists" ? styles.active : ""} onClick={() => handleSidebarClick("playlists")}><MdOutlinePlaylistPlay size={33} style={{ paddingLeft: "2px" }} /> Playlists</p>
            </div>
            <div className={styles.paraDiv}>
                {currentUser ? (
                    <>
                        <p id={styles.paraId} className={styles.personalHeading}>You</p>
                        <p id={styles.paraId} className={activePara === "yourChannel" ? styles.active : ""} onClick={() => handleSidebarClick("yourChannel")}><LuUserSquare2 size={20} /> Your channel</p>
                        <p id={styles.paraId} className={activePara === "history" ? styles.active : ""} onClick={() => handleSidebarClick("history")}><LuHistory size={22} /> History</p>
                        <p id={styles.paraId} className={activePara === 'likedVideos' ? styles.active : ""} onClick={() => handleSidebarClick("likedVideos")}><AiOutlineLike size={22} /> Liked videos</p>
                    </>
                ) : (
                    <>
                        <p id={styles.paraId} onClick={() => handleSidebarClick("yourChannel")}><LuUserSquare2 size={20} /> You</p>
                        <p id={styles.paraId}><LuHistory size={22} /> History</p>
                    </>
                )}
            </div>
        </div>
    )
}
