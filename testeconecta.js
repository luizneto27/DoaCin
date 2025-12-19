import axios from 'axios';
import { URLSearchParams } from 'url';

// Configurações de autenticação e API
const AUTH_URL = 'https://loginteste.recife.pe.gov.br/auth/realms/recife/protocol/openid-connect/token';
const API_CHALLENGES_URL = 'https://gamificacao.homolog.app.emprel.gov.br/api/self/challenges';

const CREDENTIALS = {
    grant_type: 'password',
    client_id: 'app-recife',
    username: '88232462027', 
    password: 'desenv@12345' 
};

async function getChallengeIds() {
    console.log('1. Autenticando...');
    
    try {
        // Passo 1: Autenticação
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(CREDENTIALS)) {
            params.append(key, value);
        }

        const authResponse = await axios.post(AUTH_URL, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const token = authResponse.data.access_token;
        console.log('Login realizado! Token novo gerado.');

        // Passo 2: Buscar desafios disponíveis
        console.log('2. Buscando desafios em /api/self/challenges ...');
        
        const apiResponse = await axios.get(API_CHALLENGES_URL, {
            headers: { 
                'Authorization': `Bearer ${token}` 
            },
            params: {
                size: 50
            }
        });

        const desafios = apiResponse.data;
        
        console.log(`\nSUCESSO! Encontrados ${desafios.length} desafios.`);
        console.log('---------------------------------------------------');
        
        desafios.forEach(d => {
            console.log(`\nDESAFIO: [ID: ${d.id}] ${d.name}`);
            if (d.requirements && d.requirements.length > 0) {
                d.requirements.forEach(r => {
                    console.log(`   REQUISITO: [ID: ${r.id}] ${r.name}`);
                });
            } else {
                console.log('   (Sem requisitos visíveis)');
            }
        });
        console.log('\n---------------------------------------------------');
        console.log('Copie o ID do Desafio de Doação e do Requisito correspondente.');

    } catch (error) {
        console.error('\nERRO:');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error('   Msg:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('   ' + error.message);
        }
    }
}

getChallengeIds();