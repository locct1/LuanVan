import { set } from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { uid } from 'uid';
import firebase, { db } from '~/firebase/config';
import { addDocument, generateKeywords } from '~/firebase/services';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import useFirestore from '~/hooks/useFirestore';
import { infoAdminSelector } from '~/redux/selectors';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function ListChats() {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, listen } = useSpeechRecognition();

    const [textMessage, setTextMessage] = useState('');
    const [selectedRoom, setSelectedRoom] = useState();
    const [messagesOfRoom, setMessagesOfRoom] = useState();
    const [currenUser, setCurrentUser] = useState();
    const [useMicro, setUseMicro] = useState(false);

    const selectedRoomRef = useRef();
    const currentUserRef = useRef();
    const handleShowMessage = async () => {};
    const handleChangeTextMessage = async (e) => {
        if (textMessage === '') {
            const message = messages.find(
                (u) => u.roomId === selectedRoom.id && u.uid === currenUser.uid && u.isTyping === true,
            );
            if (message) {
            } else {
                const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                const now = new Date();
                const createdAt = new Date(now.getTime() + oneDayInMillis);
                addDocument('messages', {
                    text: e.target.value,
                    uid: currenUser.uid,
                    roomId: selectedRoom.id,
                    fullName: infoAdmin.fullName,
                    isTyping: true,
                    createdAt: firebase.firestore.Timestamp.fromMillis(createdAt.getTime()),
                });
            }
        }
        if (textMessage !== '' && e.target.value === '') {
            db.collection('messages')
                .where('isTyping', '==', true)
                .where('roomId', '==', selectedRoom.id)
                .where('uid', '==', currenUser.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.docs[0].ref.delete();
                });
        }
        setTextMessage(e.target.value);
    };
    const handleSendTextMessage = async () => {
        db.collection('messages')
            .where('isTyping', '==', true)
            .where('roomId', '==', selectedRoom.id)
            .where('uid', '==', currenUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs[0].ref.update({
                    text: textMessage,
                    isTyping: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            });
        setTextMessage('');
    };
    const rooms = useFirestore('rooms');
    const users = useFirestore('users');
    const handleSelectedRoom = async (room) => {
        let oldRoom = selectedRoom;
        const user = users.find((u) => u.uid === room.ownerRoomId);
        room.owner = user;
        setSelectedRoom(room);
        selectedRoomRef.current = room;
        db.collection('messages')
            .where('isTyping', '==', true)
            .where('roomId', '==', oldRoom.id)
            .where('uid', '==', currenUser.uid)
            .get()
            .then((querySnapshot) => {
                querySnapshot.docs[0].ref.delete();
            });
        setTextMessage('');
        if (messageListRef?.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
    };
    const infoAdmin = useSelector(infoAdminSelector);
    const createAccountAdmin = async () => {
        if (users && users.length > 0) {
            const user = users.find((u) => u.systemId === infoAdmin.id);
            if (user) {
                currentUserRef.current = user;
                setCurrentUser(user);
            } else {
                let response = await addDocument('users', {
                    fullName: infoAdmin.fullName,
                    phoneNumber: infoAdmin.phoneNumber,
                    isMan: true,
                    uid: uid(),
                    keywords: generateKeywords(infoAdmin.fullName?.toLowerCase()),
                    systemId: infoAdmin.id,
                    role: 'Admin',
                });
                currentUserRef.current = response;
                setCurrentUser(response);
            }
        }
    };
    useEffect(() => {
        createAccountAdmin();
    }, [infoAdmin, users]);
    useEffect(() => {
        if (rooms && rooms.length > 0 && selectedRoom) {
            let room = rooms.find((u) => u.id === selectedRoom.id);
            const user = users.find((u) => u.uid === room.ownerRoomId);
            room.owner = user;
            setSelectedRoom(room);
        }
    }, [rooms, users]);

    const connectToRoom = async () => {
        const roomRef = db.collection('rooms').doc(selectedRoom.id);

        // Make a copy of the existing members array and add currentUser.uid
        const updatedMembers = [...selectedRoom.members, currenUser.uid];
        roomRef.update({
            members: updatedMembers,
            isConnected: true,
        });
    };
    const allMessages = useFirestore('messages');
    const condition = useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom?.id || '',
        }),
        [selectedRoom, allMessages], // Thêm allMessages vào đây
    );
    const messages = allMessages.filter((message) => message.roomId === selectedRoom?.id);
    const findLastMessageForRoom = (roomId) => {
        const messagesForRoom = allMessages.filter((message) => message.roomId === roomId);

        // Sắp xếp các tin nhắn theo trường thời gian tạo (createdAt) theo thứ tự giảm dần.
        messagesForRoom.sort((a, b) => b.createdAt - a.createdAt);

        // // Lặp qua các tin nhắn đã sắp xếp để tìm tin nhắn gần nhất (đã sắp xếp trước).
        // for (let i = 0; i < messagesForRoom.length; i++) {
        //     const message = messagesForRoom[i];
        //     if (!message.isTyping) {
        //         // Nếu tin nhắn không phải "đang gõ", trả về tin nhắn đó.
        //         return message;
        //     }
        // }
        if (messagesForRoom[0]) {
            return messagesForRoom[0];
        }
        // Nếu không tìm thấy tin nhắn không phải "đang gõ", trả về undefined.
        return undefined;
    };
    let lastPrintedDate = null;
    useEffect(() => {
        return () => {
            const roomRef = db.collection('messages');
            roomRef
                .where('roomId', '==', selectedRoomRef.current?.id || '') // Lọc the documents
                .where('isTyping', '==', true)
                .where('uid', '==', currentUserRef.current.uid || '')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        doc.ref
                            .delete()
                            .then(() => {
                                console.log('Document đã bị xóa thành công!');
                            })
                            .catch((error) => {
                                console.error('Lỗi khi xóa document:', error);
                            });
                    });
                })
                .catch((error) => {
                    console.error('Lỗi khi truy vấn tin nhắn:', error);
                });
        };
    }, []);
    const messageListRef = useRef(null);
    useEffect(() => {
        // scroll to bottom after message changed
        if (messageListRef?.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
    }, [allMessages]);
    useEffect(() => {
        if (transcript && useMicro === true) {
            if (textMessage === '') {
                const message = messages.find(
                    (u) => u.roomId === selectedRoom.id && u.uid === currenUser.uid && u.isTyping === true,
                );
                if (message) {
                } else {
                    const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                    const now = new Date();
                    const createdAt = new Date(now.getTime() + oneDayInMillis);
                    addDocument('messages', {
                        text: transcript,
                        uid: currenUser.uid,
                        roomId: selectedRoom.id,
                        fullName: currenUser.fullName,
                        isTyping: true,
                        createdAt: firebase.firestore.Timestamp.fromMillis(createdAt.getTime()),
                    });
                }
            }
            if (textMessage !== '' && transcript === '') {
                db.collection('messages')
                    .where('isTyping', '==', true)
                    .where('roomId', '==', selectedRoom.id ?? '')
                    .where('uid', '==', currenUser.uid ?? '')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.docs[0].ref.delete();
                    });
            }
            setTextMessage(transcript);
        }
    }, [transcript]);
    useEffect(() => {
        if (!listening) {
            setUseMicro(false);
        }
    }, [listening]);
    const handleStartListening = (event) => {
        setUseMicro(true);
        SpeechRecognition.startListening({ language: 'vi-VN' });
    };
    return (
        <>
            <div className="container-fluid mt-5">
                <h4 className="text-dark font-weight-bold">Chat trực tuyến với khách hàng</h4>
            </div>
            <div className="container-fluid mt-5">
                <div className="row">
                    <div className="col-5">
                        <div className="card card-admin">
                            <div className="card-header card-header-admin">
                                {' '}
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        name
                                        className="form-control search-admin type_msg_search_admin"
                                    />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text search_btn_admin">
                                            <i className="fas fa-search" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body overflow-auto">
                                {rooms && rooms.length > 0 ? (
                                    rooms.map((room, index) => {
                                        // Find the corresponding user from the 'users' collection
                                        const user = users.find((u) => u.uid === room.ownerRoomId);
                                        return (
                                            <div
                                                key={index}
                                                className={`row p-2 ${
                                                    selectedRoom === room ? 'bg-selected-client-message' : ''
                                                } mb-4`}
                                                onClick={() => handleSelectedRoom(room)}
                                            >
                                                <div className="col-12">
                                                    <div className="row">
                                                        <div className="col-1">
                                                            <div className="avatar-message-admin">
                                                                {user?.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                            </div>
                                                        </div>
                                                        <div className="col-11">
                                                            <p className="ml-2 text-light mt-2 mb-0">
                                                                {user ? user.fullName : 'User Not Found'}
                                                                <span className="text-light ml-2">
                                                                    ({user ? user.providerId : 'User Not Found'})
                                                                </span>
                                                            </p>
                                                            {findLastMessageForRoom(room.id) ? (
                                                                <p className="ml-2 text-light mb-0">
                                                                    {currenUser?.uid ===
                                                                    findLastMessageForRoom(room.id).uid ? (
                                                                        <span className="font-weight-bold text-light">
                                                                            Bạn:
                                                                        </span>
                                                                    ) : (
                                                                        <>Tin nhắn: </>
                                                                    )}
                                                                    {findLastMessageForRoom(room.id).isTyping ? (
                                                                        <>
                                                                            <div
                                                                                class="spinner-grow mr-1 ml-1"
                                                                                role="status"
                                                                            >
                                                                                <span class="sr-only">Loading...</span>
                                                                            </div>
                                                                            <div
                                                                                class="spinner-grow mr-1"
                                                                                role="status"
                                                                            >
                                                                                <span class="sr-only">Loading...</span>
                                                                            </div>
                                                                            <div class="spinner-grow" role="status">
                                                                                <span class="sr-only">Loading...</span>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {findLastMessageForRoom(room.id).text !==
                                                                            null ? (
                                                                                <span className="ml-1">
                                                                                    {
                                                                                        findLastMessageForRoom(room.id)
                                                                                            .text
                                                                                    }
                                                                                </span>
                                                                            ) : (
                                                                                <span className="ml-1">Hình ảnh</span>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                    </div>
                    {selectedRoom ? (
                        <>
                            <div className="col-7">
                                <div
                                    className="card shadow-lg bg-white rounded background-message"
                                    style={{ height: '75vh' }}
                                >
                                    <div class="card-header background-message">
                                        <div className="row">
                                            <div className="col-10 d-flex">
                                                <div className="avatar-message-admin">
                                                    {' '}
                                                    {selectedRoom?.owner?.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                </div>
                                                <p className="ml-2 text-light mt-2">
                                                    {selectedRoom?.owner?.fullName
                                                        ? selectedRoom.owner.fullName
                                                        : 'User Not Found'}
                                                </p>
                                            </div>
                                            {selectedRoom && selectedRoom.isConnected ? (
                                                <></>
                                            ) : (
                                                <>
                                                    {' '}
                                                    <div
                                                        className="col-2 d-flex justify-content-end"
                                                        onClick={() => connectToRoom()}
                                                    >
                                                        <button type="button" class="btn btn-secondary ml-5">
                                                            Kết nối
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div class="card-body overflow-auto" ref={messageListRef}>
                                        {messages && messages.length > 0 ? (
                                            messages.map((item, index) => {
                                                if (
                                                    item.createdAt &&
                                                    item.createdAt.seconds !== null &&
                                                    item.createdAt.nanoseconds !== null
                                                ) {
                                                    const currentMessageDate = moment(
                                                        new Date(
                                                            item.createdAt.seconds * 1000 +
                                                                item.createdAt.nanoseconds / 1000000,
                                                        ),
                                                    );
                                                    const shouldPrintDate =
                                                        !lastPrintedDate ||
                                                        !lastPrintedDate.isSame(currentMessageDate, 'day');

                                                    if (shouldPrintDate && item.isTyping === false) {
                                                        // In ra ngày và tháng của tin nhắn hiện tại
                                                        lastPrintedDate = currentMessageDate;
                                                        let dateText = capitalizeFirstLetter(
                                                            currentMessageDate.format('dddd, DD/MM/YYYY'),
                                                        );
                                                        // Check if it's today
                                                        if (currentMessageDate.isSame(moment(), 'day')) {
                                                            dateText =
                                                                'Hôm nay, ' +
                                                                capitalizeFirstLetter(
                                                                    currentMessageDate.format('DD/MM/YYYY'),
                                                                );
                                                        }
                                                        return (
                                                            <>
                                                                {' '}
                                                                <div className="row" key={index}>
                                                                    <div className="col-12 text-center text-light">
                                                                        {dateText}
                                                                    </div>
                                                                </div>
                                                                <div className="row" key={index}>
                                                                    {item.isTyping && item.uid !== currenUser.uid && (
                                                                        // Display the loading spinner only if isTyping is true and
                                                                        // the message is not from the current user
                                                                        <div className="col-12 d-flex">
                                                                            <div className="avatar-message mt-2">
                                                                                {item.fullName
                                                                                    .split(' ')
                                                                                    .slice(-1)[0]
                                                                                    .charAt(0)}
                                                                            </div>
                                                                            <p className="ml-2 text-dark text-chat-message">
                                                                                <div
                                                                                    class="spinner-grow mr-1"
                                                                                    role="status"
                                                                                >
                                                                                    <span class="sr-only">
                                                                                        Loading...
                                                                                    </span>
                                                                                </div>
                                                                                <div
                                                                                    class="spinner-grow mr-1"
                                                                                    role="status"
                                                                                >
                                                                                    <span class="sr-only">
                                                                                        Loading...
                                                                                    </span>
                                                                                </div>
                                                                                <div class="spinner-grow" role="status">
                                                                                    <span class="sr-only">
                                                                                        Loading...
                                                                                    </span>
                                                                                </div>
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {item.uid === currenUser.uid &&
                                                                        item.isTyping === false && (
                                                                            // Display the message from the current user
                                                                            <div className="col-12 d-flex justify-content-end mt-3">
                                                                                {item.text !== null ? (
                                                                                    <>
                                                                                        <span
                                                                                            className="mt-3 ml-2 text-light"
                                                                                            style={{ fontSize: '11px' }}
                                                                                        >
                                                                                            {item.createdAt?.seconds &&
                                                                                                item.createdAt
                                                                                                    ?.nanoseconds &&
                                                                                                moment(
                                                                                                    new Date(
                                                                                                        item.createdAt
                                                                                                            .seconds *
                                                                                                            1000 +
                                                                                                            item
                                                                                                                .createdAt
                                                                                                                .nanoseconds /
                                                                                                                1000000,
                                                                                                    ),
                                                                                                ).format('hh:mm')}
                                                                                        </span>
                                                                                        <p className="ml-2 text-dark text-chat-message-owner">
                                                                                            {item.text}{' '}
                                                                                        </p>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <img
                                                                                            className="ml-2"
                                                                                            src={item.image}
                                                                                            alt="sa"
                                                                                            style={{
                                                                                                maxWidth: '100%',
                                                                                                width: '40%',
                                                                                            }}
                                                                                        />
                                                                                    </>
                                                                                )}
                                                                                <div className="avatar-message mt-2 ml-2">
                                                                                    {' '}
                                                                                    {item.fullName
                                                                                        .split(' ')
                                                                                        .slice(-1)[0]
                                                                                        .charAt(0)}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    {item.uid !== currenUser.uid &&
                                                                        item.isTyping === false && (
                                                                            // Display messages from other users
                                                                            <div className="col-12 d-flex">
                                                                                <div className="avatar-message mt-2">
                                                                                    {' '}
                                                                                    {item.fullName
                                                                                        .split(' ')
                                                                                        .slice(-1)[0]
                                                                                        .charAt(0)}
                                                                                </div>

                                                                                <p className="ml-2 text-dark text-chat-message">
                                                                                    {item.text}
                                                                                </p>
                                                                                <span
                                                                                    className="mt-3 ml-2 text-light"
                                                                                    style={{ fontSize: '11px' }}
                                                                                >
                                                                                    {item.createdAt?.seconds &&
                                                                                        item.createdAt?.nanoseconds &&
                                                                                        moment(
                                                                                            new Date(
                                                                                                item.createdAt.seconds *
                                                                                                    1000 +
                                                                                                    item.createdAt
                                                                                                        .nanoseconds /
                                                                                                        1000000,
                                                                                            ),
                                                                                        ).format('hh:mm')}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                }
                                                return (
                                                    <div className="row" key={index}>
                                                        {item.isTyping && item.uid !== currenUser.uid && (
                                                            // Display the loading spinner only if isTyping is true and
                                                            // the message is not from the current user
                                                            <div className="col-8 d-flex">
                                                                <div className="avatar-message mt-2">
                                                                    {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                                </div>
                                                                <p className="ml-2 text-dark text-chat-message">
                                                                    <div class="spinner-grow mr-1" role="status">
                                                                        <span class="sr-only">Loading...</span>
                                                                    </div>
                                                                    <div class="spinner-grow mr-1" role="status">
                                                                        <span class="sr-only">Loading...</span>
                                                                    </div>
                                                                    <div class="spinner-grow" role="status">
                                                                        <span class="sr-only">Loading...</span>
                                                                    </div>
                                                                </p>
                                                            </div>
                                                        )}
                                                        {item.uid === currenUser.uid && item.isTyping === false && (
                                                            // Display the message from the current user
                                                            <div className="col-12 d-flex justify-content-end mt-3">
                                                                {item.text !== null ? (
                                                                    <>
                                                                        <span
                                                                            className="mt-3 ml-2 text-light"
                                                                            style={{ fontSize: '11px' }}
                                                                        >
                                                                            {item.createdAt?.seconds &&
                                                                                item.createdAt?.nanoseconds &&
                                                                                moment(
                                                                                    new Date(
                                                                                        item.createdAt.seconds * 1000 +
                                                                                            item.createdAt.nanoseconds /
                                                                                                1000000,
                                                                                    ),
                                                                                ).format('hh:mm')}
                                                                        </span>
                                                                        <p className="ml-2 text-dark text-chat-message-owner">
                                                                            {item.text}{' '}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img
                                                                            className="ml-2"
                                                                            src={item.image}
                                                                            alt="sa"
                                                                            style={{ maxWidth: '100%', width: '40%' }}
                                                                        />
                                                                    </>
                                                                )}
                                                                <div className="avatar-message mt-2 ml-2">
                                                                    {' '}
                                                                    {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {item.uid !== currenUser.uid && item.isTyping === false && (
                                                            // Display messages from other users
                                                            <div className="col-12 d-flex">
                                                                <div className="avatar-message mt-2">
                                                                    {' '}
                                                                    {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                                </div>
                                                                {item.text !== null ? (
                                                                    <>
                                                                        <p className="ml-2 text-dark text-chat-message">
                                                                            {item.text}
                                                                        </p>
                                                                        <span
                                                                            className="mt-3 ml-2 text-light"
                                                                            style={{ fontSize: '11px' }}
                                                                        >
                                                                            {item.createdAt?.seconds &&
                                                                                item.createdAt?.nanoseconds &&
                                                                                moment(
                                                                                    new Date(
                                                                                        item.createdAt.seconds * 1000 +
                                                                                            item.createdAt.nanoseconds /
                                                                                                1000000,
                                                                                    ),
                                                                                ).format('hh:mm')}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img
                                                                            className="ml-2 mb-4"
                                                                            src={item.image}
                                                                            alt="sa"
                                                                            style={{ maxWidth: '100%', width: '40%' }}
                                                                        />
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <></>
                                        )}
                                        {/* {messages && messages.length > 0 ? (
                                            messages.map((item, index) => (
                                                <div className="row" key={index}>
                                                    {item.isTyping && item.uid !== currenUser.uid && (
                                                        // Display the loading spinner only if isTyping is true and
                                                        // the message is not from the current user
                                                        <div className="col-8 d-flex">
                                                            <div className="avatar-message mt-2">
                                                                {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                            </div>
                                                            <p className="ml-2 text-dark text-chat-message">
                                                                <div class="spinner-grow mr-1" role="status">
                                                                    <span class="sr-only">Loading...</span>
                                                                </div>
                                                                <div class="spinner-grow mr-1" role="status">
                                                                    <span class="sr-only">Loading...</span>
                                                                </div>
                                                                <div class="spinner-grow" role="status">
                                                                    <span class="sr-only">Loading...</span>
                                                                </div>
                                                            </p>
                                                        </div>
                                                    )}
                                                    {item.uid === currenUser.uid && item.isTyping === false && (
                                                        // Display the message from the current user
                                                        <>
                                                            <div className="col-12 d-flex justify-content-end">
                                                                {item.text !== null ? (
                                                                    <>
                                                                        <span
                                                                            className="mt-3 ml-2 text-light"
                                                                            style={{ fontSize: '11px' }}
                                                                        >
                                                                            {item.createdAt?.seconds &&
                                                                                item.createdAt?.nanoseconds &&
                                                                                moment(
                                                                                    new Date(
                                                                                        item.createdAt.seconds * 1000 +
                                                                                            item.createdAt.nanoseconds /
                                                                                                1000000,
                                                                                    ),
                                                                                ).format('HH:mm')}
                                                                        </span>
                                                                        <p className="ml-2 text-dark text-chat-message-owner">
                                                                            {item.text}
                                                                        </p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img
                                                                            src={item.image}
                                                                            alt="sa"
                                                                            style={{ maxWidth: '100%', width: '40%' }}
                                                                        />
                                                                    </>
                                                                )}
                                                                <div className="avatar-message mt-2 ml-2">
                                                                    {' '}
                                                                    {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                    {item.uid !== currenUser.uid && item.isTyping === false && (
                                                        // Display messages from other users
                                                        <div className="col-8 d-flex mt-3">
                                                            <div className="avatar-message mt-3">
                                                                {' '}
                                                                {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                            </div>
                                                            {item.text !== null ? (
                                                                <>
                                                                    <p className="ml-2 text-dark text-chat-message-owner">
                                                                        {item.text}
                                                                    </p>
                                                                    <span
                                                                        className="mt-3 ml-2 text-light"
                                                                        style={{ fontSize: '11px' }}
                                                                    >
                                                                        {item.createdAt?.seconds &&
                                                                            item.createdAt?.nanoseconds &&
                                                                            moment(
                                                                                new Date(
                                                                                    item.createdAt.seconds * 1000 +
                                                                                        item.createdAt.nanoseconds /
                                                                                            1000000,
                                                                                ),
                                                                            ).format('HH:mm')}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <img
                                                                        className="ml-2"
                                                                        src={item.image}
                                                                        alt="sa"
                                                                        style={{ maxWidth: '100%', width: '40%' }}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <></>
                                        )} */}
                                    </div>
                                    {selectedRoom &&
                                    selectedRoom.isConnected &&
                                    selectedRoom?.members[1] === currenUser.uid ? (
                                        <>
                                            {' '}
                                            <div className="card-footer card-footer-custom-message background-message">
                                                <div className="input-group">
                                                    <div className="input-group-append">
                                                        <span className="input-group-text attach_btn_custom_message">
                                                            <i className="fas fa-paperclip" />
                                                        </span>
                                                    </div>
                                                    <textarea
                                                        name
                                                        className="form-control type_msg_custom_message text-light"
                                                        placeholder="Nhập tin nhắn..."
                                                        value={textMessage}
                                                        onChange={(e) => handleChangeTextMessage(e)}
                                                    />
                                                    {listening && useMicro ? (
                                                        <>
                                                            <span className="input-group-text send_btn_custom_message send_btn_micro">
                                                                <i
                                                                    class="fas fa-stop-circle"
                                                                    onClick={SpeechRecognition.stopListening}
                                                                ></i>
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span
                                                                className="input-group-text send_btn_custom_message send_btn_micro"
                                                                onClick={() => handleStartListening()}
                                                            >
                                                                <i class="fas fa-microphone"></i>
                                                            </span>
                                                        </>
                                                    )}

                                                    {textMessage && textMessage !== '' ? (
                                                        <>
                                                            {' '}
                                                            <div
                                                                className="input-group-append"
                                                                onClick={() => handleSendTextMessage()}
                                                            >
                                                                <span className="input-group-text send_btn_custom_message">
                                                                    <i className="fas fa-location-arrow" />
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="card-footer card-footer-custom-message background-message">
                                                <div className="row">
                                                    <div className="col-12 text-center">
                                                        <p className="text-light font-weight-bold">
                                                            Chịu trách nhiệm: {''}
                                                            {
                                                                users.find((u) => u.uid === selectedRoom?.members[1])
                                                                    .fullName
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </>
    );
}

export default ListChats;
