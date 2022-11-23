export default class ZegoPluginUserInRoomAttributesService {
  static shared;
  constructor() {
    if (!ZegoPluginUserInRoomAttributesService.shared) {
      ZegoPluginUserInRoomAttributesService.shared = this;
    }
    return ZegoPluginUserInRoomAttributesService.shared;
  }
  static getInstance() {
    if (!ZegoPluginUserInRoomAttributesService.shared) {
      ZegoPluginUserInRoomAttributesService.shared =
        new ZegoPluginUserInRoomAttributesService();
    }
    return ZegoPluginUserInRoomAttributesService.shared;
  }
  joinRoom(roomID) {}
  leaveRoom() {}
  setUsersInRoomAttributes(key, value, userIDs) {}
  queryUsersInRoomAttributes(config) {}
  onUsersInRoomAttributesUpdated(callbackID, callback) {}
}
