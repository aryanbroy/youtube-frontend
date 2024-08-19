import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Dialog, DialogTitle, FormControlLabel, FormGroup, List, ListItem, ListItemText, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/inter';
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { IoAddSharp } from "react-icons/io5";
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

export default function SimpleDialog({ open, onClose, playlists, videoId }) {

    const [checkedValues, setCheckedValues] = useState([]);
    const [isFormActive, setIsFormActive] = useState(false);
    const [playlistValues, setPlaylistValues] = useState({ name: "", description: "" });
    const { currentUser } = useSelector((state) => state.user);
    // console.log(playlists)

    // console.log(videoId)

    useEffect(() => {
        setCheckedValues([])
        playlists?.map((playlist) => {
            if (playlist.videoAdded) {
                if (!checkedValues.includes(playlist._id)) {
                    setCheckedValues((prev) => [...prev, playlist._id])
                }
            }
        })
    }, [videoId, playlists])

    const handleClose = () => {
        onClose();
        setIsFormActive(false)
        setPlaylistValues({})
    }

    const removeVideoFromPlaylist = async (value) => {
        const res = await axios.patch(`/api/playlist/remove/${videoId}/${value}`, {}, { withCredentials: true });
        const { data } = res.data;
        toast.success(`Video removed from ${data.name}`)
        return data;
    }

    const addVideoToPlaylist = async (value) => {
        const res = await axios.patch(`/api/playlist/add/${videoId}/${value}`, {}, { withCredentials: true });
        const { data } = res.data;
        toast.success(`Video added to ${data.name} `)
        return data;
    }


    const handleCheckClick = async (e) => {
        const { value } = e.target;

        if (value !== undefined) {

            // remove from playlist
            if (checkedValues.includes(value)) {
                setCheckedValues(checkedValues.filter(item => item !== value));
                try {
                    const data = await removeVideoFromPlaylist(value);
                } catch (error) {
                    console.log(error)
                    toast.error(error.response?.data?.message || "Error removing video from playlist")
                }
            }

            // add to playlist
            else {
                setCheckedValues([...checkedValues, value]);
                try {
                    const data = await addVideoToPlaylist(value)
                } catch (error) {
                    console.log(error)
                    toast.error(error.response?.data?.message || "Error adding video to playlist")
                }
            }
        }
    }

    const createPlaylist = async (name, description) => {
        const res = await axios.post('/api/playlist/',
            {
                name,
                description,
                owner: currentUser._id
            },
            { withCredentials: true }
        )
        const { data } = res.data;
        return data;
    }

    // create and video to newly created playlist
    const handleCreateNewPlaylist = async () => {
        if (!playlistValues) {
            toast.warning("Playlist name and description cannot be empty")
            return
        }
        if (!playlistValues.name) {
            toast.warning("Playlist name cannot be empty")
            return
        }
        if (!playlistValues.description) {
            toast.warning("Playlist description cannot be empty")
            return
        }
        try {
            const { name, description } = playlistValues

            const data = await createPlaylist(name, description)
            onClose()
            playlists.push(data);
            setCheckedValues([...checkedValues, data._id]);

            await addVideoToPlaylist(data?._id)
            // console.log(data)

            setPlaylistValues({})
            setIsFormActive(false)
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Error creating playlist, please refresh the page and try again")
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={open} onClose={handleClose}
                sx={{
                    '& .MuiDialog-paper': {
                        width: '300px'
                    },
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                    <DialogTitle sx={{ fontSize: "18px", padding: "5px 5px" }}>Save video to...</DialogTitle>
                    <Button
                        style={{ color: "white", padding: "0px" }}
                        onClick={handleClose}
                    >
                        <RxCross2 size={30} />
                    </Button>
                </div>
                <List>
                    <ListItem>
                        <FormGroup sx={{ width: "100%" }}>
                            {playlists?.map((playlist, i) => (
                                <FormControlLabel
                                    key={i}
                                    style={{ userSelect: "none" }}
                                    control={<Checkbox checked={checkedValues.includes(playlist?._id)
                                        //    || playlist?.videoAdded
                                    }
                                    />}
                                    value={playlist?._id}
                                    label={playlist?.name}
                                    onClick={handleCheckClick} />
                            ))}
                        </FormGroup>
                    </ListItem>
                    <ListItem>
                        {isFormActive ? (
                            <form style={{ width: "100%" }}>
                                <TextField
                                    variant='outlined'
                                    name='name'
                                    placeholder='Name'
                                    sx={{ width: "100%" }}
                                    value={playlistValues?.name}
                                    onChange={(e) => setPlaylistValues({ ...playlistValues, [e.target.name]: e.target.value })}
                                />
                                <TextField
                                    variant='outlined'
                                    name='description'
                                    placeholder='Description'
                                    sx={{ width: "100%", marginTop: "5px" }}
                                    value={playlistValues?.description}
                                    onChange={(e) => setPlaylistValues({ ...playlistValues, [e.target.name]: e.target.value })}
                                />
                                <Button
                                    variant='text'
                                    sx={{ marginLeft: "auto", marginTop: "10px", display: "flex", justifyContent: "end", padding: "6px 10px" }}
                                    onClick={handleCreateNewPlaylist}
                                >
                                    Create
                                </Button>
                            </form>
                        ) : (
                            <Button
                                sx={{ fontSize: "14px", padding: "5px 0px", color: "white", width: '100%' }}
                                onClick={() => setIsFormActive(true)}
                            >

                                <IoAddSharp size={20} style={{ marginBottom: "2px", marginRight: "2px" }} />
                                Create new playlist
                            </Button>
                        )}

                    </ListItem>
                </List>
            </Dialog>
        </ThemeProvider>
    )
}
