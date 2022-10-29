export const zloginfo = (...msg) => {
  console.log('ZIM[INFO]: ', ...msg);
};
export const zlogwarning = msg => {
  console.warn('ZIM[WARNING]: ', ...msg);
};

export const zlogerror = msg => {
  console.error('ZIM[ERROR]: ', ...msg);
};
