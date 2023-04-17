export const zloginfo = (...msg: any[]) => {
  console.log('SignalingPlugin[INFO]: ', ...msg);
};
export const zlogwarning = (...msg: any[]) => {
  console.warn('SignalingPlugin[WARNING]: ', ...msg);
};

export const zlogerror = (...msg: any[]) => {
  console.error('SignalingPlugin[ERROR]: ', ...msg);
};
