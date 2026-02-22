import React, { useState, useEffect, memo, useRef } from "react";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push, off } from "firebase/database";
import { auth } from "../../../FirebaseConfig/firebaseConfig";
import fallbackAvatar from "../../../assets/fallback-avatar.png";
import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";
import styles from "./chat.module.css";

const RealtimeChat = () => {
  const [fetchedNames, setFetchedNames] = useState({});
  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);

  // ✅ 1. შევცვალეთ Ref-ის ლოგიკა უშუალოდ კონტეინერზე
  const messagesAreaRef = useRef(null);
  const textRef = useRef("");

  const db = getDatabase();
  const currentUserID = auth?.currentUser?.uid;
  const currentUserName =
    auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
  const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

  const ownerID = localStorage.getItem("ownerID");

  const fetchNameFromFirestore = async (id) => {
    let ownerDetail = localStorage.getItem(`ownerDetails-${id}`);
    if (ownerDetail) {
      return JSON.parse(ownerDetail).uniqueName;
    }

    let allOwnerDetails = JSON.parse(
      localStorage.getItem("ownerDetails") || "{}",
    );
    if (allOwnerDetails[id] && allOwnerDetails[id].uniqueName) {
      return allOwnerDetails[id].uniqueName;
    }

    const firestoreDB = getFirestore();
    const userRef = doc(firestoreDB, "users", id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userName = userDoc.data().uniqueName;
      if (userName) {
        localStorage.setItem(
          `ownerDetails-${id}`,
          JSON.stringify({ uniqueName: userName }),
        );
        return userName;
      }
    }
    return null;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const tempFetchedNamesRef = useRef({ ...fetchedNames });

  useEffect(() => {
    if (!currentUserID || !ownerID || currentUserID === ownerID) return;

    const sortedIds = [currentUserID, ownerID].sort();
    const potentialThreadID = sortedIds.join("_");
    const potentialThreadRef = ref(
      db,
      `threads/${currentUserID}/${potentialThreadID}/messages`,
    );

    onValue(potentialThreadRef, (snapshot) => {
      if (!snapshot.val()) {
        const initialMessage = {
          sender: "system",
          text: "Welcome to the chat! Start your conversation here.",
          timestamp: Date.now(),
        };
        const newMessageRef = push(potentialThreadRef);
        set(newMessageRef, initialMessage);
      }
    });

    return () => off(potentialThreadRef);
  }, [currentUserID, ownerID]);

  useEffect(() => {
    const threadsRef = ref(db, `threads/${currentUserID}`);
    onValue(threadsRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const relevantThreads = Object.keys(data).map(async (threadID) => {
          const userIds = threadID.split("_");
          const otherUserId = userIds.find((id) => id !== currentUserID);

          const name = await fetchNameFromFirestore(otherUserId);
          tempFetchedNamesRef.current[otherUserId] = name || "Unknown";

          return {
            id: threadID,
            otherUserName: name,
            lastMessage: data[threadID].messages
              ? Object.values(data[threadID].messages).pop()
              : null,
            unread: false,
          };
        });

        const resolvedThreads = await Promise.all(relevantThreads);
        setThreads(resolvedThreads);
        const newNames = { ...tempFetchedNamesRef.current };
        if (JSON.stringify(newNames) !== JSON.stringify(fetchedNames)) {
          setFetchedNames(newNames);
        }
      }
    });

    return () => off(threadsRef);
  }, [currentUserID]);

  useEffect(() => {
    if (!activeThread) return;

    const threadRef = ref(
      db,
      `threads/${currentUserID}/${activeThread}/messages`,
    );
    onValue(threadRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(loadedMessages);
      }
    });

    return () => off(threadRef);
  }, [activeThread]);

  useEffect(() => {
    async function fetchNamesForMessages() {
      const uniqueSenders = [...new Set(messages.map((m) => m.sender))].filter(
        (sender) => !fetchedNames[sender] && sender !== "system",
      );
      for (let sender of uniqueSenders) {
        if (sender !== currentUserID) {
          const fetchedName = await fetchNameFromFirestore(sender);
          if (fetchedName) {
            setFetchedNames((prev) => ({
              ...prev,
              [sender]: fetchedName,
            }));
          }
        }
      }
    }
    fetchNamesForMessages();
  }, [messages]);

  // ✅ 2. იდეალური სქროლი: სქროლავს მხოლოდ ჩატის შიდა არეალს
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    async function fetchNamesForThread() {
      if (!activeThread) return;

      const userIds = activeThread.split("_");
      for (let id of userIds) {
        if (!fetchedNames[id]) {
          const fetchedName = await fetchNameFromFirestore(id);
          if (fetchedName) {
            setFetchedNames((prev) => ({
              ...prev,
              [id]: fetchedName,
            }));
          }
        }
      }
    }
    fetchNamesForThread();
  }, [activeThread]);

  const handleSendMessage = () => {
    if (!textRef.current.value.trim() || !activeThread) return;

    const userIds = activeThread.split("_");
    const recipientID = userIds.find((id) => id !== currentUserID);

    if (!recipientID) return;

    const sortedIds = [currentUserID, recipientID].sort();
    const potentialThreadID = sortedIds.join("_");

    const message = {
      sender: currentUserID,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      text: textRef.current.value.trim(),
      timestamp: Date.now(),
    };

    const currentUserMessageRef = push(
      ref(db, `threads/${currentUserID}/${potentialThreadID}/messages`),
    );
    set(currentUserMessageRef, message);

    const recipientUserMessageRef = push(
      ref(db, `threads/${recipientID}/${potentialThreadID}/messages`),
    );
    set(recipientUserMessageRef, message);

    textRef.current.value = "";
  };

  return (
    <div className={styles.messengerContainer}>
      {/* მარცხენა პანელი */}
      <div className={styles.threadsListContainer}>
        {threads.map((thread) => {
          const isUnread =
            thread.lastMessage &&
            thread.lastMessage.sender !== currentUserID &&
            activeThread !== thread.id;

          // ✅ 3. სახელი ყოველთვის აისახება დინამიურად (თუნდაც აქტიური იყოს სხვა ჩატი)
          const userIds = thread.id.split("_");
          const otherUserId = userIds.find((id) => id !== currentUserID);
          const displayName =
            fetchedNames[otherUserId] || thread.otherUserName || "User";

          return (
            <div
              key={thread.id}
              className={`${styles.threadItem} ${
                activeThread === thread.id ? styles.threadItemActive : ""
              }`}
              onClick={() => {
                setActiveThread(activeThread !== thread.id ? thread.id : null);
              }}
            >
              {/* სახელის span-ს ვუზღუდავთ სიგანეს, რომ გრძელმა სახელმა დიზაინი არ დაშალოს */}
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </span>
              {isUnread && <span className={styles.unreadIndicator}></span>}
            </div>
          );
        })}
      </div>

      {activeThread ? (
        <div className={styles.chatContainer}>
          {/* ✅ აქ დავსვით messagesAreaRef */}
          <div className={styles.messagesArea} ref={messagesAreaRef}>
            {messages.map((message) => {
              let msgClass = "";
              if (message.sender === "system") {
                msgClass = styles.systemMsg;
              } else if (message.sender === currentUserID) {
                msgClass = styles.senderMsg;
              } else {
                msgClass = styles.recipientMsg;
              }

              return (
                <div
                  key={message.id}
                  className={`${styles.messageBubble} ${msgClass}`}
                >
                  {message.sender !== currentUserID &&
                    message.sender !== "system" &&
                    message.senderAvatar && (
                      <img
                        src={message.senderAvatar}
                        alt={`${message.senderName}'s avatar`}
                        className={styles.messageAvatar}
                      />
                    )}

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {message.sender !== currentUserID &&
                      message.sender !== "system" && (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            marginBottom: "4px",
                            fontWeight: "700",
                          }}
                        >
                          {message.senderName}
                        </span>
                      )}

                    <span>{renderMessageWithLinks(message?.text)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.inputArea}>
            <textarea
              className={styles.textArea}
              name="chat-textarea"
              ref={textRef}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
            />
            <button className={styles.sendBtn} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            backgroundColor: "#f8fafc",
          }}
        >
          <h2>Select a conversation to start</h2>
        </div>
      )}
    </div>
  );
};

export default memo(RealtimeChat);
