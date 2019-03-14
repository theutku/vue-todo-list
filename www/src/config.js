class Config {
    apiHost = 'http://localhost';
    apiPort = '8000';
    apiUrl = `${this.apiHost}:${this.apiPort}/api/v1`;
    loginUrl = `${this.apiUrl}/account/login`;
}

const config = new Config();
export default config;