import { ZIMMessage, ZIMRoomAttributesUpdateInfo } from 'zego-zim-react-native';
import ZegoPluginRoomPropertiesCore from '../core/room_properties_core';

export default class ZegoPluginRoomPropertiesService {
  static shared: ZegoPluginRoomPropertiesService;
  constructor() {
    if (!ZegoPluginRoomPropertiesService.shared) {
      ZegoPluginRoomPropertiesService.shared = this;
    }
    return ZegoPluginRoomPropertiesService.shared;
  }
  static getInstance() {
    if (!ZegoPluginRoomPropertiesService.shared) {
      ZegoPluginRoomPropertiesService.shared =
        new ZegoPluginRoomPropertiesService();
    }
    return ZegoPluginRoomPropertiesService.shared;
  }
  updateRoomProperty(
    key: string,
    value: string,
    isDeleteAfterOwnerLeft: boolean,
    isForce = false,
    isUpdateOwner = false
  ) {
    const attributes = { [key]: value };
    const config = {
      isForce,
      isDeleteAfterOwnerLeft,
      isUpdateOwner,
    };
    return ZegoPluginRoomPropertiesCore.getInstance().updateRoomProperty(
      attributes,
      config
    );
  }
  deleteRoomProperties(keys: string[] = [], isForce: boolean) {
    const config = {
      isForce,
    };
    return ZegoPluginRoomPropertiesCore.getInstance().deleteRoomProperties(
      keys,
      config
    );
  }
  beginRoomPropertiesBatchOperation(
    isDeleteAfterOwnerLeft = false,
    isForce = false,
    isUpdateOwner = false
  ) {
    const config = {
      isDeleteAfterOwnerLeft,
      isForce,
      isUpdateOwner,
    };
    return ZegoPluginRoomPropertiesCore.getInstance().beginRoomPropertiesBatchOperation(
      config
    );
  }
  endRoomPropertiesBatchOperation() {
    return ZegoPluginRoomPropertiesCore.getInstance().endRoomPropertiesBatchOperation();
  }
  queryRoomProperties() {
    return ZegoPluginRoomPropertiesCore.getInstance().queryRoomProperties();
  }
  onRoomPropertyUpdated(callbackID: string, callback: (notifyData: ZIMRoomAttributesUpdateInfo) => void) {
    ZegoPluginRoomPropertiesCore.getInstance().onRoomPropertyUpdated(
      callbackID,
      callback
    );
  }
  onInRoomTextMessageReceived(callbackID: string, callback: (notifyData: { messageList: ZIMMessage[]; fromConversationID: string }) => void) {
    ZegoPluginRoomPropertiesCore.getInstance().onInRoomTextMessageReceived(
      callbackID,
      callback
    );
  }
}
