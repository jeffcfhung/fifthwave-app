// TODO: Move to observor patteren. This is a quick hack.
const MOCK = false;
let BASE_URL;
let VIDEO_URL;

if (MOCK) {
  BASE_URL = 'http://localhost';
  VIDEO_URL = `${BASE_URL}:8000/static/img.jpg`;
} else {
  BASE_URL = 'http://10.42.0.1';
  VIDEO_URL = `${BASE_URL}:8000/static/img.jpg`;
}
module.exports = {
  BASE_URL,
  VIDEO_URL,
  // ML_URL: 'http://192.168.56.101',
  ML_URL: 'http://10.42.0.220',
  CUSTOM_EVENT: {},
};
