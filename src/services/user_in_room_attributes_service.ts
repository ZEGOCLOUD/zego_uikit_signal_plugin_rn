import { ZIMRoomMemberAttributesInfo } from 'zego-zim-react-native';
import ZegoPluginUserInRoomAttributesCore from '../core/user_in_room_attributes_core';
export default class ZegoPluginUserInRoomAttributesService {
  static shared: ZegoPluginUserInRoomAttributesService;
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
  joinRoom(roomID: string) {
    return ZegoPluginUserInRoomAttributesCore.getInstance().joinRoom(roomID);
  }
  leaveRoom() {
    return ZegoPluginUserInRoomAttributesCore.getInstance().leaveRoom();
  }
  setUsersInRoomAttributes(key: string, value: string, userIDs: string[]) {
    const attributes = { [key]: value };
    return ZegoPluginUserInRoomAttributesCore.getInstance().setUsersInRoomAttributes(
      attributes,
      userIDs
    );
  }
  queryUsersInRoomAttributes(nextFlag: string, count: number) {
    const config = { nextFlag, count };
    return ZegoPluginUserInRoomAttributesCore.getInstance().queryUsersInRoomAttributes(
      config
    );
  }
  onUsersInRoomAttributesUpdated(callbackID: string, callback: (notifyData: {
    infos: ZIMRoomMemberAttributesInfo[];
    editor: string;
  }) => void) {
    ZegoPluginUserInRoomAttributesCore.getInstance().onUsersInRoomAttributesUpdated(
      callbackID,
      callback
    );
  }
}
