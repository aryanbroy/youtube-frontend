import React from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import styles from "./Main.module.css"
import Home from '../Home/Home'
import Subscription from '../Subscription/Subscription'
import YourChannel from '../YourChannel/YourChannel'
import { useLocation, useParams } from 'react-router-dom'
import History from '../History/History'
import Playlists from '../Playlists/Playlists'
import Playlist from '../../components/Playlist/Playlist'
import LikedVideos from '../LikedVideos/LikedVideos'
import SearchPage from '../SearchPage/SearchPage'
import { useQuery } from '../../hooks/useQuery'

export default function Main() {

    const { channelId, playlistId } = useParams()

    return (
        <div className={styles.homeDiv}>
            <div>
                <Sidebar />
            </div>
            <div style={{ width: "100%" }}>
                <div className={styles.mainDiv}>
                    {location.pathname === "/" && <Home />}
                    {location.pathname === "/subscriptions" && <Subscription />}
                    {location.pathname === "/playlists" && <Playlists />}
                    {location.pathname === `/channel/${channelId}` && <YourChannel />}
                    {location.pathname === "/channel/you" && <YourChannel />}
                    {location.pathname === "/history" && <History />}
                    {location.pathname === `/playlist/${playlistId}` && <Playlist />}
                    {location.pathname === "/likedVideos" && <LikedVideos />}
                    {location.pathname === `/results` && <SearchPage />}
                </div>
            </div>
        </div>
    )
}
