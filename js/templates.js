// ========================================
// TEMPLATES.JS - Sistema de Templates JavaScript
// ========================================

const Templates = {
    // Template para card de voluntário
    volunteerCard: (volunteer) => {
        return `
            <div class="card volunteer-card" data-id="${volunteer.id}">
                <div class="card-header">
                    <h3>${Utils.sanitize(volunteer.nomeCompleto)}</h3>
                    <span class="badge badge-primary">${Utils.sanitize(volunteer.areaInteresse)}</span>
                </div>
                <div class="card-body">
                    <p><strong>Email:</strong> ${Utils.sanitize(volunteer.email)}</p>
                    <p><strong>Telefone:</strong> ${Utils.sanitize(volunteer.telefone)}</p>
                    <p><strong>Disponibilidade:</strong> ${Utils.sanitize(volunteer.disponibilidade)} horas/semana</p>
                    <p><strong>Cadastrado em:</strong> ${Utils.formatDate(volunteer.createdAt)}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-sm btn-outline" onclick="Templates.viewVolunteer(${volunteer.id})">Ver Detalhes</button>
                    <button class="btn btn-sm btn-secondary" onClick="Storage.deleteVolunteer(${volunteer.id}); Navigation.loadAdmin()">Excluir</button>
                </div>
            </div>
        `;
    },

    // Template para lista de voluntários
    volunteerList: (volunteers) => {
        if (volunteers.length === 0) {
            return `
                <div class="alert alert-info">
                    <p>Nenhum voluntário cadastrado ainda.</p>
                </div>
            `;
        }

        return `
            <div class="volunteers-grid">
                ${volunteers.map(v => Templates.volunteerCard(v)).join('')}
            </div>
        `;
    },

    // Template para detalhes de voluntário (modal)
    volunteerDetails: (volunteer) => {
        return `
            <div class="volunteer-details">
                <h2>${Utils.sanitize(volunteer.nomeCompleto)}</h2>
                
                <h3>Dados Pessoais</h3>
                <ul>
                    <li><strong>Email:</strong> ${Utils.sanitize(volunteer.email)}</li>
                    <li><strong>Telefone:</strong> ${Utils.sanitize(volunteer.telefone)}</li>
                    <li><strong>CPF:</strong> ${Utils.sanitize(volunteer.cpf)}</li>
                    <li><strong>Data de Nascimento:</strong> ${Utils.formatDate(volunteer.dataNascimento)}</li>
                    <li><strong>Idade:</strong> ${Utils.calculateAge(volunteer.dataNascimento)} anos</li>
                </ul>

                <h3>Endereço</h3>
                <ul>
                    <li><strong>CEP:</strong> ${Utils.sanitize(volunteer.cep)}</li>
                    <li><strong>Endereço:</strong> ${Utils.sanitize(volunteer.endereco)}</li>
                    <li><strong>Cidade:</strong> ${Utils.sanitize(volunteer.cidade)}</li>
                    <li><strong>Estado:</strong> ${Utils.sanitize(volunteer.estado)}</li>
                </ul>

                <h3>Informações de Voluntariado</h3>
                <ul>
                    <li><strong>Área de Interesse:</strong> ${Utils.sanitize(volunteer.areaInteresse)}</li>
                    <li><strong>Disponibilidade:</strong> ${Utils.sanitize(volunteer.disponibilidade)} horas/semana</li>
                </ul>

                ${volunteer.experiencia ? `
                    <h3>Experiência Anterior</h3>
                    <p>${Utils.sanitize(volunteer.experiencia)}</p>
                ` : ''}

                <h3>Motivação</h3>
                <p>${Utils.sanitize(volunteer.motivacao)}</p>

                <p class="text-sm text-gray mt-3">
                    <strong>Cadastrado em:</strong> ${new Date(volunteer.createdAt).toLocaleString('pt-BR')}
                </p>
            </div>
        `;
    },

    // Template para projeto
    projectCard: (project) => {
        return `
            <article class="project-card">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                    ${project.featured ? '<span class="project-badge">Destaque</span>' : ''}
                </div>
                <div class="project-content">
                    <h3>${project.title}</h3>
                    <p class="project-category">Categoria: ${project.category}</p>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-stats">
                        <span class="badge badge-success">${project.beneficiaries} beneficiados</span>
                        <span class="badge badge-info">${project.volunteers} voluntários</span>
                    </div>
                </div>
            </article>
        `;
    },

    // Template para estatísticas
    statsCard: (title, value, icon) => {
        return `
            <div class="stats-card">
                <div class="stats-icon">${icon}</div>
                <div class="stats-content">
                    <h4>${title}</h4>
                    <p class="stats-value">${value}</p>
                </div>
            </div>
        `;
    },

    // Template para badge
    badge: (text, type = 'primary') => {
        return `<span class="badge badge-${type}">${Utils.sanitize(text)}</span>`;
    },

    // Template para tag
    tag: (text) => {
        return `<span class="tag">${Utils.sanitize(text)}</span>`;
    },

    // Template para alert
    alert: (message, type = 'info') => {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        return `
            <div class="alert alert-${type}">
                <span style="font-size: 20px;">${icons[type]}</span>
                <span>${message}</span>
                <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; font-size: 20px; cursor: pointer;">&times;</button>
            </div>
        `;
    },

    // Template para modal
    modal: (id, title, content, footer = '') => {
        return `
            <div id="${id}" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${title}</h3>
                        <button class="modal-close" onclick="Templates.closeModal('${id}')">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
                </div>
            </div>
        `;
    },

    // Template para loading spinner
    loading: () => {
        return `
            <div class="loading-spinner" style="text-align: center; padding: 2rem;">
                <div style="display: inline-block; width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #4A90E2; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 1rem; color: #666;">Carregando...</p>
            </div>
        `;
    },

    // Renderizar template em elemento
    render: (elementId, template) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = template;
        }
    },

    // Abrir modal
    openModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // Fechar modal
    closeModal: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    // Ver detalhes de voluntário
    viewVolunteer: (id) => {
        const volunteer = Storage.getVolunteerById(id);
        if (volunteer) {
            const modalContent = Templates.volunteerDetails(volunteer);
            const modalHTML = Templates.modal('volunteerModal', 'Detalhes do Voluntário', modalContent);
            
            // Remover modal anterior se existir
            const existingModal = document.getElementById('volunteerModal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Adicionar novo modal
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            Templates.openModal('volunteerModal');
            
            // Fechar ao clicar fora
            const modal = document.getElementById('volunteerModal');
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    Templates.closeModal('volunteerModal');
                }
            });
        }
    },

    // Deletar voluntário
    deleteVolunteer: (id) => {
        if (confirm('Tem certeza que deseja remover este voluntário?')) {
            if (Storage.deleteVolunteer(id)) {
                Utils.showToast('Voluntário removido com sucesso', 'success');
                Templates.loadVolunteersList();
            }
        }
    },

    // Carregar lista de voluntários
    loadVolunteersList: () => {
        const volunteers = Storage.getVolunteers();
        const container = document.getElementById('volunteersContainer');
        
        if (container) {
            container.innerHTML = Templates.volunteerList(volunteers);
        }
    },

    // Template para dashboard de administração
    adminDashboard: () => {
        const stats = Storage.getStats();
        const volunteers = Storage.getVolunteers();
        
        return `
            <div class="admin-dashboard">
                <h2>Dashboard Administrativo</h2>
                
                <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
                    ${Templates.statsCard('Voluntários Cadastrados', stats.volunteers, '👥')}
                    ${Templates.statsCard('Rascunhos Salvos', stats.drafts, '📝')}
                    ${Templates.statsCard('CEPs em Cache', stats.cacheSize, '📍')}
                </div>

                <div class="admin-actions" style="margin: 2rem 0; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" onclick="Templates.exportVolunteers()">
                        Exportar Dados
                    </button>
                    <button class="btn btn-outline" onclick="Templates.importVolunteers()">
                        Importar Dados
                    </button>
                    <button class="btn btn-secondary" onclick="Templates.clearAllData()">
                        Limpar Todos os Dados
                    </button>
                </div>

                <h3>Voluntários Cadastrados</h3>
                <div id="volunteersContainer">
                    ${Templates.volunteerList(volunteers)}
                </div>
            </div>
        `;
    },

    // Exportar dados de voluntários
    exportVolunteers: () => {
        const data = Storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voluntarios_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showToast('Dados exportados com sucesso!', 'success');
    },

    // Importar dados de voluntários
    importVolunteers: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    if (Storage.importData(event.target.result)) {
                        Utils.showToast('Dados importados com sucesso!', 'success');
                        Templates.loadVolunteersList();
                    } else {
                        Utils.showToast('Erro ao importar dados', 'error');
                    }
                } catch (error) {
                    Utils.showToast('Arquivo inválido', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },

    // Limpar todos os dados
    clearAllData: () => {
        if (confirm('ATENÇÃO: Isso irá apagar TODOS os dados salvos (voluntários, rascunhos, cache). Tem certeza?')) {
            if (confirm('Confirma novamente? Esta ação não pode ser desfeita!')) {
                Storage.clear();
                Utils.showToast('Todos os dados foram removidos', 'success');
                Templates.loadVolunteersList();
            }
        }
    }
};

// Adicionar CSS para animação do loading
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .volunteers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin: 2rem 0;
    }
    
    .volunteer-card {
        transition: all 0.3s ease;
    }
    
    .volunteer-card:hover {
        transform: translateY(-5px);
    }
    
    .stats-card {
        background: linear-gradient(135deg, #fff 0%, #f7fafc 100%);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(74, 144, 226, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .stats-icon {
        font-size: 2.5rem;
    }
    
    .stats-value {
        font-size: 2rem;
        font-weight: bold;
        color: #4A90E2;
        margin: 0;
    }
    
    .volunteer-details h3 {
        color: #4A90E2;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #e6f0fa;
        padding-bottom: 0.5rem;
    }
    
    .volunteer-details ul {
        list-style: none;
        margin-left: 0;
    }
    
    .volunteer-details li {
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0f0f0;
    }
`;
document.head.appendChild(style);

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Templates;
}