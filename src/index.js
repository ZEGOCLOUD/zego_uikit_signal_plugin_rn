import ZegoPluginInvitationService from './service';
import ZegoUIKitPluginType from './type';

export default class ZegoUIKitSignalingPlugin {
  static shared;
  _signaling = ZegoUIKitPluginType.signaling;
  constructor() {
    if (!ZegoUIKitSignalingPlugin.shared) {
      ZegoUIKitSignalingPlugin.shared = this;
    }
    return ZegoUIKitSignalingPlugin.shared;
  }
  static getInstance() {
    if (!ZegoUIKitSignalingPlugin.shared) {
      ZegoUIKitSignalingPlugin.shared = new ZegoUIKitSignalingPlugin();
    }
    return ZegoUIKitSignalingPlugin.shared;
  }
  getVersion() {
    const zimVersion = ZegoPluginInvitationService.getInstance().getVersion();
    return `signaling_plugin:1.0.0;zim:${zimVersion}`;
  }
  getPluginType() {
    return this._signaling;
  }
  invoke(method, params) {
    switch (method) {
      case 'init':
        return ZegoPluginInvitationService.getInstance().init(
          params.appID,
          params.appSign
        );
      case 'uninit':
        return ZegoPluginInvitationService.getInstance().uninit();
      case 'login':
        return ZegoPluginInvitationService.getInstance().login(
          params.userID,
          params.userName
        );
      case 'logout':
        return ZegoPluginInvitationService.getInstance().logout();
      case 'sendInvitation':
        return ZegoPluginInvitationService.getInstance().sendInvitation(
          params.inviterName,
          params.invitees,
          params.timeout,
          params.type,
          params.data
        );
      case 'cancelInvitation':
        return ZegoPluginInvitationService.getInstance().cancelInvitation(
          params.invitees,
          params.data
        );
      case 'refuseInvitation':
        return ZegoPluginInvitationService.getInstance().refuseInvitation(
          params.inviterID,
          params.data
        );
      case 'acceptInvitation':
        return ZegoPluginInvitationService.getInstance().acceptInvitation(
          params.inviterID,
          params.data
        );
      default:
        break;
    }
  }
  registerPluginEventHandler(event, callbackID, callback) {
    switch (event) {
      case 'callInvitationReceived':
        ZegoPluginInvitationService.getInstance().onCallInvitationReceived(
          callbackID,
          callback
        );
        break;
      case 'callInvitationTimeout':
        ZegoPluginInvitationService.getInstance().onCallInvitationTimeout(
          callbackID,
          callback
        );
        break;
      case 'callInviteesAnsweredTimeout':
        ZegoPluginInvitationService.getInstance().onCallInviteesAnsweredTimeout(
          callbackID,
          callback
        );
        break;
      case 'callInvitationAccepted':
        ZegoPluginInvitationService.getInstance().onCallInvitationAccepted(
          callbackID,
          callback
        );
        break;
      case 'callInvitationRejected':
        ZegoPluginInvitationService.getInstance().onCallInvitationRejected(
          callbackID,
          callback
        );
        break;
      case 'callInvitationCancelled':
        ZegoPluginInvitationService.getInstance().onCallInvitationCancelled(
          callbackID,
          callback
        );
        break;
      default:
        break;
    }
  }
}
