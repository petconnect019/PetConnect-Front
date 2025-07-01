// Google Calendar API Integration for Pet Connect
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

class GoogleCalendarService {
  constructor() {
    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
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
      
      await this.gapi.load('client', async () => {
        await this.gapi.client.init({
          apiKey: apiKey,
          discoveryDocs: [DISCOVERY_DOC],
        });
      });

      // Initialize token client
      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: '',
      });

      this.isInitialized = true;
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
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async authenticate() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
        }
        resolve(resp);
      };

      if (this.gapi.client.getToken() === null) {
        this.tokenClient.requestAccessToken({prompt: 'consent'});
      } else {
        this.tokenClient.requestAccessToken({prompt: ''});
      }
    });
  }

  async isConnected() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      return this.gapi?.client?.getToken() !== null;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  }

  async createEvent(eventData) {
    try {
      const request = this.gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': eventData
      });

      const response = await request;
      return response.result;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  async getEvents(timeMin = new Date().toISOString()) {
    try {
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
      throw error;
    }
  }
}

export const GoogleCalendarAPI = new GoogleCalendarService(); 