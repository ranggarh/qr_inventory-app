// filepath: c:\Users\ADVAN\Rangga\Project Web Mobile\Inventory-qr\inventory-qr\babel.config.js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // 'react-native-reanimated/plugin',
      'react-native-worklets/plugin', // Tambahkan baris ini jika diperlukan
    ],
  };
};