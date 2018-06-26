import os from 'os';

export default function getIpAddress() {
  // get all public IPv4 address
  // see http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let alias of iface) {
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address;
      }
    }
  }

  return '0.0.0.0';
}
