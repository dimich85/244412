// This file exports a collection of browser fingerprint profiles.
// These profiles are expanded to include more data for spoofing.

module.exports = {
  'macos-safari-16': {
    name: 'macOS 13 (Safari 16)',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15',
    platform: 'MacIntel',
    vendor: 'Apple Computer, Inc.',
    screen: { width: 1728, height: 1117 }
  },
  'win-chrome-108': {
    name: 'Windows 10 (Chrome 108)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    platform: 'Win32',
    vendor: 'Google Inc.',
    screen: { width: 1920, height: 1080 }
  },
  'iphone-safari-16': {
    name: 'iPhone 14 Pro (Safari 16)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    platform: 'iPhone',
    vendor: 'Apple Computer, Inc.',
    screen: { width: 393, height: 852 }
  },
   'android-chrome-108': {
    name: 'Android 13 (Chrome 108)',
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36',
    platform: 'Linux armv8l',
    vendor: 'Google Inc.',
    screen: { width: 412, height: 915 }
  }
};