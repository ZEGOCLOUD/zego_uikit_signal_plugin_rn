import ZIM, { ZIMConnectionState } from 'zego-zim-react-native';
import ZegoPluginResult from "./defines";
import { zlogerror, zloginfo, zlogwarning } from "../utils/logger";

export default class ZegoSignalingPluginCore {
    static shared = null;
    _loginUser = {};
    _userCallIDs = new Map(); // <user id, zim call id>
    _connectionState = ZIMConnectionState.Disconnected;
    _onCallInvitationReceivedCallbackMap = {};
    _onCallInvitationCancelledCallbackMap = {};
    _onCallInvitationAcceptedCallbackMap = {};
    _onCallInvitationRejectedCallbackMap = {};
    _onCallInvitationTimeoutCallbackMap = {};
    _onCallInviteesAnsweredTimeoutCallbackMap = {};
    constructor() {
        if (!ZegoSignalingPluginCore.shared) {
            zloginfo('[Core]ZegoSignalingPluginCore successful instantiation.');
            ZegoSignalingPluginCore.shared = this;
        }
        return ZegoSignalingPluginCore.shared;
    }
    static getInstance() {
        if (!ZegoSignalingPluginCore.shared) {
            ZegoSignalingPluginCore.shared = new ZegoSignalingPluginCore;
        }
        return ZegoSignalingPluginCore.shared;
    }
    // ------- internal events register ------
    _registerEngineCallback() {
        zloginfo('[Core]Register callback for ZIM...');
        ZIM.getInstance().on('error', (zim, errorInfo) => {
            zlogerror(`[Core]Zim error, code:${errorInfo.code}, message:${errorInfo.message}.`);
        });
        ZIM.getInstance().on('connectionStateChanged', (zim, { state, event, extendedData }) => {
            zloginfo(`[Core]Connection state changed, state:${state}, event:${event}, extended data:${extendedData}`);
            this._connectionState = state;
            if (this._connectionState === ZIMConnectionState.Disconnected) {
                zlogwarning("[Core]Disconnected, auto logout.");
                this.logout();
            }
        });
        // Callback of the call invitation received by the invitee.
        ZIM.getInstance().on('callInvitationReceived', (zim, { callID, inviter, timeout, extendedData }) => {
            zloginfo('[Core][callInvitationReceived callback]', callID, inviter, timeout, extendedData);
            this._userCallIDs.set(inviter, callID);
            const notifyData = { inviter: { id: inviter } };
            if (extendedData) {
                const extendedMap = JSON.parse(extendedData);
                notifyData.inviter.name = extendedMap.inviter_name;
                notifyData.type = extendedMap.type;
                notifyData.data = extendedMap.data;
            }
            this._notifyCallInvitationReceived(notifyData);
        });
        // Callback of the disinvitation notification received by the invitee.
        ZIM.getInstance().on('callInvitationCancelled', (zim, { callID, inviter, extendedData }) => {
            zloginfo('[Core][callInvitationCancelled callback]', callID, inviter, extendedData);
            this._userCallIDs.delete(inviter);
            const notifyData = { inviter: { id: inviter, name: '' }, data: extendedData };
            this._notifyCallInvitationCancelled(notifyData);
        });
        // Callback of the invitation acceptance notification received by the inviter.
        ZIM.getInstance().on('callInvitationAccepted', (zim, { callID, invitee, extendedData }) => {
            zloginfo('[Core][callInvitationAccepted callback]', callID, invitee, extendedData);
            const notifyData = { invitee: { id: invitee, name: '' }, data: extendedData };
            this._notifyCallInvitationAccepted(notifyData);
        });
        // Callback of notification received by the inviter that the inviter has declined the invitation.
        ZIM.getInstance().on('callInvitationRejected', (zim, { callID, invitee, extendedData }) => {
            zloginfo('[Core][callInvitationRejected callback]', callID, invitee, extendedData);
            const notifyData = { invitee: { id: invitee, name: '' }, data: extendedData };
            this._notifyCallInvitationRejected(notifyData);
        });
        // Call invitation timeout notification callback for the invitee.
        ZIM.getInstance().on('callInvitationTimeout', (zim, { callID }) => {
            zloginfo('[Core][callInvitationTimeout callback]', callID);
            const notifyData = { inviter: { id: this._getInviterIDByCallID(callID), name: '' }, data: '' };
            this._notifyCallInvitationTimeout(notifyData);
        });
        // Call invitation timeout notification callback by the inviter.
        ZIM.getInstance().on('callInviteesAnsweredTimeout', (zim, { callID, invitees }) => {
            zloginfo('[Core][callInviteesAnsweredTimeout callback]', callID, invitees);
            const notifyData = { invitees: invitees.map(invitee => {
                return { id: invitee, name: '' };
            }), data: '' };
            this._notifyCallInviteesAnsweredTimeout(notifyData);
        });
    }
    _unregisterEngineCallback() {
        zloginfo('[Core]Unregister callback from ZIM...');
        ZIM.getInstance().off('error');
        ZIM.getInstance().off('connectionStateChanged');
        ZIM.getInstance().off('callInvitationReceived');
        ZIM.getInstance().off('callInvitationCancelled');
        ZIM.getInstance().off('callInvitationAccepted');
        ZIM.getInstance().off('callInvitationRejected');
        ZIM.getInstance().off('callInvitationTimeout');
        ZIM.getInstance().off('callInviteesAnsweredTimeout');
    }
    // ------- internal events exec ------
    _notifyCallInvitationReceived(notifyData) {
        Object.keys(_onCallInvitationReceivedCallbackMap).forEach(callbackID => {
            if (_onCallInvitationReceivedCallbackMap[callbackID]) {
                _onCallInvitationReceivedCallbackMap[callbackID](notifyData);
            }
        })
    }
    _notifyCallInvitationCancelled(notifyData) {
        Object.keys(_onCallInvitationCancelledCallbackMap).forEach(callbackID => {
            if (_onCallInvitationCancelledCallbackMap[callbackID]) {
                _onCallInvitationCancelledCallbackMap[callbackID](notifyData);
            }
        })
    }
    _notifyCallInvitationAccepted(notifyData) {
        Object.keys(_onCallInvitationAcceptedCallbackMap).forEach(callbackID => {
            if (_onCallInvitationAcceptedCallbackMap[callbackID]) {
                _onCallInvitationAcceptedCallbackMap[callbackID](notifyData);
            }
        })
    }
    _notifyCallInvitationRejected(notifyData) {
        Object.keys(_onCallInvitationRejectedCallbackMap).forEach(callbackID => {
            if (_onCallInvitationRejectedCallbackMap[callbackID]) {
                _onCallInvitationRejectedCallbackMap[callbackID](notifyData);
            }
        })
    }
    _notifyCallInvitationTimeout(notifyData) {
        Object.keys(_onCallInvitationTimeoutCallbackMap).forEach(callbackID => {
            if (_onCallInvitationTimeoutCallbackMap[callbackID]) {
                _onCallInvitationTimeoutCallbackMap[callbackID](notifyData);
            }
        })
    }
    _notifyCallInviteesAnsweredTimeout(notifyData) {
        Object.keys(_onCallInviteesAnsweredTimeoutCallbackMap).forEach(callbackID => {
            if (_onCallInviteesAnsweredTimeoutCallbackMap[callbackID]) {
                _onCallInviteesAnsweredTimeoutCallbackMap[callbackID](notifyData);
            }
        })
    }
    // ------- internal utils ------
    _resetData() {
        this._resetDataForLogout();
    }
    _resetDataForLogout() {
        this._loginUser = {};
        this._userCallIDs.clear();
        this._connectionState = ZIMConnectionState.Disconnected;
    }
    _getInviterIDByCallID(callID) {
        let inviteUserID = "";
        this._userCallIDs.keys().forEach(key => {
            const value = this._userCallIDs.get(key);
            if (callID == value) {
                inviteUserID = key;
            }
        })
        return inviteUserID;
    }
    // ------- external utils ------
    getLocalUser() {
        return this._loginUser;
    }
    getCallIDByUserID(userID) {
        return this._userCallIDs.get(userID) || "";
    }
    // ------- external method ------
    getVersion() {
        return ZIM.getVersion();
    }
    create(appConfig) {
        if (!ZIM.getInstance()) {
            const zim = ZIM.create(appConfig);
            if (!zim) {
                zlogerror('[Core]Create zim error.');
            } else {
                zlogerror('[Core]Create zim success.');
                this._unregisterEngineCallback();
                this._registerEngineCallback();
            }
        } else {
            zlogwarning('[Core]Zim has created.');
        }
    }
    login(userInfo, token) {
        return ZIM.getInstance().login(userInfo, token).then(() => {
            zloginfo('[Core]Login success.');
            this._loginUser = userInfo;
        });
    }
    logout() {
        return ZIM.getInstance().logout().then(() => {
            zloginfo('[Core]Logout success.');
            this._resetDataForLogout();
        });
    }
    destroy() {
        ZIM.getInstance().destroy();
        zloginfo('[Core]Destroy success.');
        this._resetData();
    }
    invite(invitees, config) {
        return new Promise((resolve, reject) => {
            ZIM.getInstance().callInvite(invitees, config).then(({ callID, timeout, errorInvitees }) => {
                this._userCallIDs.set(this._loginUser.userID, callID);
                if (!errorInvitees || !errorInvitees.length) {
                    zloginfo(`[Core]Invite done, call id: ${callID}`);
                    resolve({ ...new ZegoPluginResult("", ""), errorInvitees: [] });
                } else {
                    const errorInviteeIDs = [];
                    errorInvitees.forEach(errorInvitee => {
                        zlogwarning(`[Core]Invite error, invitee id: ${errorInvitee.userID}, invitee state: ${errorInvitee.state}`);
                        errorInviteeIDs.push(errorInvitee.userID);
                    });
                    resolve({ ...new ZegoPluginResult("", ""), errorInvitees: errorInviteeIDs });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    cancel(invitees, callID, config) {
        return new Promise((resolve, reject) => {
            ZIM.getInstance().callCancel(invitees, callID, config).then((callID, errorInvitees) => {
                this._userCallIDs.delete(this._loginUser.userID);
                if (!errorInvitees || !errorInvitees.length) {
                    zloginfo(`[Core]Cancel invitation done, call id: ${callID}`);
                    resolve({ ...new ZegoPluginResult("", ""), errorInvitees: [] });
                } else {
                    errorInvitees.forEach(inviteeID => {
                        zlogwarning(`[Core]Cancel invitation error, invitee id: ${inviteeID}`);
                    });
                    resolve({...new ZegoPluginResult("", ""), errorInvitees });
                }
            }).catch(error => {
                reject(error);
            });
        });
    }
    accept(callID, config) {
        return new Promise((resolve, reject) => {
            ZIM.getInstance().callAccept(callID, config).then(({ callID }) => {
                zloginfo(`[Core]Accept invitation done, call id: ${callID}`);
                resolve(new ZegoPluginResult());
            }).catch(error => {
                reject(error);
            });
        });

    }
    reject(callID, config) {
        return new Promise((resolve, reject) => {
            ZIM.getInstance().callReject(callID, config).then(({ callID }) => {
                zloginfo(`[Core]Reject invitation done, call id: ${callID}`);
                this._userCallIDs.delete(this._getInviterIDByCallID(callID));
                resolve(new ZegoPluginResult());
            }).catch(error => {
                reject(error);
            });
        });
    }
    // ------- external events register ------
    onCallInvitationReceived(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInvitationReceivedCallbackMap) {
                zloginfo('[Core][onCallInvitationReceived] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInvitationReceivedCallbackMap[callbackID];
            }
        } else {
            _onCallInvitationReceivedCallbackMap[callbackID] = callback;
        }
    }
    onCallInvitationCancelled(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInvitationCancelledCallbackMap) {
                zloginfo('[Core][onCallInvitationCancelled] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInvitationCancelledCallbackMap[callbackID];
            }
        } else {
            _onCallInvitationCancelledCallbackMap[callbackID] = callback;
        }
    }
    onCallInvitationAccepted(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInvitationAcceptedCallbackMap) {
                zloginfo('[Core][onCallInvitationAccepted] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInvitationAcceptedCallbackMap[callbackID];
            }
        } else {
            _onCallInvitationAcceptedCallbackMap[callbackID] = callback;
        }
    }
    onCallInvitationRejected(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInvitationRejectedCallbackMap) {
                zloginfo('[Core][onCallInvitationRejected] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInvitationRejectedCallbackMap[callbackID];
            }
        } else {
            _onCallInvitationRejectedCallbackMap[callbackID] = callback;
        }
    }
    onCallInvitationTimeout(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInvitationTimeoutCallbackMap) {
                zloginfo('[Core][onCallInvitationTimeout] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInvitationTimeoutCallbackMap[callbackID];
            }
        } else {
            _onCallInvitationTimeoutCallbackMap[callbackID] = callback;
        }
    }
    onCallInviteesAnsweredTimeout(callbackID, callback) {
        if (typeof callback !== 'function') {
            if (callbackID in _onCallInviteesAnsweredTimeoutCallbackMap) {
                zloginfo('[Core][onCallInviteesAnsweredTimeout] Remove callback for: [', callbackID, '] because callback is not a valid function!');
                delete _onCallInviteesAnsweredTimeoutCallbackMap[callbackID];
            }
        } else {
            _onCallInviteesAnsweredTimeoutCallbackMap[callbackID] = callback;
        }
    }
}