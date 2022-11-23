import ZIM from 'zego-zim-react-native';
import ZegoSignalingPluginCore from './index';
import { zlogerror, zloginfo, zlogwarning } from '../utils/logger';
import ZegoPluginResult from './defines';
export default class ZegoPluginUserInRoomAttributesCore {
  static shared;
  _roomBaseInfo = {}; // { roomID: '', roomName: '' }
  _onUsersInRoomAttributesUpdatedCallbackMap = {};
  constructor() {
    if (!ZegoPluginUserInRoomAttributesCore.shared) {
      ZegoPluginUserInRoomAttributesCore.shared = this;
    }
    return ZegoPluginUserInRoomAttributesCore.shared;
  }
  static getInstance() {
    if (!ZegoPluginUserInRoomAttributesCore.shared) {
      ZegoPluginUserInRoomAttributesCore.shared =
        new ZegoPluginUserInRoomAttributesCore();
    }
    return ZegoPluginUserInRoomAttributesCore.shared;
  }
  // ------- internal events register ------
  _registerEngineCallback() {
    ZIM.getInstance().on(
      'roomMemberAttributesUpdated',
      (zim, { roomID, infos, operatedInfo }) => {
        this._notifyUsersInRoomAttributesUpdated({
          infos: infos.map((info) => info.attributesInfo),
          editor: operatedInfo.userID,
        });
      }
    );
    zloginfo(
      '[ZegoPluginUserInRoomAttributesCore]Register callback for ZIM...'
    );
  }
  _unregisterEngineCallback() {
    zloginfo(
      '[ZegoPluginUserInRoomAttributesCore]Unregister callback from ZIM...'
    );
    ZIM.getInstance().off('roomMemberAttributesUpdated');
  }
  // ------- internal utils ------
  _resetData() {
    this._resetDataForLeaveRoom();
  }
  _resetDataForLeaveRoom() {
    this._roomBaseInfo = {};
  }
  // ------- internal events exec ------
  _notifyUsersInRoomAttributesUpdated(notifyData) {
    Object.keys(this._onUsersInRoomAttributesUpdatedCallbackMap).forEach(
      (callbackID) => {
        if (this._onUsersInRoomAttributesUpdatedCallbackMap[callbackID]) {
          this._onUsersInRoomAttributesUpdatedCallbackMap[callbackID](
            notifyData
          );
        }
      }
    );
  }
  // ------- external method ------
  joinRoom(roomID) {
    if (!ZIM.getInstance()) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please initialize it first.'
      );
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      ZIM.getInstance()
        .enterRoom({ roomID, roomName: roomID })
        .then(({ roomInfo }) => {
          zloginfo(
            `[ZegoPluginUserInRoomAttributesCore]Join the room successfully.`
          );
          this._roomBaseInfo = roomInfo.baseInfo;
          resolve(new ZegoPluginResult('', ''));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  leaveRoom() {
    if (!ZIM.getInstance()) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please initialize it first.'
      );
      return Promise.reject();
    }
    if (!this._roomBaseInfo.roomID) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please join the room first.'
      );
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      ZIM.getInstance()
        .leaveRoom(this._roomBaseInfo.roomID)
        .then(() => {
          zloginfo(
            `[ZegoPluginUserInRoomAttributesCore]Leave the room successfully.`
          );
          this._resetDataForLeaveRoom();
          resolve(new ZegoPluginResult('', ''));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  setUsersInRoomAttributes(key, value, userIDs) {
    if (!ZIM.getInstance()) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please initialize it first.'
      );
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      ZIM.getInstance()
        .setRoomMembersAttributes(
          { [key]: value },
          userIDs,
          this._roomBaseInfo.roomID,
          { isDeleteAfterOwnerLeft: true }
        )
        .then(({ roomID, infos, errorUserList }) => {
          zloginfo(
            `[ZegoPluginUserInRoomAttributesCore]Set attributes of users in room successfully.`
          );
          resolve({
            ...new ZegoPluginResult('', ''),
            errorUserList,
            infos,
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  queryUsersInRoomAttributes(nextFlag, count) {
    if (!ZIM.getInstance()) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please initialize it first.'
      );
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      ZIM.getInstance()
        .queryRoomMemberAttributesList(this._roomBaseInfo.roomID, {
          nextFlag,
          count,
        })
        .then(({ roomID, infos, nextFlag: resNextFlag }) => {
          zloginfo(
            `[ZegoPluginUserInRoomAttributesCore]Query attributes of users in room successfully.`
          );
          const params = {
            ...new ZegoPluginResult('', ''),
            nextFlag: resNextFlag,
            infos,
          };
          resolve(params);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  // ------- external events register ------
  onUsersInRoomAttributesUpdated(callbackID, callback) {
    if (!ZIM.getInstance()) {
      zlogerror(
        '[ZegoPluginUserInRoomAttributesCore]Please initialize it first.'
      );
    }
    if (typeof callback !== 'function') {
      if (callbackID in this._onUsersInRoomAttributesUpdatedCallbackMap) {
        zloginfo(
          '[Core][onUsersInRoomAttributesUpdated] Remove callback for: [',
          callbackID,
          '] because callback is not a valid function!'
        );
        delete this._onUsersInRoomAttributesUpdatedCallbackMap[callbackID];
      }
    } else {
      this._onUsersInRoomAttributesUpdatedCallbackMap[callbackID] = callback;
    }
  }
}
