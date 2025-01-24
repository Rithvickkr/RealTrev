import { atom } from 'recoil';

export const changeRoleState = atom<string>({
    key: 'changeRoleState',
    default: 'TRAVELLER', // default role
});