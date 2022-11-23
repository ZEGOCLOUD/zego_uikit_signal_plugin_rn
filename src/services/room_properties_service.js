import ZegoPluginRoomPropertiesCore from '../core/room_properties_core';

export default class ZegoPluginRoomPropertiesService {
  static shared;
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
    key,
    value,
    isDeleteAfterOwnerLeft,
    isForce = false,
    isUpdateOwner = false
  ) {
    return ZegoPluginRoomPropertiesCore.getInstance().updateRoomProperty(
      key,
      value,
      isDeleteAfterOwnerLeft,
      isForce,
      isUpdateOwner
    );
  }
  deleteRoomProperties(keys = [], isForce) {
    return ZegoPluginRoomPropertiesCore.getInstance().deleteRoomProperties(
      keys,
      isForce
    );
  }
  beginRoomPropertiesBatchOperation(
    isDeleteAfterOwnerLeft = false,
    isForce = false,
    isUpdateOwner = false
  ) {
    return ZegoPluginRoomPropertiesCore.getInstance().beginRoomPropertiesBatchOperation(
      isDeleteAfterOwnerLeft,
      isForce,
      isUpdateOwner
    );
  }
  endRoomPropertiesBatchOperation() {
    return ZegoPluginRoomPropertiesCore.getInstance().endRoomPropertiesBatchOperation();
  }
  queryRoomProperties() {
    return ZegoPluginRoomPropertiesCore.getInstance().queryRoomProperties();
  }
  onRoomPropertiesUpdated(callbackID, callback) {
    ZegoPluginRoomPropertiesCore.getInstance().onRoomPropertiesUpdated(
      callbackID,
      callback
    );
  }
}
