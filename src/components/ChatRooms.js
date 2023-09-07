import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChatRooms.module.css";

function ChatRooms() {
  const [chatRooms, getChatRooms] = useState({
    chatRooms: [],
    loading: true,
  });

  let chatroomList = [];

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
                    <span>{chatrooms.description.length > 115 ? chatrooms.description.substring(0,170) + "..." : chatrooms.description}</span>
                    <div className={styles.chatRoomCardContentCreator}>
                      <div className={styles.createrInfo}>
                        <span className={styles.createInfoSpan}>
                          <span className={styles.createInfoAuthor}>
                            Creado Por: {chatrooms.createdBy.username}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          });

          getChatRooms({ chatRooms: chatroomList, loading: false }); //now that we have the chat room list, we can go ahead and set the state to include the chat rooms.
        }
      } catch (err) {
        console.error("the error found is: ", err);
      }
    }

    if (chatRooms.chatRooms.length == 0 && chatRooms.loading) {

      gettingchatrooms();

    }
  }, [chatRooms]);

  return chatRooms.chatRooms.length > 0 ? (
    <div className={styles.chatRoomsContainerChatRooms}>
      <main className={styles.chatRoomsMain}>{chatRooms.chatRooms}</main>
    </div>
  ) : chatRooms.loading ? (
    <div className={styles.chatRoomsContainer}><h1 style={{ margin: "0px" }}>Cargando Cuartos De Chat</h1></div>
  ) : (
    <div className={styles.chatRoomsContainer}><h1 style={{ margin: "0px" }}>Aún no hay cuartos</h1></div>
  );
}

export default ChatRooms;
