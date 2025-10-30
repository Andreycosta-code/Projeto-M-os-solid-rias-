// ========================================
// STORAGE.JS - Sistema de Armazenamento Local
// ========================================

const Storage = {
    // Prefixo para todas as chaves
    prefix: 'ong_',

    // Salvar dados
    set: (key, value) => {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(Storage.prefix + key, serialized);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    },

    // Recuperar dados
    get: (key) => {
        try {
            const item = localStorage.getItem(Storage.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
        }
    },

    // Remover dados
    remove: (key) => {
        try {
            localStorage.removeItem(Storage.prefix + key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    },

    // Limpar todos os dados da aplicação
    clear: () => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(Storage.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    },

    // Verificar se existe
    exists: (key) => {
        return localStorage.getItem(Storage.prefix + key) !== null;
    },

    // Salvar rascunho do formulário
    saveDraft: (formId, data) => {
        const drafts = Storage.get('drafts') || {};
        drafts[formId] = {
            data: data,
            timestamp: new Date().toISOString()
        };
        return Storage.set('drafts', drafts);
    },

    // Recuperar rascunho do formulário
    getDraft: (formId) => {
        const drafts = Storage.get('drafts') || {};
        return drafts[formId] || null;
    },

    // Remover rascunho do formulário
    removeDraft: (formId) => {
        const drafts = Storage.get('drafts') || {};
        delete drafts[formId];
        return Storage.set('drafts', drafts);
    },

    // Listar todos os rascunhos
    listDrafts: () => {
        return Storage.get('drafts') || {};
    },

    // Salvar histórico de voluntários cadastrados
    saveVolunteer: (volunteer) => {
        const volunteers = Storage.get('volunteers') || [];
        volunteer.id = Date.now();
        volunteer.createdAt = new Date().toISOString();
        volunteers.push(volunteer);
        return Storage.set('volunteers', volunteers);
    },

    // Listar voluntários
    getVolunteers: () => {
        return Storage.get('volunteers') || [];
    },

    // Buscar voluntário por ID
    getVolunteerById: (id) => {
        const volunteers = Storage.getVolunteers();
        return volunteers.find(v => v.id === id) || null;
    },

    // Atualizar voluntário
    updateVolunteer: (id, data) => {
        const volunteers = Storage.getVolunteers();
        const index = volunteers.findIndex(v => v.id === id);
        
        if (index !== -1) {
            volunteers[index] = { ...volunteers[index], ...data, updatedAt: new Date().toISOString() };
            return Storage.set('volunteers', volunteers);
        }
        
        return false;
    },

    // Remover voluntário
    deleteVolunteer: (id) => {
        const volunteers = Storage.getVolunteers();
        const filtered = volunteers.filter(v => v.id !== id);
        return Storage.set('volunteers', filtered);
    },

    // Salvar preferências do usuário
    savePreferences: (preferences) => {
        return Storage.set('preferences', preferences);
    },

    // Recuperar preferências
    getPreferences: () => {
        return Storage.get('preferences') || {
            theme: 'light',
            language: 'pt-BR',
            notifications: true
        };
    },

    // Salvar cache de busca de CEP
    cacheCEP: (cep, data) => {
        const cache = Storage.get('cep_cache') || {};
        cache[cep] = {
            data: data,
            timestamp: new Date().toISOString()
        };
        return Storage.set('cep_cache', cache);
    },

    // Recuperar CEP do cache
    getCachedCEP: (cep) => {
        const cache = Storage.get('cep_cache') || {};
        const cached = cache[cep];
        
        if (cached) {
            // Cache válido por 30 dias
            const cacheDate = new Date(cached.timestamp);
            const now = new Date();
            const diffDays = (now - cacheDate) / (1000 * 60 * 60 * 24);
            
            if (diffDays < 30) {
                return cached.data;
            }
        }
        
        return null;
    },

    // Estatísticas de uso
    getStats: () => {
        return {
            volunteers: Storage.getVolunteers().length,
            drafts: Object.keys(Storage.listDrafts()).length,
            cacheSize: Object.keys(Storage.get('cep_cache') || {}).length
        };
    },

    // Exportar todos os dados
    exportData: () => {
        const data = {
            volunteers: Storage.getVolunteers(),
            drafts: Storage.listDrafts(),
            preferences: Storage.getPreferences(),
            exportedAt: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    },

    // Importar dados
    importData: (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.volunteers) {
                Storage.set('volunteers', data.volunteers);
            }
            if (data.drafts) {
                Storage.set('drafts', data.drafts);
            }
            if (data.preferences) {
                Storage.set('preferences', data.preferences);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            return false;
        }
    }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}