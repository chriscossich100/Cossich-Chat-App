import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatRooms.module.css";
import { useTranslation } from "react-i18next";

function ChatRooms() {
  const [chatRooms, getChatRooms] = useState({
    chatRooms: [],
    loading: true,
    userLogedIn: ''
  });

  let chatroomList = [];

  const { t, i18n } = useTranslation();

  //activate nativate when the user clicked on one of the chatrooms:
  const navigate = useNavigate();


  useEffect(() => {
    //use a fetch request to get all the chat rooms available:
  
    async function gettingchatrooms() {
      try {
        let headerStuff = {
          headers: {
            Authorization: "Token " + localStorage.getItem("auth-token"),
          },
        };
        const response = await fetch(
          `${process.env.REACT_APP_DB}/gettingchatrooms/`,
          headerStuff
        );
        const chatroomsList = await response.json();
        
        if (chatroomsList.Chatrooms != null) {
          //to make things quick lets assign a key to each item on the array
          let i = 0;
          chatroomList = chatroomsList.Chatrooms.map((chatrooms) => {
            i++;
            let strReplace = chatrooms.name.replace(
              /[&\/\\#, +()$~%.'":*?<>{}]/g,
              "-"
            );
            return (
              <div
                className={styles.chatRoomsMainSingleRoom}
                key={i}
                onClick={() => {
                  return navigate(`/home/room/${strReplace}`);
                }}
              >
                <div
                  className={[
                    styles.chatRoomsMainSingleRoomCard,
                    styles.chatRoomBoxShadow,
                  ].join(" ")}
                >
                  <div className={styles.chatRoomCardContent}>
                    <h2>{chatrooms.name}</h2>
                    <span>
                      {chatrooms.description.length > 115
                        ? chatrooms.description.substring(0, 170) + "..."
                        : chatrooms.description}
                    </span>
                    <div className={styles.chatRoomCardContentCreator}>
                      <div className={styles.createrInfo}>
                        <span className={styles.createInfoSpan}>
                          <span className={styles.createInfoAuthor}>
                            {t("chatRooms.createdBy")}:{" "}
                            {chatrooms.createdBy.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          });

          getChatRooms({ chatRooms: chatroomList, loading: false, userLogedIn: chatroomsList.currentUser }); //now that we have the chat room list, we can go ahead and set the state to include the chat rooms.
        }
      } catch (err) {
        console.error("the error found is: ", err);
      }
    }

    if (chatRooms.chatRooms.length == 0 && chatRooms.loading) {
      gettingchatrooms();
    }
  }, [chatRooms]);

  //this useEffect is only ran for when changin the language. it reruns the fetch reqeust to change the state with the updated language:
  useEffect(() => {
    async function gettingchatrooms() {
      try {
        let headerStuff = {
          headers: {
            Authorization: "Token " + localStorage.getItem("auth-token"),
          },
        };
        const response = await fetch(
          `${process.env.REACT_APP_DB}/gettingchatrooms/`,
          headerStuff
        );
        const chatroomsList = await response.json();
        if (chatroomsList.Chatrooms != null) {
          //to make things quick lets assign a key to each item on the array
          let i = 0;
          chatroomList = chatroomsList.Chatrooms.map((chatrooms) => {
            i++;
            let strReplace = chatrooms.name.replace(
              /[&\/\\#, +()$~%.'":*?<>{}]/g,
              "-"
            );
            return (
              <div
                className={styles.chatRoomsMainSingleRoom}
                key={i}
                onClick={() => {
                  return navigate(`/home/room/${strReplace}`);
                }}
              >
                <div
                  className={[
                    styles.chatRoomsMainSingleRoomCard,
                    styles.chatRoomBoxShadow,
                  ].join(" ")}
                >
                  <div className={styles.chatRoomCardContent}>
                    <h2>{chatrooms.name}</h2>
                    <span>
                      {chatrooms.description.length > 115
                        ? chatrooms.description.substring(0, 170) + "..."
                        : chatrooms.description}
                    </span>
                    <div className={styles.chatRoomCardContentCreator}>
                      <div className={styles.createrInfo}>
                        <span className={styles.createInfoSpan}>
                          <span className={styles.createInfoAuthor}>
                            {t("chatRooms.createdBy")}:{" "}
                            {chatrooms.createdBy.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          });

          getChatRooms({ chatRooms: chatroomList, loading: false, userLogedIn: chatroomsList.currentUser }); //now that we have the chat room list, we can go ahead and set the state to include the chat rooms.
        }
      } catch (err) {
        console.error("the error found is: ", err);
      }
    }
    if (chatRooms.chatRooms.lengh != 0 && chatRooms.loading == false) {
      gettingchatrooms();
    }
  }, [i18n.language]);

  return chatRooms.chatRooms.length > 0 ? (
    <div className={styles.chatRoomsContainerChatRooms}>
      <h2 className = {styles.welcomeUser}>{t('chatRooms.welcome')}{chatRooms.userLogedIn}</h2>
      <main className={styles.chatRoomsMain}>{chatRooms.chatRooms}</main>
    </div>
  ) : chatRooms.loading ? (
    <div className={styles.chatRoomsContainer}>
      <h1 style={{ margin: "0px" }}>{t("chatRooms.loadingChatRooms")}</h1>
    </div>
  ) : (
    <div className={styles.chatRoomsContainer}>
      <h1 style={{ margin: "0px" }}>{t("chatRooms.noChatRooms")}</h1>
    </div>
  );
}

export default ChatRooms;
