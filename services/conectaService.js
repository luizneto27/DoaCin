import axios from 'axios';
import { URLSearchParams } from 'url';



// A classe ConectaService atua como um Singleton para manter o estado do Token
class ConectaService {
    constructor() {
        // Inicializa o cliente Axios com a URL base da API 
        this.client = axios.create({
            baseURL: process.env.CONECTA_API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            maxRedirects: 0, 
        });

        this.accessToken = null; // Armazena o token
        this.isRefreshing = false; // Flag para evitar múltiplas chamadas de refresh simultâneas
        this.failedQueue = []; // Fila de requisições que falharam por 401
        
        // Interceptor de Resposta (Tratamento de Erro 401)
        this.client.interceptors.response.use(
            (response) => response, // Requisição OK
            (error) => this.handleResponseError(error) // Requisição com Erro
        );

        // Interceptor de Requisição (Injeção do Token)
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

    // Tratamento de erro de resposta (Renovação de Token)
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
                
                // Processa a fila de requisições pendentes
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
        return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
        })
        .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return this.client(originalRequest);
        })
        .catch(err => {
            return Promise.reject(err);
        });
    }

    // Função para obter o Access Token
    async getAccessToken() {
        const { CONECTA_AUTH_URL, CONECTA_CLIENT_ID, CONECTA_SERVICE_USERNAME, CONECTA_SERVICE_PASSWORD } = process.env;
        
        // Constrói o corpo da requisição no formato x-www-form-urlencoded
        const data = new URLSearchParams();
        data.append('grant_type', 'password');
        data.append('username', CONECTA_SERVICE_USERNAME);
        data.append('password', CONECTA_SERVICE_PASSWORD);
        data.append('client_id', CONECTA_CLIENT_ID);
        
        try {
            console.log(`[ConectaService] Solicitando token em: ${CONECTA_AUTH_URL}`);
            const response = await axios.post(CONECTA_AUTH_URL, data.toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            this.accessToken = response.data.access_token;
            console.log('[ConectaService] Token obtido/renovado com sucesso.');
            return this.accessToken;
            
        } catch (error) {
            console.error('[ConectaService] Erro fatal na autenticação:', error.response?.data || error.message);
            throw error; // Propaga o erro para ser tratado no interceptor
        }
    }
    // Métodos genéricos para uso nos Controllers/Services
    
    async get(url, config = {}) {
        return this.client.get(url, config);
    }

    async post(url, data = {}, config = {}) {
        return this.client.post(url, data, config);
    }
    
    async initialize() {
        if (!this.accessToken) {
            try {
                await this.getAccessToken();
            } catch (e) {
                console.warn("[ConectaService] Inicialização falhou (API offline?), tentará novamente na primeira requisição.");
            }
        }
    }
}

// Cria e exporta uma única instância
const conectaService = new ConectaService();

export default conectaService;