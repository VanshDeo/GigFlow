
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthState {
    userInfo: User | null;
}

const initialState: AuthState = {
    userInfo: typeof window !== 'undefined' && localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<User>) => {
            state.userInfo = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('userInfo', JSON.stringify(action.payload));
            }
        },
        logout: (state) => {
            state.userInfo = null;
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userInfo');
            }
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
