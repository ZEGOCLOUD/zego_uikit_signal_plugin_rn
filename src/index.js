import ZegoPluginInvitationService from './service';

export default class ZegoUIKitSignalingPlugin {
  static shared;
  constructor() {
    if (!ZegoUIKitSignalingPlugin.shared) {
      ZegoUIKitSignalingPlugin.shared = this;
    }
    return ZegoUIKitSignalingPlugin.shared;
  }
  static getInstance() {
    if (!ZegoUIKitSignalingPlugin.shared) {
      ZegoUIKitSignalingPlugin.shared = new ZegoUIKitSignalingPlugin()();
    }
    return ZegoUIKitSignalingPlugin.shared;
  }
  getVersion() {
    const zimVersion = ZegoPluginInvitationService.getInstance().getVersion();
    return `signaling_plugin:1.0.0;zim:${zimVersion}`;
  }
  invoke(method, params) {
    switch (method) {
      case 'init':
        return ZegoPluginInvitationService.getInstance().init(
          params.appID,
          params.appSign,
        );
      case 'uninit':
        return ZegoPluginInvitationService.getInstance().uninit();
      case 'login':
        return ZegoPluginInvitationService.getInstance().login(
          params.userID,
          params.userName,
        );
      case 'logout':
        return ZegoPluginInvitationService.getInstance().logout();
      case 'sendInvitation':
        return ZegoPluginInvitationService.getInstance().sendInvitation(
          params.inviterName,
          params.invitees,
          params.timeout,
          params.type,
          params.data,
        );
      case 'cancelInvitation':
        return ZegoPluginInvitationService.getInstance().cancelInvitation(
          params.invitees,
          params.data,
        );
      case 'refuseInvitation':
        return ZegoPluginInvitationService.getInstance().refuseInvitation(
          params.inviterID,
          params.data,
        );
      case 'acceptInvitation':
        return ZegoPluginInvitationService.getInstance().acceptInvitation(
          params.inviterID,
          params.data,
        );
      default:
        break;
    }
  }
  onCallInvitationReceived(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInvitationReceived(
      callbackID,
      callback,
    );
  }
  onCallInvitationTimeout(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInvitationTimeout(
      callbackID,
      callback,
    );
  }
  onCallInviteesAnsweredTimeout(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInviteesAnsweredTimeout(
      callbackID,
      callback,
    );
  }
  onCallInvitationAccepted(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInvitationAccepted(
      callbackID,
      callback,
    );
  }
  onCallInvitationRejected(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInvitationRejected(
      callbackID,
      callback,
    );
  }
  onCallInvitationCancelled(callbackID, callback) {
    ZegoPluginInvitationService.getInstance().onCallInvitationCancelled(
      callbackID,
      callback,
    );
  }
}
