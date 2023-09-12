import React, { useState, useEffect, memo, useRef } from "react";
import { doc, getFirestore, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, set, push, off } from "firebase/database";
import { auth } from "../../../FirebaseConfig/firebaseConfig";
import fallbackAvatar from "../../../assets/fallback-avatar.png";
import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";

const RealtimeChat = () => {
  const [fetchedNames, setFetchedNames] = useState({});

  const [clearTextArea, setClearTextArea] = useState(false);

  const [messages, setMessages] = useState([]);
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const messagesEndRef = useRef(null);
  const textRef = useRef("");

  const db = getDatabase();
  const currentUserID = auth?.currentUser?.uid;
  const currentUserName =
    auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
  const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

  const ownerID = localStorage.getItem("ownerID");

  const fetchNameFromFirestore = async (id) => {
    // Try fetching from `ownerDetails-USER_ID` format.
    let ownerDetail = localStorage.getItem(`ownerDetails-${id}`);
    if (ownerDetail) {
      return JSON.parse(ownerDetail).uniqueName;
    }

    // If not found, try fetching from `ownerDetails` object format.
    let allOwnerDetails = JSON.parse(
      localStorage.getItem("ownerDetails") || "{}"
    );
    if (allOwnerDetails[id] && allOwnerDetails[id].uniqueName) {
      return allOwnerDetails[id].uniqueName;
    }

    // If still not found, fetch from Firestore.
    const firestoreDB = getFirestore();
    const userRef = doc(firestoreDB, "users", id);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userName = userDoc.data().uniqueName;
      if (userName) {
        // Store in the `ownerDetails-USER_ID` format.
        localStorage.setItem(
          `ownerDetails-${id}`,
          JSON.stringify({ uniqueName: userName })
        );
        return userName;
      }
    }

    return null;
  };

  const handleKeyDown = (event) => {
    // Check for Enter key without Shift
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevents default newline behavior of Enter key in textarea
      handleSendMessage();
    }
  };

  // Temp storage for fetched names
  const tempFetchedNamesRef = useRef({ ...fetchedNames });

  useEffect(() => {
    if (!currentUserID || !ownerID || currentUserID === ownerID) {
      return;
    }

    const sortedIds = [currentUserID, ownerID].sort();
    const potentialThreadID = sortedIds.join("_");
    const potentialThreadRef = ref(
      db,
      `threads/${currentUserID}/${potentialThreadID}/messages`
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
          // Extract user IDs from the thread ID
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
      `threads/${currentUserID}/${activeThread}/messages`
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
        (sender) => !fetchedNames[sender] && sender !== "system"
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    async function fetchNamesForThread() {
      if (!activeThread) return;

      // Extract user IDs from the thread ID
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

    // Derive the recipient ID from the activeThread
    const userIds = activeThread.split("_");
    const recipientID = userIds.find((id) => id !== currentUserID);

    if (!recipientID) {
      console.error("Cannot derive a valid recipient ID.");
      return;
    }

    const sortedIds = [currentUserID, recipientID].sort();
    const potentialThreadID = sortedIds.join("_");

    const message = {
      sender: currentUserID,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      text: textRef.current.value.trim(),
      timestamp: Date.now(),
    };

    // For the current user
    const currentUserMessageRef = push(
      ref(db, `threads/${currentUserID}/${potentialThreadID}/messages`)
    );
    set(currentUserMessageRef, message);

    // For the recipient/user2
    const recipientUserMessageRef = push(
      ref(db, `threads/${recipientID}/${potentialThreadID}/messages`)
    );
    set(recipientUserMessageRef, message);

    setClearTextArea(true);
  };

  useEffect(() => {
    if (clearTextArea) {
      textRef.current.value = "";
      setClearTextArea(false); // Reset the trigger after clearing
    }
  }, [clearTextArea]);

  return (
    <div className="messenger-container">
      <div className="threads-list-container">
        {threads.map((thread) => {
          const isUnread =
            thread.lastMessage &&
            thread.lastMessage.sender !== currentUserID &&
            activeThread !== thread.id;
          return (
            <div
              key={thread.id}
              className={`thread ${activeThread === thread.id ? "active" : ""}`}
              onClick={() => {
                setActiveThread(activeThread !== thread.id ? thread.id : null);
              }}
            >
              {thread.otherUserName}
              {isUnread && <span className="unread-indicator">🔵</span>}
            </div>
          );
        })}
      </div>
      {activeThread && (
        <div className="chat-container">
          <div className="messages" ref={messagesEndRef}>
            {messages.map((message) => (
              <p
                key={message.id}
                className={
                  message.sender === currentUserID ? "sender" : "recipient"
                }
              >
                {message.sender !== currentUserID && message.senderAvatar && (
                  <img
                    src={message.senderAvatar}
                    alt={`${message.senderName}'s avatar`}
                    className="message-avatar"
                  />
                )}

                {message.sender !== currentUserID
                  ? `${message?.senderName}: ${renderMessageWithLinks(
                      message?.text
                    )}`
                  : renderMessageWithLinks(message?.text)}
              </p>
            ))}
          </div>
          <textarea
            name="chat-textarea"
            ref={textRef}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default memo(RealtimeChat);
