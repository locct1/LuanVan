import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { Spin } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const [currentUserChatMessage, setCurrentUserChatMessage] = useState({});
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        const unsubscibed = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setCurrentUserChatMessage({
                    fullName: displayName,
                    email,
                    uid,
                    photoURL,
                });
                setIsLoading(false);
                //   navigate.push('/');
                return;
            }

            // reset user info
            setCurrentUserChatMessage({});
            setIsLoading(false);
            //     navigate.push('/login');
        });

        // clean function
        return () => {
            unsubscibed();
        };
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ currentUserChatMessage }}>{isLoading ? <></> : children}</AuthContext.Provider>
    );
}
