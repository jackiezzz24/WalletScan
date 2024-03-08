import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "./utils/Layout";
import profile_image from "../../assets/images/profile_image.png";
import Avatar from "react-avatar-edit";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

function Profile() {
  const [user, setUser] = useState(null);
  const authToken = localStorage.getItem("authToken");
  const [image, setImage] = useState("");
  const [imageCrop, setImageCrop] = useState(false);
  const [src, setSrc] = useState(false);
  const [pview, setPview] = useState(false);
  const [profile, setProfile] = useState([]);

  const profileFinal = profile.map((item) => item.pview);

  const getUserProfile = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API;
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

  const saveCropImage = () => {
    setProfile([...profile, { pview }]);
    setImageCrop(false);
  };

  return (
    <ProfileStyled>
      <InnerLayout>
        <h1>Profile</h1>
        <div className="user-con">
          <img
            src={profileFinal.length ? profileFinal : profile_image}
            alt=""
            onClick={() => {
              setImageCrop(true);
            }}
          />
          <Dialog
            visible={imageCrop}
            header={() => <CustomDialogTitle>Update Profile</CustomDialogTitle>}
            onHide={() => setImageCrop(false)}
            style={{ background: 'rgba(180, 240, 201, 1)', borderRadius:'5%' , padding: '1rem'}}
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
                  <Button className="save-button"
                    onClick={saveCropImage}
                    label="Save"
                    icon="pi pi-check"
                    style={{ fontSize: '1.5rem' }}
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
        </div>
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
  }
`;

const CustomDialogTitle = styled.div`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonStyled = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export default Profile;
