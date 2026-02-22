// import React, { useState, useEffect, memo, useRef } from "react";
// import { doc, getFirestore, getDoc } from "firebase/firestore";
// import { getDatabase, ref, onValue, set, push, off } from "firebase/database";
// import { auth } from "../../../FirebaseConfig/firebaseConfig";
// import fallbackAvatar from "../../../assets/fallback-avatar.png";
// import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";

// const RealtimeChat = () => {
//   const [fetchedNames, setFetchedNames] = useState({});
//   // ❌ ამოღებულია: const [clearTextArea, setClearTextArea] = useState(false);

//   const [messages, setMessages] = useState([]);
//   const [threads, setThreads] = useState([]);
//   const [activeThread, setActiveThread] = useState(null);

//   const messagesEndRef = useRef(null);
//   const textRef = useRef("");

//   const db = getDatabase();
//   const currentUserID = auth?.currentUser?.uid;
//   const currentUserName =
//     auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
//   const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

//   const ownerID = localStorage.getItem("ownerID");

//   const fetchNameFromFirestore = async (id) => {
//     let ownerDetail = localStorage.getItem(`ownerDetails-${id}`);
//     if (ownerDetail) {
//       return JSON.parse(ownerDetail).uniqueName;
//     }

//     let allOwnerDetails = JSON.parse(
//       localStorage.getItem("ownerDetails") || "{}",
//     );
//     if (allOwnerDetails[id] && allOwnerDetails[id].uniqueName) {
//       return allOwnerDetails[id].uniqueName;
//     }

//     const firestoreDB = getFirestore();
//     const userRef = doc(firestoreDB, "users", id);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       const userName = userDoc.data().uniqueName;
//       if (userName) {
//         localStorage.setItem(
//           `ownerDetails-${id}`,
//           JSON.stringify({ uniqueName: userName }),
//         );
//         return userName;
//       }
//     }
//     return null;
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const tempFetchedNamesRef = useRef({ ...fetchedNames });

//   // 1. Initial Setup (System Message)
//   useEffect(() => {
//     if (!currentUserID || !ownerID || currentUserID === ownerID) {
//       return;
//     }

//     const sortedIds = [currentUserID, ownerID].sort();
//     const potentialThreadID = sortedIds.join("_");
//     const potentialThreadRef = ref(
//       db,
//       `threads/${currentUserID}/${potentialThreadID}/messages`,
//     );

//     onValue(potentialThreadRef, (snapshot) => {
//       if (!snapshot.val()) {
//         const initialMessage = {
//           sender: "system",
//           text: "Welcome to the chat! Start your conversation here.",
//           timestamp: Date.now(),
//         };
//         const newMessageRef = push(potentialThreadRef);
//         set(newMessageRef, initialMessage);
//       }
//     });

//     return () => off(potentialThreadRef);
//   }, [currentUserID, ownerID]);

//   // 2. Fetch Threads List
//   useEffect(() => {
//     const threadsRef = ref(db, `threads/${currentUserID}`);
//     onValue(threadsRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (data) {
//         const relevantThreads = Object.keys(data).map(async (threadID) => {
//           const userIds = threadID.split("_");
//           const otherUserId = userIds.find((id) => id !== currentUserID);

//           const name = await fetchNameFromFirestore(otherUserId);
//           tempFetchedNamesRef.current[otherUserId] = name || "Unknown";

//           return {
//             id: threadID,
//             otherUserName: name,
//             lastMessage: data[threadID].messages
//               ? Object.values(data[threadID].messages).pop()
//               : null,
//             unread: false,
//           };
//         });

//         const resolvedThreads = await Promise.all(relevantThreads);
//         setThreads(resolvedThreads);
//         const newNames = { ...tempFetchedNamesRef.current };
//         if (JSON.stringify(newNames) !== JSON.stringify(fetchedNames)) {
//           setFetchedNames(newNames);
//         }
//       }
//     });

//     return () => {
//       off(threadsRef);
//     };
//   }, [currentUserID]);

//   // 3. Active Thread Messages Listener
//   useEffect(() => {
//     if (!activeThread) return;

//     const threadRef = ref(
//       db,
//       `threads/${currentUserID}/${activeThread}/messages`,
//     );
//     onValue(threadRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedMessages = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));
//         setMessages(loadedMessages);
//       }
//     });

//     return () => off(threadRef);
//   }, [activeThread]);

//   // 4. Fetch Names for Messages
//   useEffect(() => {
//     async function fetchNamesForMessages() {
//       const uniqueSenders = [...new Set(messages.map((m) => m.sender))].filter(
//         (sender) => !fetchedNames[sender] && sender !== "system",
//       );
//       for (let sender of uniqueSenders) {
//         if (sender !== currentUserID) {
//           const fetchedName = await fetchNameFromFirestore(sender);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [sender]: fetchedName,
//             }));
//           }
//         }
//       }
//     }

//     fetchNamesForMessages();
//   }, [messages]);

//   // 5. Auto Scroll
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // 6. Fetch Names for Thread List (Initial)
//   useEffect(() => {
//     async function fetchNamesForThread() {
//       if (!activeThread) return;

//       const userIds = activeThread.split("_");
//       for (let id of userIds) {
//         if (!fetchedNames[id]) {
//           const fetchedName = await fetchNameFromFirestore(id);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [id]: fetchedName,
//             }));
//           }
//         }
//       }
//     }

//     fetchNamesForThread();
//   }, [activeThread]);

//   // ✅ განახლებული ფუნქცია:
//   const handleSendMessage = () => {
//     if (!textRef.current.value.trim() || !activeThread) return;

//     const userIds = activeThread.split("_");
//     const recipientID = userIds.find((id) => id !== currentUserID);

//     if (!recipientID) {
//       console.error("Cannot derive a valid recipient ID.");
//       return;
//     }

//     const sortedIds = [currentUserID, recipientID].sort();
//     const potentialThreadID = sortedIds.join("_");

//     const message = {
//       sender: currentUserID,
//       senderName: currentUserName,
//       senderAvatar: currentUserAvatar,
//       text: textRef.current.value.trim(),
//       timestamp: Date.now(),
//     };

//     // Current User Update
//     const currentUserMessageRef = push(
//       ref(db, `threads/${currentUserID}/${potentialThreadID}/messages`),
//     );
//     set(currentUserMessageRef, message);

//     // Recipient Update
//     const recipientUserMessageRef = push(
//       ref(db, `threads/${recipientID}/${potentialThreadID}/messages`),
//     );
//     set(recipientUserMessageRef, message);

//     // ✅ ვასუფთავებთ პირდაპირ რეფს (არ იწვევს რენდერს)
//     textRef.current.value = "";

//     // ❌ setClearTextArea(true);  <-- ეს აღარ გვინდა
//   };

//   // ❌ ამოღებულია: useEffect(() => { if (clearTextArea) ... }, [clearTextArea]);

//   return (
//     <div className="messenger-container">
//       <div className="threads-list-container">
//         {threads.map((thread) => {
//           const isUnread =
//             thread.lastMessage &&
//             thread.lastMessage.sender !== currentUserID &&
//             activeThread !== thread.id;
//           return (
//             <div
//               key={thread.id}
//               className={`thread ${activeThread === thread.id ? "active" : ""}`}
//               onClick={() => {
//                 setActiveThread(activeThread !== thread.id ? thread.id : null);
//               }}
//             >
//               {thread.otherUserName}
//               {isUnread && <span className="unread-indicator">🔵</span>}
//             </div>
//           );
//         })}
//       </div>
//       {activeThread && (
//         <div className="chat-container">
//           <div className="messages" ref={messagesEndRef}>
//             {messages.map((message) => (
//               <p
//                 key={message.id}
//                 className={
//                   message.sender === currentUserID ? "sender" : "recipient"
//                 }
//               >
//                 {message.sender !== currentUserID && message.senderAvatar && (
//                   <img
//                     src={message.senderAvatar}
//                     alt={`${message.senderName}'s avatar`}
//                     className="message-avatar"
//                   />
//                 )}

//                 {message.sender !== currentUserID
//                   ? `${message?.senderName}: ${renderMessageWithLinks(
//                       message?.text,
//                     )}`
//                   : renderMessageWithLinks(message?.text)}
//               </p>
//             ))}
//           </div>
//           <textarea
//             name="chat-textarea"
//             ref={textRef}
//             onKeyDown={handleKeyDown}
//             placeholder="Type your message here..."
//           />
//           <button onClick={handleSendMessage}>Send</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(RealtimeChat);

// import React, { useState, useEffect, memo, useRef } from "react";
// import { doc, getFirestore, getDoc } from "firebase/firestore";
// import { getDatabase, ref, onValue, set, push, off } from "firebase/database";
// import { auth } from "../../../FirebaseConfig/firebaseConfig";
// import fallbackAvatar from "../../../assets/fallback-avatar.png";
// import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";
// // ✅ დავაიმპორტეთ ჩვენი ახალი დიზაინი
// import styles from "./chat.module.css";

// const RealtimeChat = () => {
//   const [fetchedNames, setFetchedNames] = useState({});
//   const [messages, setMessages] = useState([]);
//   const [threads, setThreads] = useState([]);
//   const [activeThread, setActiveThread] = useState(null);

//   const messagesEndRef = useRef(null);
//   const textRef = useRef("");

//   const db = getDatabase();
//   const currentUserID = auth?.currentUser?.uid;
//   const currentUserName =
//     auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
//   const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

//   const ownerID = localStorage.getItem("ownerID");

//   const fetchNameFromFirestore = async (id) => {
//     let ownerDetail = localStorage.getItem(`ownerDetails-${id}`);
//     if (ownerDetail) {
//       return JSON.parse(ownerDetail).uniqueName;
//     }

//     let allOwnerDetails = JSON.parse(
//       localStorage.getItem("ownerDetails") || "{}",
//     );
//     if (allOwnerDetails[id] && allOwnerDetails[id].uniqueName) {
//       return allOwnerDetails[id].uniqueName;
//     }

//     const firestoreDB = getFirestore();
//     const userRef = doc(firestoreDB, "users", id);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       const userName = userDoc.data().uniqueName;
//       if (userName) {
//         localStorage.setItem(
//           `ownerDetails-${id}`,
//           JSON.stringify({ uniqueName: userName }),
//         );
//         return userName;
//       }
//     }
//     return null;
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const tempFetchedNamesRef = useRef({ ...fetchedNames });

//   // 1. Initial Setup (System Message)
//   useEffect(() => {
//     if (!currentUserID || !ownerID || currentUserID === ownerID) {
//       return;
//     }

//     const sortedIds = [currentUserID, ownerID].sort();
//     const potentialThreadID = sortedIds.join("_");
//     const potentialThreadRef = ref(
//       db,
//       `threads/${currentUserID}/${potentialThreadID}/messages`,
//     );

//     onValue(potentialThreadRef, (snapshot) => {
//       if (!snapshot.val()) {
//         const initialMessage = {
//           sender: "system",
//           text: "Welcome to the chat! Start your conversation here.",
//           timestamp: Date.now(),
//         };
//         const newMessageRef = push(potentialThreadRef);
//         set(newMessageRef, initialMessage);
//       }
//     });

//     return () => off(potentialThreadRef);
//   }, [currentUserID, ownerID]);

//   // 2. Fetch Threads List
//   useEffect(() => {
//     const threadsRef = ref(db, `threads/${currentUserID}`);
//     onValue(threadsRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (data) {
//         const relevantThreads = Object.keys(data).map(async (threadID) => {
//           const userIds = threadID.split("_");
//           const otherUserId = userIds.find((id) => id !== currentUserID);

//           const name = await fetchNameFromFirestore(otherUserId);
//           tempFetchedNamesRef.current[otherUserId] = name || "Unknown";

//           return {
//             id: threadID,
//             otherUserName: name,
//             lastMessage: data[threadID].messages
//               ? Object.values(data[threadID].messages).pop()
//               : null,
//             unread: false,
//           };
//         });

//         const resolvedThreads = await Promise.all(relevantThreads);
//         setThreads(resolvedThreads);
//         const newNames = { ...tempFetchedNamesRef.current };
//         if (JSON.stringify(newNames) !== JSON.stringify(fetchedNames)) {
//           setFetchedNames(newNames);
//         }
//       }
//     });

//     return () => {
//       off(threadsRef);
//     };
//   }, [currentUserID]);

//   // 3. Active Thread Messages Listener
//   useEffect(() => {
//     if (!activeThread) return;

//     const threadRef = ref(
//       db,
//       `threads/${currentUserID}/${activeThread}/messages`,
//     );
//     onValue(threadRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedMessages = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));
//         setMessages(loadedMessages);
//       }
//     });

//     return () => off(threadRef);
//   }, [activeThread]);

//   // 4. Fetch Names for Messages
//   useEffect(() => {
//     async function fetchNamesForMessages() {
//       const uniqueSenders = [...new Set(messages.map((m) => m.sender))].filter(
//         (sender) => !fetchedNames[sender] && sender !== "system",
//       );
//       for (let sender of uniqueSenders) {
//         if (sender !== currentUserID) {
//           const fetchedName = await fetchNameFromFirestore(sender);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [sender]: fetchedName,
//             }));
//           }
//         }
//       }
//     }

//     fetchNamesForMessages();
//   }, [messages]);

//   // 5. Auto Scroll
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
//     }
//   }, [messages]);

//   // 6. Fetch Names for Thread List (Initial)
//   useEffect(() => {
//     async function fetchNamesForThread() {
//       if (!activeThread) return;

//       const userIds = activeThread.split("_");
//       for (let id of userIds) {
//         if (!fetchedNames[id]) {
//           const fetchedName = await fetchNameFromFirestore(id);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [id]: fetchedName,
//             }));
//           }
//         }
//       }
//     }

//     fetchNamesForThread();
//   }, [activeThread]);

//   const handleSendMessage = () => {
//     if (!textRef.current.value.trim() || !activeThread) return;

//     const userIds = activeThread.split("_");
//     const recipientID = userIds.find((id) => id !== currentUserID);

//     if (!recipientID) {
//       console.error("Cannot derive a valid recipient ID.");
//       return;
//     }

//     const sortedIds = [currentUserID, recipientID].sort();
//     const potentialThreadID = sortedIds.join("_");

//     const message = {
//       sender: currentUserID,
//       senderName: currentUserName,
//       senderAvatar: currentUserAvatar,
//       text: textRef.current.value.trim(),
//       timestamp: Date.now(),
//     };

//     // Current User Update
//     const currentUserMessageRef = push(
//       ref(db, `threads/${currentUserID}/${potentialThreadID}/messages`),
//     );
//     set(currentUserMessageRef, message);

//     // Recipient Update
//     const recipientUserMessageRef = push(
//       ref(db, `threads/${recipientID}/${potentialThreadID}/messages`),
//     );
//     set(recipientUserMessageRef, message);

//     // ვასუფთავებთ პირდაპირ რეფს
//     textRef.current.value = "";
//   };

//   return (
//     <div className={styles.messengerContainer}>
//       {/* მარცხენა პანელი: ჩატების სია */}
//       <div className={styles.threadsListContainer}>
//         {threads.map((thread) => {
//           const isUnread =
//             thread.lastMessage &&
//             thread.lastMessage.sender !== currentUserID &&
//             activeThread !== thread.id;
//           return (
//             <div
//               key={thread.id}
//               className={`${styles.threadItem} ${
//                 activeThread === thread.id ? styles.threadItemActive : ""
//               }`}
//               onClick={() => {
//                 setActiveThread(activeThread !== thread.id ? thread.id : null);
//               }}
//             >
//               <span>{thread.otherUserName}</span>
//               {isUnread && <span className={styles.unreadIndicator}></span>}
//             </div>
//           );
//         })}
//       </div>

//       {/* მარჯვენა პანელი: აქტიური ჩატი */}
//       {activeThread ? (
//         <div className={styles.chatContainer}>
//           {/* მესიჯების არეალი */}
//           <div className={styles.messagesArea} ref={messagesEndRef}>
//             {messages.map((message) => {
//               // ლოგიკა კლასების მისანიჭებლად
//               let msgClass = "";
//               if (message.sender === "system") {
//                 msgClass = styles.systemMsg;
//               } else if (message.sender === currentUserID) {
//                 msgClass = styles.senderMsg;
//               } else {
//                 msgClass = styles.recipientMsg;
//               }

//               return (
//                 <div
//                   key={message.id}
//                   className={`${styles.messageBubble} ${msgClass}`}
//                 >
//                   {/* თუ სხვისი მესიჯია, ავატარი გამოვაჩინოთ მარცხნივ */}
//                   {message.sender !== currentUserID &&
//                     message.sender !== "system" &&
//                     message.senderAvatar && (
//                       <img
//                         src={message.senderAvatar}
//                         alt={`${message.senderName}'s avatar`}
//                         className={styles.messageAvatar}
//                       />
//                     )}

//                   <div>
//                     {/* თუ სხვისი მესიჯია, სახელიც დავუწეროთ პატარად */}
//                     {message.sender !== currentUserID &&
//                       message.sender !== "system" && (
//                         <div
//                           style={{
//                             fontSize: "0.8rem",
//                             color: "#666",
//                             marginBottom: "4px",
//                             fontWeight: "bold",
//                           }}
//                         >
//                           {message.senderName}
//                         </div>
//                       )}

//                     <div>{renderMessageWithLinks(message?.text)}</div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ტექსტის შესაყვანი არეალი */}
//           <div className={styles.inputArea}>
//             <textarea
//               className={styles.textArea}
//               name="chat-textarea"
//               ref={textRef}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your message here..."
//             />
//             <button className={styles.sendBtn} onClick={handleSendMessage}>
//               Send
//             </button>
//           </div>
//         </div>
//       ) : (
//         /* როცა არცერთი ჩატი არაა არჩეული, ლამაზად ჩანს ცენტრში */
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#888",
//             backgroundColor: "#f9f9f9",
//           }}
//         >
//           <h2>Select a conversation to start chatting</h2>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(RealtimeChat);

// import React, { useState, useEffect, memo, useRef } from "react";
// import { doc, getFirestore, getDoc } from "firebase/firestore";
// import { getDatabase, ref, onValue, set, push, off } from "firebase/database";
// import { auth } from "../../../FirebaseConfig/firebaseConfig";
// import fallbackAvatar from "../../../assets/fallback-avatar.png";
// import { renderMessageWithLinks } from "../../../Utilities/renderMessageWithLinks";
// import styles from "./chat.module.css";

// const RealtimeChat = () => {
//   const [fetchedNames, setFetchedNames] = useState({});
//   const [messages, setMessages] = useState([]);
//   const [threads, setThreads] = useState([]);
//   const [activeThread, setActiveThread] = useState(null);

//   const messagesEndRef = useRef(null);
//   const textRef = useRef("");

//   const db = getDatabase();
//   const currentUserID = auth?.currentUser?.uid;
//   const currentUserName =
//     auth?.currentUser?.displayName || auth?.currentUser?.email?.split("@")[0];
//   const currentUserAvatar = auth?.currentUser?.photoURL || fallbackAvatar;

//   const ownerID = localStorage.getItem("ownerID");

//   const fetchNameFromFirestore = async (id) => {
//     let ownerDetail = localStorage.getItem(`ownerDetails-${id}`);
//     if (ownerDetail) {
//       return JSON.parse(ownerDetail).uniqueName;
//     }

//     let allOwnerDetails = JSON.parse(
//       localStorage.getItem("ownerDetails") || "{}",
//     );
//     if (allOwnerDetails[id] && allOwnerDetails[id].uniqueName) {
//       return allOwnerDetails[id].uniqueName;
//     }

//     const firestoreDB = getFirestore();
//     const userRef = doc(firestoreDB, "users", id);
//     const userDoc = await getDoc(userRef);

//     if (userDoc.exists()) {
//       const userName = userDoc.data().uniqueName;
//       if (userName) {
//         localStorage.setItem(
//           `ownerDetails-${id}`,
//           JSON.stringify({ uniqueName: userName }),
//         );
//         return userName;
//       }
//     }
//     return null;
//   };

//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" && !event.shiftKey) {
//       event.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const tempFetchedNamesRef = useRef({ ...fetchedNames });

//   useEffect(() => {
//     if (!currentUserID || !ownerID || currentUserID === ownerID) return;

//     const sortedIds = [currentUserID, ownerID].sort();
//     const potentialThreadID = sortedIds.join("_");
//     const potentialThreadRef = ref(
//       db,
//       `threads/${currentUserID}/${potentialThreadID}/messages`,
//     );

//     onValue(potentialThreadRef, (snapshot) => {
//       if (!snapshot.val()) {
//         const initialMessage = {
//           sender: "system",
//           text: "Welcome to the chat! Start your conversation here.",
//           timestamp: Date.now(),
//         };
//         const newMessageRef = push(potentialThreadRef);
//         set(newMessageRef, initialMessage);
//       }
//     });

//     return () => off(potentialThreadRef);
//   }, [currentUserID, ownerID]);

//   useEffect(() => {
//     const threadsRef = ref(db, `threads/${currentUserID}`);
//     onValue(threadsRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (data) {
//         const relevantThreads = Object.keys(data).map(async (threadID) => {
//           const userIds = threadID.split("_");
//           const otherUserId = userIds.find((id) => id !== currentUserID);

//           const name = await fetchNameFromFirestore(otherUserId);
//           tempFetchedNamesRef.current[otherUserId] = name || "Unknown";

//           return {
//             id: threadID,
//             otherUserName: name,
//             lastMessage: data[threadID].messages
//               ? Object.values(data[threadID].messages).pop()
//               : null,
//             unread: false,
//           };
//         });

//         const resolvedThreads = await Promise.all(relevantThreads);
//         setThreads(resolvedThreads);
//         const newNames = { ...tempFetchedNamesRef.current };
//         if (JSON.stringify(newNames) !== JSON.stringify(fetchedNames)) {
//           setFetchedNames(newNames);
//         }
//       }
//     });

//     return () => off(threadsRef);
//   }, [currentUserID]);

//   useEffect(() => {
//     if (!activeThread) return;

//     const threadRef = ref(
//       db,
//       `threads/${currentUserID}/${activeThread}/messages`,
//     );
//     onValue(threadRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const loadedMessages = Object.keys(data).map((key) => ({
//           id: key,
//           ...data[key],
//         }));
//         setMessages(loadedMessages);
//       }
//     });

//     return () => off(threadRef);
//   }, [activeThread]);

//   useEffect(() => {
//     async function fetchNamesForMessages() {
//       const uniqueSenders = [...new Set(messages.map((m) => m.sender))].filter(
//         (sender) => !fetchedNames[sender] && sender !== "system",
//       );
//       for (let sender of uniqueSenders) {
//         if (sender !== currentUserID) {
//           const fetchedName = await fetchNameFromFirestore(sender);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [sender]: fetchedName,
//             }));
//           }
//         }
//       }
//     }
//     fetchNamesForMessages();
//   }, [messages]);

//   // ✅ გასწორებული Auto-Scroll: scrollIntoView რბილად და ზუსტად ჩადის ქვემოთ
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   useEffect(() => {
//     async function fetchNamesForThread() {
//       if (!activeThread) return;

//       const userIds = activeThread.split("_");
//       for (let id of userIds) {
//         if (!fetchedNames[id]) {
//           const fetchedName = await fetchNameFromFirestore(id);
//           if (fetchedName) {
//             setFetchedNames((prev) => ({
//               ...prev,
//               [id]: fetchedName,
//             }));
//           }
//         }
//       }
//     }
//     fetchNamesForThread();
//   }, [activeThread]);

//   const handleSendMessage = () => {
//     if (!textRef.current.value.trim() || !activeThread) return;

//     const userIds = activeThread.split("_");
//     const recipientID = userIds.find((id) => id !== currentUserID);

//     if (!recipientID) return;

//     const sortedIds = [currentUserID, recipientID].sort();
//     const potentialThreadID = sortedIds.join("_");

//     const message = {
//       sender: currentUserID,
//       senderName: currentUserName,
//       senderAvatar: currentUserAvatar,
//       text: textRef.current.value.trim(),
//       timestamp: Date.now(),
//     };

//     const currentUserMessageRef = push(
//       ref(db, `threads/${currentUserID}/${potentialThreadID}/messages`),
//     );
//     set(currentUserMessageRef, message);

//     const recipientUserMessageRef = push(
//       ref(db, `threads/${recipientID}/${potentialThreadID}/messages`),
//     );
//     set(recipientUserMessageRef, message);

//     textRef.current.value = "";
//   };

//   return (
//     <div className={styles.messengerContainer}>
//       {/* მარცხენა პანელი */}
//       <div className={styles.threadsListContainer}>
//         {threads.map((thread) => {
//           const isUnread =
//             thread.lastMessage &&
//             thread.lastMessage.sender !== currentUserID &&
//             activeThread !== thread.id;
//           return (
//             <div
//               key={thread.id}
//               className={`${styles.threadItem} ${
//                 activeThread === thread.id ? styles.threadItemActive : ""
//               }`}
//               onClick={() => {
//                 setActiveThread(activeThread !== thread.id ? thread.id : null);
//               }}
//             >
//               <span>{thread.otherUserName}</span>
//               {isUnread && <span className={styles.unreadIndicator}></span>}
//             </div>
//           );
//         })}
//       </div>

//       {activeThread ? (
//         <div className={styles.chatContainer}>
//           <div className={styles.messagesArea}>
//             {messages.map((message) => {
//               let msgClass = "";
//               if (message.sender === "system") {
//                 msgClass = styles.systemMsg;
//               } else if (message.sender === currentUserID) {
//                 msgClass = styles.senderMsg;
//               } else {
//                 msgClass = styles.recipientMsg;
//               }

//               return (
//                 <div
//                   key={message.id}
//                   className={`${styles.messageBubble} ${msgClass}`}
//                 >
//                   {message.sender !== currentUserID &&
//                     message.sender !== "system" &&
//                     message.senderAvatar && (
//                       <img
//                         src={message.senderAvatar}
//                         alt={`${message.senderName}'s avatar`}
//                         className={styles.messageAvatar}
//                       />
//                     )}

//                   <div style={{ display: "flex", flexDirection: "column" }}>
//                     {message.sender !== currentUserID &&
//                       message.sender !== "system" && (
//                         <span
//                           style={{
//                             fontSize: "0.75rem",
//                             color: "#64748b",
//                             marginBottom: "4px",
//                             fontWeight: "700",
//                           }}
//                         >
//                           {message.senderName}
//                         </span>
//                       )}

//                     <span>{renderMessageWithLinks(message?.text)}</span>
//                   </div>
//                 </div>
//               );
//             })}
//             {/* ✅ Dummy element ბოლოში, რომ იდეალურად დაისქროლოს */}
//             <div ref={messagesEndRef} />
//           </div>

//           <div className={styles.inputArea}>
//             <textarea
//               className={styles.textArea}
//               name="chat-textarea"
//               ref={textRef}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your message here..."
//             />
//             <button className={styles.sendBtn} onClick={handleSendMessage}>
//               Send
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div
//           style={{
//             flex: 1,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#94a3b8",
//             backgroundColor: "#f8fafc",
//           }}
//         >
//           <h2>Select a conversation to start</h2>
//         </div>
//       )}
//     </div>
//   );
// };

// export default memo(RealtimeChat);

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
