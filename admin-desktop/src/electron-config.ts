// Configuración específica para Electron
export const isElectron = () => {
  return window && window.process && window.process.type;
};

export const electronAPI = {
  // Verificar si estamos en Electron
  isElectron: isElectron(),
  
  // Obtener información del sistema
  getSystemInfo: () => {
    if (isElectron()) {
      return {
        platform: window.process.platform,
        version: window.process.versions.electron,
        node: window.process.versions.node,
        chrome: window.process.versions.chrome
      };
    }
    return null;
  },

  // Configuración de la ventana
  windowConfig: {
    title: 'Panel de Administración - Crepes & Coffee',
    minWidth: 1200,
    minHeight: 700,
    defaultWidth: 1400,
    defaultHeight: 900
  },

  // Configuración de la aplicación
  appConfig: {
    name: 'Crepes & Coffee Admin',
    version: '1.0.0',
    description: 'Panel de administración de escritorio para gestionar productos, pedidos y usuarios'
  },

  // Funciones de utilidad para Electron
  utils: {
    // Maximizar ventana
    maximizeWindow: () => {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.maximizeWindow();
      }
    },

    // Minimizar ventana
    minimizeWindow: () => {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.minimizeWindow();
      }
    },

    // Cerrar aplicación
    closeApp: () => {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.closeApp();
      }
    },

    // Abrir DevTools
    openDevTools: () => {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.openDevTools();
      }
    },

    // Recargar aplicación
    reloadApp: () => {
      if (isElectron() && window.electronAPI) {
        window.electronAPI.reloadApp();
      } else {
        window.location.reload();
      }
    }
  }
};

// Declaraciones de tipos para TypeScript
declare global {
  interface Window {
    process: any;
    electronAPI: any;
  }
}

export default electronAPI; 