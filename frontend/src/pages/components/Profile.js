import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import profile_image from "../../assets/images/profile_image.png";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useProfileContext } from "./ProfileContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const [image, setImage] = useState("");
  const [imageCrop, setImageCrop] = useState(false);
  const [src, setSrc] = useState(false);
  const [pview, setPview] = useState(false);
  const [profile, setProfile] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { updateProfileImage } = useProfileContext();
  const navigate = useNavigate();

  const profileFinal = profile.map((item) => item.pview);
  const baseUrl = process.env.REACT_APP_API;

  const getUserProfile = async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        const { username } = result;
        setUser({ ...result, username });
      } else {
        alert(`${result.error}`);
      }
    } catch (error) {
      alert("An error occurred during fetch: " + error.message);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const onClose = () => {
    setPview(null);
  };

  const onCrop = (view) => {
    setPview(view);
  };

  const saveCropImage = async () => {
    try {
      const imageUrl = await uploadImageToCloudinary();
      updateProfileImage(imageUrl);
      const baseUrl = process.env.REACT_APP_API;
      const response = await fetch(`${baseUrl}/auth/upload/${user.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile_img: imageUrl }),
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to upload profile image: ${result.error}`);
        return;
      }
      alert("Profile image upload successfully");
      getUserProfile();
      setImageCrop(false);
    } catch (error) {
      alert("An error occurred during update: " + error.message);
    }
  };

  const uploadImageToCloudinary = async () => {
    if (pview) {
      const formData = new FormData();
      formData.append("file", pview);
      formData.append("upload_preset", "ml_default");

      try {
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dxhu2wrmc/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (cloudinaryResponse.ok) {
          const cloudinaryResult = await cloudinaryResponse.json();
          return cloudinaryResult.secure_url;
        } else {
          const cloudinaryResult = await cloudinaryResponse.json();
          throw new Error(
            `Cloudinary upload error: ${cloudinaryResult.error.message}`
          );
        }
      } catch (error) {
        throw new Error(
          `Error uploading image to Cloudinary: ${error.message}`
        );
      }
    } else {
      throw new Error("No image selected for upload.");
    }
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setShowChangePassword(false);
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await fetch(`${baseUrl}/auth/password/${user.id}?oldPassword=${oldPassword}&newPassword=${newPassword}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        }
      });

      if (!response.ok) {
        const result = await response.json();
        alert(`Failed to change password: ${result.error}`);
        return;
      }

      alert("Password changed successfully");
      getUserProfile();
      setShowChangePassword(false);
      logout();
    } catch (error) {
      alert("An error occurred during password change: " + error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/register");
  }

  return (
    <ProfileStyled>
      <InnerLayout>
        <h1>Profile</h1>
        <div className="user-con">
          <img
            src={
              profileFinal.length
                ? profileFinal
                : user?.profile_img || profile_image
            }
            alt=""
            onClick={() => {
              setImageCrop(true);
            }}
          />
          <Dialog
            visible={imageCrop}
            header={() => <CustomDialogTitle>Update Profile</CustomDialogTitle>}
            onHide={() => setImageCrop(false)}
            style={{
              background: "rgba(180, 240, 201, 1)",
              borderRadius: "5%",
              padding: "1rem",
            }}
          >
            <div className="confirmation-content flex flex-column align-items-center">
              <Avatar
                width={500}
                height={300}
                onCrop={onCrop}
                onClose={onClose}
                src={src}
                shadingColor={"#474649"}
                backgroundColor={"#474649"}
              />
              <div className="flex flex-column align-items-center mt-5 w-12">
                <div className="flex justify-content-around w-12 mt-4">
                  <ButtonStyled>
                    <Button
                      className="save-button"
                      onClick={saveCropImage}
                      label="Save"
                      icon="pi pi-check"
                      style={{ fontSize: "1.5rem" }}
                    />
                  </ButtonStyled>
                </div>
              </div>
            </div>
          </Dialog>
          <InputText
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files[0];
              if (file && file.type.substring(0, 5) === "image") {
                setImage(file);
              } else {
                setImage(null);
              }
            }}
          />
        </div>
        <div className="user-profile">
          <div className="username">
            <h4>Username</h4>
            <p>{user?.username || "Guest"}</p>
          </div>
          <div className="email">
            <h4>Email</h4>
            <p>{user?.email || ""}</p>
          </div>
          <div className="change-password">
            <button onClick={handleChangePassword}>Change Password</button>
          </div>
        </div>
        <Dialog
          visible={showChangePassword}
          header={() => <CustomDialogTitle>Change Password</CustomDialogTitle>}
          onHide={handleCloseChangePassword}
          style={{
            background: "rgba(250, 130, 121, 1)",
            borderRadius: "5%",
            padding: "1rem",
          }}
        >
          <div className="change-password-content">
            <div className="passowrd-section">
              <label htmlFor="oldPassword">Old Password:</label>
              <br/>
              <InputText
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <br/>
            <div className="passowrd-section">
              <label htmlFor="newPassword">New Password:</label>
              <br/>
              <InputText
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="change-password-buttons">
              <ButtonStyled>
                <Button
                  className="password-change"
                  onClick={() => changePassword(oldPassword, newPassword)}
                  label="Change Password"
                  icon="pi pi-check"
                  style={{ fontSize: "1rem" }}
                />
              </ButtonStyled>
            </div>
          </div>
        </Dialog>
      </InnerLayout>
    </ProfileStyled>
  );
}

const ProfileStyled = styled.div`
  h1 {
    color: rgba(34, 34, 126, 1);
  }
  .user-con {
    margin-top: 3rem;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      background: #fcf6f9;
      border: 2px solid green;
      padding: 0.2rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }
  }
  .user-profile {
    padding: 6rem 5.5rem;
    margin-top: 6rem;
    height: 100px;
    display: flex;
    align-items: left;
    justify-content: center;
    gap: 2rem;
    flex-direction: column;
    h4 {
      font-size: 2rem;
      color: rgba(0, 0, 0, 0.6);
    }
    p {
      font-size: 1.8rem;
      color: rgba(0, 0, 0, 0.8);
      font-family: "Roboto";
    }
    .change-password {
      button {
        margin-top: 10px;
        background-color: rgba(254, 154, 56, 1);
        color: white;
        border: none;
        padding: 20px 20px;
        text-align: center;
        text-decoration: none;
        font-size: 1.5rem;
        cursor: pointer;
        border-radius: 20px;
      }
    }
  }
`;

const CustomDialogTitle = styled.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonStyled = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default Profile;
