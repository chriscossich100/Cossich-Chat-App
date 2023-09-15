import React, { createElement, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ChatRoom.module.css";
import { useTranslation } from "react-i18next";

//this is the component that will get the current chat room and load the messages found in this chat room:
function ChatRoom() {
  //set the specific slug from the params using useParams:
  const { slug } = useParams();

  const { t, i18n } = useTranslation();

  //set state to load all the messages in the chat room and a loading state while the messages load.
  const [messagesInTheChat, getMessages] = useState({
    loading: true,
    chatMessages: [],
    yourMessage: "",
  });

  let messageListEndRef = useRef(false);
  let messageSender = useRef(null);
  let messageSenderMobile = useRef(null);

  function scrollToBottom() {
    if (messageListEndRef.current != false) {
      return messageListEndRef.current.scrollIntoView();
    }
  }

  let messages = [];
  const navigate = useNavigate();

  async function retrieveMessages() {
    try {
      let header = {
        headers: {
          Authorization: "Token " + localStorage.getItem("auth-token"),
        },
      };

      //convert the url string to complete unicode in case it includes any tildes, accents or emojis.
      let unicode = slug.split("").map((i) => {
        var temp = i.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
          return "\\u" + temp;
        }
        return i;
      });

      let finalizedUnicode = unicode
        .join("")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");
      const response = await fetch(
        `${process.env.REACT_APP_DB}/gettingmessages/${finalizedUnicode}/`,
        header
      );
      const theResult = await response.json();

      //return the user back to the list of chat rooms if the chat room cant be found (if user manually types in the chat room in the url):
      if (!theResult.RoomFound) {
        navigate("/home/chatrooms");
      } else {
        let lastOne = false;
        if (
          theResult.MessagesInChatRoom.length >
          messagesInTheChat.chatMessages.length
        ) {
          messageListEndRef.current = true;
        } else {
          messageListEndRef.current = false;
        }
        messages = theResult.MessagesInChatRoom.map((x) => {
          //get the time of the message and adjust it to the proper time:
          let xTime = new Date(x.dateCreated);

          if (!theResult.MessagesInChatRoom[x + 1]) {
            lastOne = true;
          }

         
          //create a empty string that will be placed into an array.
          let temp = "";
          //initialize array. This array will contain text from temp as well as a tags.
          let messagesArray = []
          for (let index = 0; index < x.message.length; index++) {
            if (x.message[index] != " " && /\r|\n/.exec(x.message[index]) == null) {
              temp += x.message[index];

              //if the link is the last word in the string run the code to check:
              if (index == x.message.length - 1) {
                if (temp.indexOf('http://') != -1 || temp.indexOf('www.') != -1 || temp.indexOf('https://') != -1) {
                  //in case www. is found and not any http, add https to string: 
                  if (temp.indexOf('http://') == -1 && temp.indexOf('https://') == -1) {
                    temp = 'https://' + temp
                  }
                  messagesArray.push(<a target="_blank" href = {temp}>{temp}</a>)
              }
              else{
                messagesArray.push(temp)
              }
              }
            } else{
              if (/\r|\n/.exec(x.message[index]) != null) {
                if (/\r|\n/.exec(x.message[index])['input'] == "\r") {
                  // temp += '\r'
                }
                else {
                  temp += '\n'
                }
              }
              if (temp.indexOf('http://') != -1 || temp.indexOf('www.') != -1 || temp.indexOf('https://') != -1) {

                if (temp.indexOf('http://') == -1 && temp.indexOf('https://') == -1) {
                  temp = 'https://' + temp
                }
                messagesArray.push(<a target="_blank" href = {temp}>{temp} </a>)
              }
              else{
                if (temp == "\n") {
                  messagesArray.push(temp)
                }
                else{
                 messagesArray.push(temp + " ");
                }
              }
              temp = "";
            }
          }

          

          return (
            <div
              className={
                theResult.currentUser == x.author
                  ? styles.chatMessagesContainerMessage
                  : styles.chatMessageContainerMessageNotCurrentUser
              }
              ref={lastOne == false ? null : messageListEndRef}
            >
              <span></span>
              <div className={styles.chatMessagesContainerMessageDetail}>
                <div
                  className={
                    theResult.currentUser == x.author
                      ? styles.chatMessageContainerMessageDetailDiv
                      : styles.chatMessageContainerMessageDetailDivNotCurrentUser
                  }
                >
                  <div>
                    <div
                      className={
                        styles.chatMessageContainerMessageDetailDivContent
                      }
                    >
                      <div className={styles.chatStructure}>
                        <div className={styles.chatStructureSpan}>
                          <p>{messagesArray}</p>
                        </div>
                      </div>
                      <div
                        style={{
                          marginLeft: "4px",
                          marginRight: "0",
                          zIndex: "10",
                          position: "relative",
                          float: "right",
                          marginBottom: "-5px",
                          marginTop: "-10px",
                        }}
                      >
                        <div
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            fontSize: ".6875rem",
                            whiteSpace: "normal",
                            whiteSpace: "nowrap",
                            color: "#66781",
                            alignItems: "center",
                            height: "15px",
                            lineHeight: "15px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-block",
                              verticalAlign: "top",
                            }}
                          >
                            {xTime.toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "11px" }}>{x.author}</span>
            </div>
          );
        });

        //this if check will update the state if the messages list contains at least one message:
        //if not don't update the state and just do the intial render
        if (messages.length > 0) {
          getMessages({ loading: false, chatMessages: messages });
        } else {
          getMessages({ loading: false, chatMessages: [] });
        }
      }
    } catch (err) {
      console.error("the error that occured is: ", err);
    }

    return messages;
  }

  //we're going to use a useeffect so that we can load the messages and also reload/re-render them every second.
  useEffect(() => {
    const interval = setInterval(async () => {
      if (messagesInTheChat.chatMessages.length != 0) {
        await retrieveMessages();
      }
    }, 1200);
    if (messageListEndRef.current != false) {
      scrollToBottom();
    }
    return () => clearInterval(interval);
  }, [messagesInTheChat.chatMessages]);

  //function for sending a message through mobile site.
  async function sendMessageMobile(e) {
    e.preventDefault();
    messageSenderMobile.current.focus();
    let formData = e.target;
    let messageInfo = new FormData();

    //convert the url string to complete unicode in case it includes any tildes, accents or emojis.
    let unicode = slug.split("").map((i) => {
      var temp = i.charCodeAt(0).toString(16).toUpperCase();
      if (temp.length > 2) {
        return "\\u" + temp;
      }
      return i;
    });

    let finalizedUnicode = unicode
      .join("")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");

    messageInfo.append("message", messageSenderMobile.current.innerText);
    messageInfo.append("author", localStorage.getItem("auth-token"));

    try {
      let header = {
        method: "POST",
        headers: {
          Authorization: "Token " + localStorage.getItem("auth-token"),
        },
        body: messageInfo,
      };
      const response = await fetch(
        `${process.env.REACT_APP_DB}/createmessages/${finalizedUnicode}/`,
        header
      );
      const result = await response.json();
    } catch (err) {
      console.error(err);
    }

    //reset the value of the message and also focus on the element so user doesn't have to reclick the message par
    messageSenderMobile.current.innerHTML = "";

    //only call the request if there are no messages. This is only called when the user sent the initial message
    if (messagesInTheChat.chatMessages.length <= 0) {
      retrieveMessages();
    }
  }

  //this function is for when the user is in desktop view modes. unlike the mobile view, the desktops wont have a button to send the message.
  //the user will press the 'enter' key (just like in most messaging applications). However, the keys for 'return' are shift+enter. In this case,
  // this function determines which key is being pressed. If its just the enter key, send the post request. If its the combination, then simply create a 'return'
  let key = { Enter: false, Shift: false };
  async function sendMessage(e) {
    if (e.key === "Enter" && key.Shift == false) {
      e.preventDefault();
      key.Enter = true;
      let formData = e.target;
      let messageInfo = new FormData();

      //convert the url string to complete unicode in case it includes any tildes, accents or emojis.
      let unicode = slug.split("").map((i) => {
        var temp = i.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
          return "\\u" + temp;
        }
        return i;
      });

      let finalizedUnicode = unicode
        .join("")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "_");

      messageInfo.append("message", "" + messageSender.current.innerText);
      messageInfo.append("author", localStorage.getItem("auth-token"));

      try {
        let header = {
          method: "POST",
          headers: {
            Authorization: "Token " + localStorage.getItem("auth-token"),
          },
          body: messageInfo,
        };
        const response = await fetch(
          `${process.env.REACT_APP_DB}/createmessages/${finalizedUnicode}/`,
          header
        );
        const result = await response.json();
      } catch (err) {
        console.error(err);
      }
      messageSender.current.innerHTML = "";

      //only call the request if there are no messages. This is only called when the user sent the initial message
      if (messagesInTheChat.chatMessages.length <= 0) {
        retrieveMessages();
      }
    }

    if (e.key === "Shift") {
      key.Shift = true;
    }
  }

  function onKeyUp(e) {
    if (e.key === "Enter") {
      key.Enter = false;
    }
    if (e.key === "Shift") {
      key.Shift = false;
    }
  }

  //run this code as initial message retriever:
  if (
    messagesInTheChat.chatMessages.length == 0 &&
    messagesInTheChat.loading == true
  ) {
    retrieveMessages();
  }

  return (
    <main className={styles.mainChatMain}>
      <div className={styles.mainChatMainDiv}>
        <div className={styles.mainChatMainDivContainer}>
          <div
            style={{ height: "100%", position: "absolute", width: "100%" }}
          ></div>
          <main className={styles.chatMainWrapper}>
            <div style={{ visibility: "visible" }}>
              <div className={styles.chatMainWrapperContent}>
                <div style={{ flex: "1 1 auto", minHeight: "12px" }}></div>
                <div className={styles.chatMainDiv}>
                  <div style={{ width: "100%" }}>
                    <div
                      className={
                        styles.chatMessagesContainerMessageFirstMessage
                      }
                    >
                      <span></span>
                      <div
                        className={styles.chatMessagesContainerMessageDetail}
                      >
                        <div
                          className={
                            styles.chatMessageContainerMessageDetailDivFirstMessage
                          }
                        >
                          <div>
                            <div
                              className={
                                styles.chatMessageContainerMessageDetailDivContent
                              }
                            >
                              <div className={styles.chatStructure}>
                                <span className={styles.chatStructureSpan}>
                                  {t("chatRooms.chatRoomDefaultMessage")}
                                </span>
                              </div>
                            </div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {messagesInTheChat.chatMessages}
                  </div>
                </div>
              </div>
            </div>
          </main>
          <form className={styles.chatMainForm}>
            <div className={styles.chatMainFormContainerInputContainer}>
              <span
                className={[
                  styles.chatMainFormContainerInputContainerContainer,
                  i18n.language == "es"
                    ? styles.espSendMessage
                    : styles.engSendMessage,
                ].join(" ")}
                role="textbox"
                contentEditable
                ref={messageSender}
                onKeyDown={sendMessage}
                onKeyUp={onKeyUp}
              ></span>
            </div>
          </form>
          <form
            className={styles.chatMainFormMobileView}
            onSubmit={sendMessageMobile}
          >
            <div className={styles.chatMainFormContainerInputContainer}>
              <span
                className={[
                  styles.chatMainFormContainerInputContainerContainer,
                  i18n.language == "es"
                    ? styles.espSendMessage
                    : styles.engSendMessage,
                ].join(" ")}
                role="textbox"
                contentEditable
                ref={messageSenderMobile}
              ></span>
              <button className={styles.inputSendMessage} type="submit">
                &gt;
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default ChatRoom;
