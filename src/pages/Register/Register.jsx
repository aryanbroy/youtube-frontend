import React, { useRef, useState } from 'react'
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
    MDBIcon
} from 'mdb-react-ui-kit'
import styles from "./Register.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { TbPhotoUp } from "react-icons/tb";
import axios from 'axios'
import { ColorRing } from 'react-loader-spinner';


export default function Register() {
    const [inputFields, setInputFields] = useState({});
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const [coverImageSrc, setCoverImageSrc] = useState(null);
    const [profilePicSrc, setProfilePicSrc] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const imageRef = useRef();
    const coverImageRef = useRef();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setProfilePicFile(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePicSrc(imageUrl);
        }
    }

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0]
        setCoverImageFile(file);
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCoverImageSrc(imageUrl);
        }

    }

    const coverDivStyle = {
        backgroundImage: coverImageSrc ? `url(${coverImageSrc})` : "none"
    }

    const handleInputChange = (e) => {
        setInputFields({ ...inputFields, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        setError(null);
        try {
            await axios.post('/api/users/register', {
                // ...inputFields
                fullName: inputFields.fullName,
                username: inputFields.username,
                email: inputFields.email,
                password: inputFields.password,
                avatar: profilePicFile,
                coverImage: coverImageFile
            },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            navigate("/login")
            setError(null);
        } catch (error) {
            setError(error.response?.data.message || "Something went wrong while signing up")
        } finally {
            setLoading(false)
        }
        // sign up user here
    }
    return (
        <div className={styles.mainLoginDiv}>
            <div className={styles.innerLoginDiv}>
                <form onSubmit={handleSubmit}>
                    <MDBContainer className="p-5 my-3 d-flex flex-column w-50" id={styles.loginBox}>
                        <div>
                            <div className={styles.avatarMainDiv} style={coverDivStyle}>
                                <input type="file" accept='image/*' onChange={handleImageChange} ref={imageRef} style={{ display: "none" }} />
                                <div className={styles.avatarDiv} onClick={() => imageRef.current.click()}>
                                    {profilePicSrc ? (
                                        <img src={profilePicSrc} alt="profilePic" className={styles.profilePic} />
                                    ) : (
                                        <MDBIcon fas icon="user-plus" size="4x" className={styles.avatarIcon} />
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleCoverImageChange} ref={coverImageRef} style={{ display: "none" }} />
                                <div className={styles.textDiv} onClick={() => coverImageRef.current.click()}>
                                    <TbPhotoUp size={23} /> Upload Cover image
                                </div>
                            </div>
                        </div>

                        <MDBInput name='fullName' wrapperClass='mb-4 p-1' label='Full Name' labelClass='text-white' id='form1' type='text' size='lg' style={{ color: "white" }} onChange={handleInputChange} />
                        <MDBInput name='username' wrapperClass='mb-4 p-1' label='Username' labelClass='text-white' id='form2' type='text' size='lg' style={{ color: "white" }} onChange={handleInputChange} />
                        <MDBInput name='email' wrapperClass='mb-4 p-1' label='Email address' labelClass='text-white' id='form3' type='email' size='lg' style={{ color: "white" }} onChange={handleInputChange} />
                        <MDBInput name='password' wrapperClass='mb-4 p-1' label='Password' labelClass='text-white' id='form4' type='password' size='lg' style={{ color: "white" }} onChange={handleInputChange} />

                        <div className="d-flex justify-content-between mx-3 mb-4">
                            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                            <a href="!#">Forgot password?</a>
                        </div>

                        <MDBBtn className="mb-4 p-2" style={{ fontWeight: "900", fontSize: "20px" }} type='submit'>
                            {loading ? (
                                <ColorRing
                                    visible={true}
                                    height="27"
                                    width="40"
                                    ariaLabel="color-ring-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="color-ring-wrapper"
                                    colors={["#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9", "#A9A9A9"]}
                                />
                            ) : (
                                "Sign up"
                            )}
                        </MDBBtn>

                        {error && <p className='text-danger'>{error}</p>}

                        <div className="text-center" style={{ display: 'flex', flexDirection: "column", alignItems: "center" }}>
                            <p className="h5 lead">Already a member? <Link to={"/login"} className='text-decoration-none'>Login</Link></p>
                            <p>or sign up with:</p>

                            <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='facebook-f' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='twitter' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='google' size="sm" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                                    <MDBIcon fab icon='github' size="sm" />
                                </MDBBtn>

                            </div>
                        </div>

                    </MDBContainer>
                </form>
            </div>

        </div>
    )
}
