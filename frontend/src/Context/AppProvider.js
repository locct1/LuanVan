import React, { useState } from 'react';
import useFirestore from '~/hooks/useFirestore';
import { AuthContext } from './AuthProvider';
import { useSelector } from 'react-redux';
import { infoClientChatMessageSelector } from '~/redux/selectors';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState('');
    const {
        currentUserChatMessage: { uid },
    } = React.useContext(AuthContext);
    const roomsConditionClientMessage = React.useMemo(() => {
        return {
            fieldName: 'ownerRoomId',
            operator: '==',
            compareValue: uid ?? '',
        };
    }, [uid]);
    const rooms = useFirestore('rooms', roomsConditionClientMessage);
    // const selectedRoom = React.useMemo(
    //     () => rooms.find((room) => room.id === selectedRoomId) || {},
    //     [rooms, selectedRoomId],
    // );

    // const usersCondition = React.useMemo(() => {
    //     return {
    //         fieldName: 'uid',
    //         operator: 'in',
    //         compareValue: selectedRoom.members,
    //     };
    // }, [selectedRoom.members]);

    // const members = useFirestore('users', usersCondition);
    // console.log('check', { rooms, selectedRoom, uid });
    const clearState = () => {
        setSelectedRoomId('');
        setIsAddRoomVisible(false);
        setIsInviteMemberVisible(false);
    };

    return (
        <AppContext.Provider
            value={{
                rooms,
                // members,
                // selectedRoom,
                isAddRoomVisible,
                setIsAddRoomVisible,
                selectedRoomId,
                setSelectedRoomId,
                isInviteMemberVisible,
                setIsInviteMemberVisible,
                clearState,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
