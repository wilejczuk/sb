export default class InternalService {

  _apiBase = 'http://localhost:3001';

  token = localStorage.getItem("token");
  defaultHeaders = { headers: 
      {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${this.token}`
      }
    }

  async getAuthentication(username, password) {
    const response = await fetch(`${this._apiBase}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    return await response.json();
  }

  async getServers(userId) {
    const response = await fetch(`${this._apiBase}/servers/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  async getUpdates() {
    const response = await fetch(`${this._apiBase}/updates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  async getInstallations(serverGUID) {
    const response = await fetch(`${this._apiBase}/installations/${serverGUID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return await response.json();
  }

  async addInstallation(serverGUID, updateId, time) {
    const response = await fetch(`${this._apiBase}/installation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ serverGUID, updateId, time })
    });
    return await response.json();
  }

  async cancelInstallation(installationId) {
    const response = await fetch(`${this._apiBase}/installationCancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ installationId })
    });
    return await response.json();
  }
  
}