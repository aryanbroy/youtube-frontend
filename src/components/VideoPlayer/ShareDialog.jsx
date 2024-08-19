import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/inter';
import { Button, Dialog, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { LuCopy } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import { toast } from 'react-toastify'
import { RxCross2 } from 'react-icons/rx';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const ShareDialog = ({ shareDialogOpen, onShareClose, href }) => {


    const [icon, setIcon] = useState(<LuCopy style={{ color: 'black' }} size={18} />);

    const handleClose = () => {
        onShareClose();
    }

    const copyLink = (e) => {
        setIcon(<FaCheck style={{ color: 'black' }} size={18} />)
        setTimeout(() => {
            setIcon(<LuCopy style={{ color: 'black' }} size={18} />)
        }, 2000)
        navigator.clipboard.writeText(href || window.location.href)
        toast.success("Link copied to clipboard", {
            style: {
                backgroundColor: "#343434",
            }
        })
    }
    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog
                open={shareDialogOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            // fullWidth
            >
                <div style={{ padding: "20px 30px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <DialogTitle sx={{ padding: '0' }} id="alert-dialog-title">
                            Share link
                        </DialogTitle>
                        <Button
                            style={{ color: "white", padding: "0px", paddingTop: "2px", minWidth: "0" }}
                            onClick={handleClose}
                        >
                            <RxCross2 size={18} />
                        </Button>
                    </div>
                    <DialogContent sx={{ padding: '0' }}>
                        <DialogContentText sx={{ padding: '0' }}>
                            Anyone who has this link will be able to watch the video
                        </DialogContentText>
                    </DialogContent>
                    <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.4rem", alignItems: "center", justifyContent: 'space-between' }}>
                        <TextField
                            InputProps={{ readOnly: true }}
                            sx={{
                                width: "100% ",
                                '& .MuiInputBase-input': {
                                    padding: "10px",
                                },
                            }}
                            variant="outlined"
                            value={href || window.location.href}
                        />
                        <Button
                            sx={{
                                minWidth: '0',
                                padding: "0",
                                height: "2.5rem",
                                width: "2.7rem",
                                backgroundColor: "white",
                                borderRadius: "6px",
                                color: 'black',
                                '&:hover': {
                                    backgroundColor: "rgba(255,255,255,0.8)",
                                    color: 'black'
                                }
                            }}
                            onClick={copyLink}
                            variant='contained'>
                            {icon}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </ThemeProvider>
    )
}

export default ShareDialog
