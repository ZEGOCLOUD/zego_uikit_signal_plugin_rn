export default class ZegoPluginUserInRoomAttributesCore {
  static shared;
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
  joinRoom(roomID) {}
  leaveRoom() {}
  setUsersInRoomAttributes(key, value, userIDs) {}
  queryUsersInRoomAttributes(config) {}
  onUsersInRoomAttributesUpdated(callbackID, callback) {}
}
