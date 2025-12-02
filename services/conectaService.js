import axios from 'axios';
import { URLSearchParams } from 'url';

// A classe ConectaService atua como um Singleton para manter o estado do Token
class ConectaService {
    constructor() {
        // Inicializa o cliente Axios com a URL base da API de Gamificação
        this.client = axios.create({
            baseURL: process.env.CONECTA_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            // Não deve seguir redirecionamentos, embora isso seja mais comum em navegadores
            maxRedirects: 0, 
        });

        this.accessToken = null; // Armazena o token
        this.isRefreshing = false; // Flag para evitar múltiplas chamadas de refresh simultâneas
        this.failedQueue = []; // Fila de requisições que falharam por 401
        
        // Configura o Interceptor do Axios (Mecanismo de renovação automática - Critério 2)
        this.client.interceptors.response.use(
            (response) => response, // Requisição OK
            (error) => this.handleResponseError(error) // Requisição com Erro
        );

        // Configura o Interceptor para anexar o Token Bearer
        this.client.interceptors.request.use(
            (config) => {
                if (this.accessToken) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // Método para processar a fila de requisições falhas
    processQueue(error, token = null) {
        this.failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    // Lógica de tratamento de erro de resposta (Renovação de Token - Critério 2)
    async handleResponseError(error) {
        const originalRequest = error.config;
        
        // Se o erro não for 401 (Unauthorized) ou se já tentamos renovar, rejeita a requisição
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Se o token estiver expirado (401), e ainda não estivermos renovando
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            originalRequest._retry = true; // Marca a requisição original para evitar loop
            
            try {
                await this.getAccessToken(); // Tenta obter um novo token (Critério 1)
                
                // Processa a fila com sucesso e passa o novo token
                this.processQueue(null, this.accessToken); 
                
                // Repete a requisição original
                originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
                return this.client(originalRequest);
                
            } catch (authError) {
                // Se o refresh falhar, rejeita a fila com o erro de autenticação
                this.processQueue(authError, null);
                return Promise.reject(authError);
            } finally {
                this.isRefreshing = false;
            }
        }
        
        // Se já estivermos renovando, coloca a requisição na fila e espera o novo token
        return new Promise(function(resolve, reject) {
            this.failedQueue.push({ resolve, reject });
        }.bind(this))
        .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
        })
        .catch(err => {
            return Promise.reject(err);
        });
    }

    // Função para obter o Access Token (Critério 1)
    async getAccessToken() {
        const { CONECTA_AUTH_URL, CONECTA_CLIENT_ID, CONECTA_SERVICE_USERNAME, CONECTA_SERVICE_PASSWORD } = process.env;
        
        // Constrói o corpo da requisição no formato x-www-form-urlencoded
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', CONECTA_SERVICE_USERNAME);
        data.append('password', CONECTA_SERVICE_PASSWORD);
        data.append('client_id', CONECTA_CLIENT_ID);
        
        try {
            const response = await axios.post(CONECTA_AUTH_URL, data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            this.accessToken = response.data.access_token;
            console.log('Token Conecta Recife obtido com sucesso.');
            return this.accessToken;
            
        } catch (error) {
            console.error('Falha ao obter o Token Conecta Recife:', error.response?.data || error.message);
            throw new Error('Falha na autenticação com o Conecta Recife.');
        }
    }

    // Métodos genéricos para uso nos Controllers/Services
    
    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data = {}, config = {}) {
        return this.client.post(url, data, config);
    }
    
    // Método para ser chamado na inicialização do servidor (opcional)
    async initialize() {
        if (!this.accessToken) {
            await this.getAccessToken();
        }
    }
}

// Cria e exporta uma única instância
const conectaService = new ConectaService();

// Inicializa o serviço no boot da aplicação (sugestão: adicionar ao server.js)
// conectaService.initialize();

export default conectaService;