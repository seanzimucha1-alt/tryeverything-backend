// Quick test script to verify frontend configuration
const config = require('./app.json');

console.log('🔍 Frontend Configuration Test');
console.log('==============================');

// Check API URL
const apiUrl = config.expo.extra?.apiUrl;
console.log(`📡 API URL: ${apiUrl || '❌ NOT SET'}`);
if (apiUrl) {
  console.log('✅ API URL configured');
} else {
  console.log('❌ API URL missing - add to app.json extra.apiUrl');
}

// Check app configuration
console.log(`📱 App Name: ${config.expo.name}`);
console.log(`🏷️  App Slug: ${config.expo.slug}`);
console.log(`📦 Version: ${config.expo.version}`);

// Check permissions
const androidPermissions = config.expo.android?.permissions || [];
console.log(`🔐 Android Permissions: ${androidPermissions.join(', ')}`);

// Check if AsyncStorage plugin is configured
const plugins = config.expo.plugins || [];
const hasAsyncStorage = plugins.some(plugin =>
  Array.isArray(plugin) && plugin[0] === '@react-native-async-storage/async-storage'
);
console.log(`💾 AsyncStorage Plugin: ${hasAsyncStorage ? '✅ Configured' : '❌ Not configured'}`);

console.log('\n🎯 Frontend Status: Ready for testing!');
console.log('📋 Next: Run "npx expo start" and test login functionality');