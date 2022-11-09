import { useState, useEffect, useContext, useRef } from "react";
import {
  ModalBackdrop,
  ModalWrapperDiv,
  ImageWrapperDiv,
  DetailsWrapperDiv,
  ModalCloseButton,
  AuthorProfileDiv,
  CommentsWrapperDiv,
  ActionIconsDiv,
  CommentInput,
  CommentDiv,
} from "./styledComponents/Modal.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmarkCircle,
  faHeart,
  faFaceSmile,
  faComment,
  faBookmark,
  faShareFromSquare,
} from "@fortawesome/free-regular-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export function PostDetailModal(props: any) {
  const postData = {
    useName: "Yt_ 09090",
    caption: "Dream Super Bike 🔥🔥",
    profileImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxISbGKaOWbeQjagbw4mTs7ldZW2jbA7njbw&usqp=CAU",
    location: "Lucknow",
    likes: 455,
    time : "4 week"
  };
  const user = useContext(AuthContext);
  const[postDat, setPostData] = useState([])
  const[commentsArray, setcommentsArray] = useState<any[]>([])
  
  // const commentsArray = [
  //   {
  //     userName: "subh_Petwal",
  //     profileImage:
  //       "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  //     commentData:
  //       "Lorem ipsum dolor, sit amet Lorem ipsum dolor sit, ametconsectetur adipisicing elit. Doloremque minus, recusandaeexercitationem odio dolores aperiam voluptates molestiaslabore culpa nulla magni, nihil non! Dignissimosrecusandae sint dicta numquam. Provident, animi! Atque ",
  //     time: "3 days",
  //     likes: "4",
  //   },
  //   {
  //     userName: "alien_23",
  //     profileImage:
  //       "https://www.ourmigrationstory.org.uk/uploads/_CGSmartImage/img-a2beae8392617b8c02b85d8b9197fb96",
  //     commentData:
  //       "voluptates molestias labore culpa nulla magni, nihil non! Dignissimos recusandae sint dicta numquam. Provident, animi! Atque ",
  //     time: "2 week",
  //     likes: "21",
  //   },
  //   {
  //     userName: "mnp4321",
  //     profileImage:
  //       "https://www.ourmigrationstory.org.uk/uploads/_CGSmartImage/img-a2beae8392617b8c02b85d8b9197fb96",
  //     commentData:
  //       "nulla magni voluptates molestias labore culpa, nihil non! Dignissimos recusandae sint dicta numquam. Provident, animi! Atque ",
  //     time: "2 week",
  //     likes: "21",
  //   }
  // ];

  useEffect(()=>{
    let userData;
    const getData = async()=>{
      const res = await axios.get(`http://localhost:90/getComments/${props.postId}`)
      if(res.data.data){
        setcommentsArray(res.data.data)
      }
  }
    getData();
  },[])
  // console.log("myArray",commentsArray)
  function postComment() {
    console.log("comment posted");
  }
  function handleClick() {
    props.setModal(props.modalState);
  }
  // useEffect(() => {
  //   if (modalState) {
  //     document.body.style.height = "100vh";
  //     document.body.style.overflowY = "hidden";
  //     // @ts-ignore
  //     // document.getElementById("root").style.overflowY ="hidden";
  //   } else {
  //     //   document.body.style.height = "100vh";
  //     document.body.style.overflowY = "scroll";
  //   }
  // }, [modalState]);
  return (
    <>
      {/* <button onClick={handleClick}>Click</button> */}
      {props.modalState && (
        <div>
          <ModalBackdrop>
            <ModalWrapperDiv>
              <ImageWrapperDiv>
                <img src={props.postImage} />
              </ImageWrapperDiv>
              <DetailsWrapperDiv>
                <AuthorProfileDiv>
                  <div className="profile-img">
                    <img src={props.postImage} alt="profile image" />
                  </div>
                  <div className="description">
                    <p className="user-name">{props.userName}</p>
                    <p>Lucknow</p>
                  </div>
                  <div className="ellipsis">
                    <FontAwesomeIcon icon={faEllipsis} />
                  </div>
                </AuthorProfileDiv>
                <CommentsWrapperDiv>
                  <CommentDiv>
                    <div className="profile-img">
                      <img src={postData.profileImage} alt="profile image" />
                    </div>
                    <div>
                      <p className="comment-data">
                        <span className="userName">{props.userName}</span>
                        {props.caption}
                      </p>
                      <p className="comment-info">
                        <span>4 Week</span>
                      </p>
                    </div>
                    <div className="like-icon">
                      <FontAwesomeIcon icon={faHeart} />
                    </div>
                  </CommentDiv>
                  {commentsArray?commentsArray.map((commentDoc) => {
                    return (
                      <CommentDiv key={Math.random()}>
                        <div className="profile-img">
                          <img
                            src={commentDoc.commentBy_profileImage}
                            alt="profile image"
                          />
                        </div>
                        <div>
                          <p className="comment-data">
                            <span className="userName">
                              {commentDoc.commentBy_userName}
                            </span>
                            {commentDoc.commentData}
                          </p>
                          <p className="comment-info">
                            {/* <span>{commentDoc.time}</span>
                            <span>{commentDoc.likes} likes</span> */}
                          </p>
                        </div>
                        <div className="like-icon">
                          <FontAwesomeIcon icon={faHeart} />
                        </div>
                      </CommentDiv>
                    );
                  }):<p>No Comments</p>}
                </CommentsWrapperDiv>
                <ActionIconsDiv>
                  <div className="icon-wrapper">
                    <div className="left-icon">
                      <FontAwesomeIcon icon={faHeart} />
                      <FontAwesomeIcon icon={faComment} />
                      <FontAwesomeIcon icon={faShareFromSquare} />
                    </div>
                    <div className="bookmark-icon">
                      <FontAwesomeIcon icon={faBookmark} />
                    </div>
                  </div>
                  <div className="likes-wrapper">
                    <img
                      src={commentsArray[0]?commentsArray[0].commentBy_userName:""}
                      alt="profile image"
                    />
                    <p>
                      Liked by <span>{commentsArray[0]?commentsArray[0].commentBy_userName:null}</span> and{" "}
                      <span>{postData.likes}</span> others
                      
                    </p>
                  </div>
                </ActionIconsDiv>
                <CommentInput>
                  <div className="emoji-icon">
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </div>
                  <div className="input-div">
                    <input
                      type="text"
                      name="comment"
                      placeholder="Add a Comment..."
                    />
                  </div>
                  <div className="post-button">
                    <button onClick={postComment}>Post</button>
                  </div>
                </CommentInput>
              </DetailsWrapperDiv>
            </ModalWrapperDiv>
          </ModalBackdrop>
          <ModalCloseButton>
            <FontAwesomeIcon onClick={handleClick} icon={faXmarkCircle} />
          </ModalCloseButton>
        </div>
      )}
    </>
  );
}
