import React, { useContext } from 'react';
import TabBar from './TabBar';
import { Authcontext } from '../context/AuthProvider';
import StackNav from './StackNav';

export default function AppNav() {
    const { userToken } = useContext<any>(Authcontext);

    return userToken !== null ? (
        <TabBar />
    ) : (
        <StackNav />
    );
}