import { combineReducers } from 'redux';

import myUserSlice from './myUserSlice';
import messagesSlice from "./messagesSlice";
import dialogSlice from "./dialogSlice";
import uiSlice from "./uiSlice";
import friendsSlice from "./friendsSlice";
import chatReplySlice from "./chatReplySlice";

const reducers = combineReducers({
    myUser: myUserSlice,
    chatReply: chatReplySlice,
    messages: messagesSlice,
    friends: friendsSlice,
    dialog: dialogSlice,
    ui: uiSlice,
});

export default reducers;