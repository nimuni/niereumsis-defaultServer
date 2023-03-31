export const isEmpty = (value) => {
  if (value === '' || value === null || value === undefined) {
    return true;
  } else {
    return false;
  }
};
// Speed up calls to hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;
export const isEmptyObj = (obj) => {
  // null and undefined
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
};
export const generateRandomString = (num) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

///////////////////////////
// file util
///////////////////////////
export const fileNameFilter = (fileName) => {
  console.log('call fileNameFilter');
  console.log(typeof fileName);
  console.log(fileName);
  console.log(fileName.test);
  const ILLEGAL_EXP = /[\{\}\/?,;:|*~`!^\+<>@\#$%&\\\=\'\"]/gi;
  if (ILLEGAL_EXP.test(fileName)) {
    return fileName.replace(ILLEGAL_EXP, '');
  } else {
    return fileName;
  }
};
