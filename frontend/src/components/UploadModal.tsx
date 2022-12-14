import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { UploadModalBodyDiv } from './styledComponents/UploadModal.style';
import { CometChat } from '@cometchat-pro/chat';

interface PropsInterface {
    method: string;
    isModalOpen:boolean;
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    header:string
  }
const toBase64 = (file : any) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function UploadModal(props:PropsInterface) {
  const [isLoading, setLoading] = useState<boolean>(false);
    const [fileData, setFileData] = useState<string | any>();
    const [postCaption, setPostCaption] = useState("");
    const user = useContext(AuthContext);
    const navigate = useNavigate();
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files != null && e.target.files[0] != null) {
        setFileData(e.target.files[0]);
      }
    };
    const handleUpload = async () => {
      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("userId", `${user?.uid}`);
      if (props.method == "uploadPost") {
        formData.append("caption", postCaption); //---------conditionally
      }
      try {
        setLoading(true);
        await axios.post(
          `http://localhost:90/${props.method}`, //---------conditionally
          formData
        ).then(async (result)=>{
          if(props.method == "updateProfileImage"){
            CometChat.callExtension(
              'avatar',
              'POST',
              'v1/upload',
              {
                avatar: await toBase64(fileData) ,
              }
            ).then(response => {
              // { avatarURL: "https://data-eu.cometchat.io/avatars/photo123.jpg" }
                console.log("comet avatar : ",response);
              }).catch(error => {
                // Error occured
                console.log("comet avatar : ",error)
            });
          }
        }).catch((error)=>{
          console.log("cometchat err : ",error)
        })
        console.log("Uploaded Succesfully");
        setLoading(false);
        navigate("/");
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  return (
    <>
      <Modal
        show={props.isModalOpen}
        onHide={() => props.setModalIsOpen(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadModalBodyDiv>
            <input
              type="file"
              className="custom-file-input"
              name="file"
              onChange={handleInputChange}
            />
          </UploadModalBodyDiv>
          <br />
          {props.method == "uploadPost" ? (
            <textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              id="caption"
              name="caption"
              rows={7}
              cols={37}
              placeholder="Add Caption"
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          {isLoading ? (
            <Button
              style={{ background: "#0095f6", color: "white" }}
            >
              <Spinner animation="border" role="status" size="sm" />
            </Button>
          ) : (
            <Button
              style={{ background: "#0095f6", color: "white" }}
              onClick={handleUpload}
            >
              Upload
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UploadModal;
