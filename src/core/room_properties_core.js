export default class ZegoPluginRoomPropertiesCore {
  static shared;
  constructor() {
    if (!ZegoPluginRoomPropertiesCore.shared) {
      ZegoPluginRoomPropertiesCore.shared = this;
    }
    return ZegoPluginRoomPropertiesCore.shared;
  }
  static getInstance() {
    if (!ZegoPluginRoomPropertiesCore.shared) {
      ZegoPluginRoomPropertiesCore.shared = new ZegoPluginRoomPropertiesCore();
    }
    return ZegoPluginRoomPropertiesCore.shared;
  }
  updateRoomProperty(
    key,
    value,
    isDeleteAfterOwnerLeft,
    isForce,
    isUpdateOwner
  ) {}
  deleteRoomProperties(keys, isForce) {}
  beginRoomPropertiesBatchOperation(
    isDeleteAfterOwnerLeft,
    isForce,
    isUpdateOwner
  ) {}
  endRoomPropertiesBatchOperation() {}
  queryRoomProperties() {}
  onRoomPropertiesUpdated(callbackID, callback) {}
}
