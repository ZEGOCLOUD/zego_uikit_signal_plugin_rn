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
  ) {}
  deleteRoomProperties(keys = [], isForce) {}
  beginRoomPropertiesBatchOperation(
    isDeleteAfterOwnerLeft = false,
    isForce = false,
    isUpdateOwner = false
  ) {}
  endRoomPropertiesBatchOperation() {}
  queryRoomProperties() {}
  onRoomPropertiesUpdated(callbackID, callback) {}
}
