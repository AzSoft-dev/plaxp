import { contextBridge, ipcRenderer } from 'electron';

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  versions: process.versions,
  // Aquí puedes agregar más APIs según necesites
  // Por ejemplo:
  // send: (channel: string, data: any) => {
  //   ipcRenderer.send(channel, data);
  // },
  // on: (channel: string, func: Function) => {
  //   ipcRenderer.on(channel, (event, ...args) => func(...args));
  // }
});

// Notificar que el preload script está listo
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded successfully');
});
