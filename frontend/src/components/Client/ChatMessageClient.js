import { NavLink, Link } from 'react-router-dom';
//import '~/assets/client/css/bootstrap.min.css';
//import '~/assets/client/css/style.css';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { addDocument, generateKeywords } from '~/firebase/services';
import { uid } from 'uid';
import clientChatMessageSlice from '~/redux/Slices/ClientChatMessageSlice';
import { useDispatch, useSelector } from 'react-redux';
import { infoRoomClientChatMessageSelector } from '~/redux/selectors';
import useFirestore from '~/hooks/useFirestore';
import firebase, { auth, db, storage } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';
import moment from 'moment';
import { capitalizeFirstLetter } from '~/helpers/covertString';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function ChatMessageClient() {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition, listen } = useSpeechRecognition();
    const infoRoomClientChatMessage = useSelector(infoRoomClientChatMessageSelector);
    const [show, setShow] = useState(false);
    const [useMicro, setUseMicro] = useState(false);
    const [textMessage, setTextMessage] = useState('');
    const currentUserRef = useRef();
    const currentRoomrRef = useRef();
    const handleShowMessage = async () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
        setShow(!show);
    };
    const schema = yup
        .object()
        .shape({
            fullName: yup.string().required('Vui lòng nhập họ và tên'),
            phoneNumber: yup.string().matches(/((09|03|07|08|05)+([0-9]{8})\b)/g, 'Số điện thoại không hợp lệ.'),
            isMan: yup.number().required('Vui lòng chọn thành phố'),
        })
        .required();
    const {
        register,
        resetField,
        handleSubmit,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
    });
    const dispatch = useDispatch();
    const { currentUserChatMessage } = useContext(AuthContext);
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const onSubmit = async (data) => {
        let createUid = uid();

        await addDocument('users', {
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            isMan: data.isMan === 1 ? true : false,
            uid: createUid,
            role: 'KhachHang',
            keywords: generateKeywords(data.fullName?.toLowerCase()),
        });
        let response = await addDocument('rooms', { members: [createUid], ownerRoomId: createUid });
        dispatch(
            clientChatMessageSlice.actions.createClientChatMessage({
                clientChatMessage: {
                    ...data,
                    uid: createUid,
                    roomId: response.id,
                },
            }),
        );
    };
    const allMessages = useFirestore('messages');
    const condition = useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValue: infoRoomClientChatMessage ?? '',
        }),
        [infoRoomClientChatMessage, allMessages],
    );
    const messagesClient = allMessages.filter((message) => message.roomId === infoRoomClientChatMessage);
    console.log('check', messagesClient);
    const handleChangeTextMessage = async (e) => {
        if (textMessage === '') {
            const message = messagesClient.find(
                (u) =>
                    u.roomId === infoRoomClientChatMessage &&
                    u.uid === currentUserChatMessage.uid &&
                    u.isTyping === true,
            );
            if (message) {
            } else {
                const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                const now = new Date();
                const createdAt = new Date(now.getTime() + oneDayInMillis);
                addDocument('messages', {
                    text: e.target.value,
                    uid: currentUserChatMessage.uid,
                    roomId: infoRoomClientChatMessage,
                    fullName: currentUserChatMessage.fullName,
                    isTyping: true,
                    createdAt: firebase.firestore.Timestamp.fromMillis(createdAt.getTime()),
                });
            }
        }
        if (textMessage !== '' && e.target.value === '') {
            db.collection('messages')
                .where('isTyping', '==', true)
                .where('roomId', '==', infoRoomClientChatMessage ?? '')
                .where('uid', '==', currentUserChatMessage.uid ?? '')
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
            .where('roomId', '==', infoRoomClientChatMessage ?? '')
            .where('uid', '==', currentUserChatMessage.uid ?? '')
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
    useEffect(() => {
        if (infoRoomClientChatMessage) {
            currentUserRef.current = currentUserChatMessage;
            currentRoomrRef.current = infoRoomClientChatMessage;
        }
    }, [infoRoomClientChatMessage, currentUserChatMessage]);
    useEffect(() => {
        if (transcript && useMicro === true) {
            if (textMessage === '') {
                const message = messagesClient.find(
                    (u) =>
                        u.roomId === infoRoomClientChatMessage &&
                        u.uid === currentUserChatMessage.uid &&
                        u.isTyping === true,
                );
                if (message) {
                } else {
                    const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                    const now = new Date();
                    const createdAt = new Date(now.getTime() + oneDayInMillis);
                    addDocument('messages', {
                        text: transcript,
                        uid: currentUserChatMessage.uid,
                        roomId: infoRoomClientChatMessage,
                        fullName: currentUserChatMessage.fullName,
                        isTyping: true,
                        createdAt: firebase.firestore.Timestamp.fromMillis(createdAt.getTime()),
                    });
                }
            }
            if (textMessage !== '' && transcript === '') {
                db.collection('messages')
                    .where('isTyping', '==', true)
                    .where('roomId', '==', infoRoomClientChatMessage ?? '')
                    .where('uid', '==', currentUserChatMessage.uid ?? '')
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.docs[0].ref.delete();
                    });
            }
            setTextMessage(transcript);
        }
    }, [transcript]);
    useEffect(() => {
        if (currentUserChatMessage) {
            db.collection('rooms')
                .where('ownerRoomId', '==', currentUserChatMessage.uid ?? '')
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.docs[0].id) {
                        dispatch(
                            clientChatMessageSlice.actions.createClientChatMessage({
                                roomId: querySnapshot.docs[0].id,
                            }),
                        );
                    }
                });
        }
    }, [currentUserChatMessage]);
    useEffect(() => {
        return () => {
            if (currentUserRef.current && currentRoomrRef.current) {
                const roomRef = db.collection('messages');
                roomRef
                    .where('roomId', '==', currentRoomrRef.current || '') // Lọc the documents
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
            }
        };
    }, []);
    const handleLogin = async (provider) => {
        try {
            const { additionalUserInfo, user } = await auth.signInWithPopup(provider);
            if (additionalUserInfo?.isNewUser) {
                await addDocument('users', {
                    fullName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                    keywords: generateKeywords(user.displayName?.toLowerCase()),
                });
                let response = await addDocument('rooms', { members: [user.uid], ownerRoomId: user.uid });
                dispatch(
                    clientChatMessageSlice.actions.createClientChatMessage({
                        roomId: response.id,
                    }),
                );
            }
            console.log('User signed in successfully:', user);
        } catch (error) {
            // Handle any errors that occur during the sign-in process
            console.error('Error signing in:', error);
        }
    };
    const handleSignOut = async (provider) => {
        const roomRef = db.collection('messages');
        setTextMessage('');

        roomRef
            .where('roomId', '==', currentRoomrRef.current || '') // Lọc the documents
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
        dispatch(
            clientChatMessageSlice.actions.createClientChatMessage({
                roomId: null,
            }),
        );
        auth.signOut();
    };
    const onSelectFile = async (event) => {
        const selectedFiles = event.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        for (let i = 0; i < selectedFilesArray.length; i++) {
            uploadFiles(selectedFilesArray[i]);
        }
    };
    const uploadFiles = (file) => {
        //
        const uploadTask = storage.ref(`files/${file.name}`).put(file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                //
                const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                // setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                storage
                    .ref('files')
                    .child(file.name)
                    .getDownloadURL()
                    .then((url) => {
                        addDocument('messages', {
                            text: null,
                            uid: currentUserChatMessage.uid,
                            roomId: infoRoomClientChatMessage,
                            fullName: currentUserChatMessage.fullName,
                            isTyping: false,
                            image: url,
                        });
                    });
            },
        );
    };
    const fileInputRef = useRef(null);

    const handleAttachClick = () => {
        // Trigger a click event on the hidden file input
        fileInputRef.current.click();
    };
    const messageListRef = useRef(null);

    useEffect(() => {
        if (messageListRef?.current) {
            // Ensure messageListRef and its current property exist
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
    }, [allMessages]);
    let lastPrintedDate = null;
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
            <div className={`card message shadow-lg bg-white rounded background-message ${show ? '' : 'hide-card'}`}>
                <div class="card-header background-message">
                    <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                            <h5 className="text-light">Chat với quản trị viên</h5>
                            {currentUserChatMessage && currentUserChatMessage.uid ? (
                                <>
                                    {' '}
                                    <button
                                        className="text-light btn btn-danger"
                                        onClick={() => {
                                            handleSignOut();
                                        }}
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <></>
                            )}

                            <h5
                                className="text-right text-light"
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => handleShowMessage(e)}
                            >
                                X
                            </h5>
                        </div>
                    </div>
                </div>

                {currentUserChatMessage && currentUserChatMessage.uid ? (
                    <>
                        <div class="card-body overflow-auto" ref={messageListRef}>
                            {messagesClient && messagesClient.length > 0 ? (
                                messagesClient.map((item, index) => {
                                    if (
                                        item.createdAt &&
                                        item.createdAt.seconds !== null &&
                                        item.createdAt.nanoseconds !== null
                                    ) {
                                        const currentMessageDate = moment(
                                            new Date(
                                                item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000,
                                            ),
                                        );
                                        const shouldPrintDate =
                                            !lastPrintedDate || !lastPrintedDate.isSame(currentMessageDate, 'day');

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
                                                    capitalizeFirstLetter(currentMessageDate.format('DD/MM/YYYY'));
                                            }
                                            return (
                                                <>
                                                    {' '}
                                                    <div className="row" key={index}>
                                                        <div className="col-12 text-center text-light">{dateText}</div>
                                                    </div>
                                                    <div className="row" key={index}>
                                                        {item.isTyping && item.uid !== currentUserChatMessage.uid && (
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
                                                        {item.uid === currentUserChatMessage.uid &&
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
                                                        {item.uid !== currentUserChatMessage.uid &&
                                                            item.isTyping === false && (
                                                                // Display messages from other users
                                                                <div className="col-8 d-flex">
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
                                                                                    item.createdAt.seconds * 1000 +
                                                                                        item.createdAt.nanoseconds /
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
                                            {item.isTyping && item.uid !== currentUserChatMessage.uid && (
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
                                            {item.uid === currentUserChatMessage.uid && item.isTyping === false && (
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
                                                                                item.createdAt.nanoseconds / 1000000,
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
                                            {item.uid !== currentUserChatMessage.uid && item.isTyping === false && (
                                                // Display messages from other users
                                                <div className="col-8 d-flex">
                                                    <div className="avatar-message mt-2">
                                                        {' '}
                                                        {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                    </div>
                                                    <p className="ml-2 text-dark text-chat-message">{item.text}</p>
                                                    <span className="mt-3 ml-2 text-light" style={{ fontSize: '11px' }}>
                                                        {item.createdAt?.seconds &&
                                                            item.createdAt?.nanoseconds &&
                                                            moment(
                                                                new Date(
                                                                    item.createdAt.seconds * 1000 +
                                                                        item.createdAt.nanoseconds / 1000000,
                                                                ),
                                                            ).format('hh:mm')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <></>
                            )}
                            {/* {messagesClient && messagesClient.length > 0 ? (
                                messagesClient.map((item, index) => (
                                    <div className="row" key={index}>
                                        {item.isTyping && item.uid !== currentUserChatMessage.uid && (
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
                                        {item.uid === currentUserChatMessage.uid && item.isTyping === false && (
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
                                                                            item.createdAt.nanoseconds / 1000000,
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
                                        {item.uid !== currentUserChatMessage.uid && item.isTyping === false && (
                                            // Display messages from other users
                                            <div className="col-8 d-flex">
                                                <div className="avatar-message mt-2">
                                                    {' '}
                                                    {item.fullName.split(' ').slice(-1)[0].charAt(0)}
                                                </div>
                                                <p className="ml-2 text-dark text-chat-message">{item.text}</p>
                                                <span className="mt-3 ml-2 text-light" style={{ fontSize: '11px' }}>
                                                    {moment(
                                                        new Date(
                                                            item.createdAt.seconds * 1000 +
                                                                item.createdAt.nanoseconds / 1000000,
                                                        ),
                                                    ).format('hh:mm')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <></>
                            )} */}
                        </div>
                        <div className="card-footer card-footer-custom-message background-message">
                            <div className="input-group">
                                <div className="input-group-append" onClick={handleAttachClick}>
                                    <span className="input-group-text attach_btn_custom_message">
                                        <i className="fas fa-paperclip" />
                                    </span>
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        id="file"
                                        ref={fileInputRef}
                                        multiple
                                        onChange={(e) => onSelectFile(e)}
                                    />
                                </div>
                                <textarea
                                    name
                                    className="form-control type_msg_custom_message text-light"
                                    placeholder="Nhập tin nhắn..."
                                    defaultValue={''}
                                    value={textMessage}
                                    onChange={(e) => handleChangeTextMessage(e)}
                                />
                                {listening && useMicro ? (
                                    <>
                                        <span className="input-group-text send_btn_custom_message send_btn_micro">
                                            <i class="fas fa-stop-circle" onClick={SpeechRecognition.stopListening}></i>
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
                                        <div className="input-group-append" onClick={() => handleSendTextMessage()}>
                                            <span className="input-group-text send_btn_custom_message">
                                                <i className="fas fa-location-arrow" />
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* {' '}
                                <div className="input-group-append">
                                    <span className="input-group-text send_btn_custom_message">
                                        <i className="fas fa-location-arrow text-dark" />
                                    </span>
                                </div> */}
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div class="card-body overflow-auto">
                            <div className="row d-flex justify-content-center mt-5">
                                <button class="loginBtn loginBtn--google" onClick={() => handleLogin(googleProvider)}>
                                    Đăng nhập với Google
                                </button>
                            </div>
                            <div className="row d-flex justify-content-center mt-3">
                                <button class="loginBtn loginBtn--facebook" onClick={() => handleLogin(fbProvider)}>
                                    Đăng nhập với Facebook
                                </button>
                            </div>

                            {/* <form onSubmit={handleSubmit(onSubmit)}>
                        <div class="form-group">
                            <label className="text-light font-weight-bold" for="inputState">
                                Giới tính:
                            </label>
                            <select className="form-control" name="isMan" {...register('isMan')}>
                                <option value={1} key={1}>
                                    Anh
                                </option>
                                <option value={0} key={0}>
                                    Chị
                                </option>
                            </select>
                            {errors.ward?.message && (
                                <p className="mt-2 text-danger">{errors.ward?.message}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="text-light font-weight-bold">Họ và tên:</label>
                            <input
                                type="text"
                                placeholder="Nhập họ tên"
                                {...register('fullName')}
                                className="form-control"
                            />
                            {errors.fullName?.message && (
                                <p className="mt-2 text-dark">{errors.fullName?.message}</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label className="text-light font-weight-bold">Số điện thoại:</label>
                            <input
                                type="text"
                                placeholder="Nhập số điện thoại"
                                {...register('phoneNumber')}
                                className="form-control"
                            />
                            {errors.phoneNumber?.message && (
                                <p className="mt-2 text-dark">{errors.phoneNumber?.message}</p>
                            )}
                        </div>

                        <div className="row text-center">
                            <div className="col-12 align-self-center">
                                <button className="btn btn-dark">Tạo cuộc chat</button>
                            </div>
                        </div>
                    </form> */}
                        </div>
                    </>
                )}
            </div>

            <i onClick={() => handleShowMessage()} className="fab fa-rocketchat myBtn"></i>
        </>
    );
}

export default React.memo(ChatMessageClient);
