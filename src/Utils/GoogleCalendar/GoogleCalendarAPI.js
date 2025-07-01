// Google Calendar API Integration for Pet Connect
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

class GoogleCalendarService {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
    this.isAuthenticated = false;
  }

  // Verificar que las credenciales estén configuradas
  validateCredentials() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!clientId) {
      throw new Error('VITE_GOOGLE_CLIENT_ID no está configurado en las variables de entorno');
    }

    if (!apiKey) {
      throw new Error('VITE_GOOGLE_API_KEY no está configurado en las variables de entorno');
    }

    return { clientId, apiKey };
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Validar credenciales antes de inicializar
      const { clientId, apiKey } = this.validateCredentials();

      // Load Google APIs
      await this.loadGoogleAPI();
      
      // Initialize gapi client
      await new Promise((resolve, reject) => {
        this.gapi.load('client', async () => {
          try {
            await this.gapi.client.init({
              apiKey: apiKey,
              discoveryDocs: [DISCOVERY_DOC],
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });

      // Load Google Identity Services
      await this.loadGoogleIdentityServices();

      // Initialize token client
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: '', // Se definirá en authenticate()
      });

      this.isInitialized = true;
      console.log('Google Calendar API initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Calendar API:', error);
      throw error;
    }
  }

  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        this.gapi = window.gapi;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google API script'));
      document.head.appendChild(script);
    });
  }

  loadGoogleIdentityServices() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        // Wait a bit for the script to fully initialize
        setTimeout(resolve, 100);
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      document.head.appendChild(script);
    });
  }

  async authenticate() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      try {
        this.tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            console.error('OAuth error:', resp);
            reject(resp);
            return;
          }
          
          console.log('OAuth success:', resp);
          this.isAuthenticated = true;
          resolve(resp);
        };

        // Check if already has valid token
        const currentToken = this.gapi.client.getToken();
        if (currentToken === null) {
          // Request new token
          this.tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
          // Already authenticated
          this.isAuthenticated = true;
          resolve(currentToken);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        reject(error);
      }
    });
  }

  async isConnected() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      const token = this.gapi?.client?.getToken();
      const connected = token !== null && this.isAuthenticated;
      console.log('Connection status:', { token: !!token, isAuthenticated: this.isAuthenticated, connected });
      return connected;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  async createEvent(eventData) {
    try {
      // Ensure we're authenticated
      if (!this.isAuthenticated) {
        throw new Error('Not authenticated. Please connect to Google Calendar first.');
      }

      // Verify we have access to calendar API
      if (!this.gapi?.client?.calendar) {
        throw new Error('Calendar API not available. Please try reconnecting.');
      }

      console.log('Creating event:', eventData);
      
      const request = this.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventData
      });

      const response = await request;
      console.log('Event created successfully:', response.result);
      return response.result;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async getEvents(timeMin = new Date().toISOString()) {
    try {
      // Ensure we're authenticated
      if (!this.isAuthenticated) {
        console.log('Not authenticated for getting events');
        return [];
      }

      // Verify we have access to calendar API
      if (!this.gapi?.client?.calendar) {
        console.log('Calendar API not available');
        return [];
      }

      const request = this.gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': timeMin,
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
      });

      const response = await request;
      return response.result.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
  }

  // Método para desconectar
  disconnect() {
    if (this.gapi?.client) {
      this.gapi.client.setToken(null);
    }
    this.isAuthenticated = false;
    console.log('Disconnected from Google Calendar');
  }
}

export const GoogleCalendarAPI = new GoogleCalendarService(); 