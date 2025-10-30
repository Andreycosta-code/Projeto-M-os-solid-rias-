// ========================================
// NAVIGATION.JS - Sistema de Navegação SPA (Single Page Application)
// ========================================

const Navigation = {
    // Configuração
    config: {
        appContainer: 'app',
        transitionDuration: 300
    },

    // Páginas/Rotas disponíveis
    routes: {
        'home': {
            title: 'Início',
            load: () => Navigation.loadHome()
        },
        'projetos': {
            title: 'Projetos Sociais',
            load: () => Navigation.loadProjetos()
        },
        'cadastro': {
            title: 'Cadastro de Voluntário',
            load: () => Navigation.loadCadastro()
        },
        'admin': {
            title: 'Painel Administrativo',
            load: () => Navigation.loadAdmin()
        }
    },

    // Página atual
    currentPage: 'home',

    // Inicializar sistema de navegação
    init: () => {
        // Verificar se existe container da app
        if (!document.getElementById(Navigation.config.appContainer)) {
            console.warn('Container da aplicação não encontrado');
            return;
        }

        // Configurar navegação por hash
        window.addEventListener('hashchange', () => {
            Navigation.handleRoute();
        });

        // Carregar rota inicial
        Navigation.handleRoute();

        // Interceptar clicks em links de navegação
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.dataset.route;
                Navigation.navigate(route);
            }
        });
    },

    // Lidar com mudança de rota
    handleRoute: () => {
        const hash = window.location.hash.slice(1) || 'home';
        Navigation.loadPage(hash);
    },

    // Navegar para página
    navigate: (page) => {
        if (Navigation.routes[page]) {
            window.location.hash = page;
        } else {
            console.error(`Página "${page}" não encontrada`);
            window.location.hash = 'home';
        }
    },

    // Carregar página
    loadPage: (page) => {
        if (!Navigation.routes[page]) {
            page = 'home';
        }

        const route = Navigation.routes[page];
        Navigation.currentPage = page;

        // Atualizar título
        document.title = `${route.title} - ONG Mãos Solidárias`;

        // Atualizar links ativos no menu
        Navigation.updateActiveLinks(page);

        // Aplicar transição
        const container = document.getElementById(Navigation.config.appContainer);
        if (container) {
            container.style.opacity = '0';
            
            setTimeout(() => {
                route.load();
                container.style.opacity = '1';
                window.scrollTo(0, 0);
            }, Navigation.config.transitionDuration);
        }
    },

    // Atualizar links ativos
    updateActiveLinks: (page) => {
        document.querySelectorAll('a[data-route]').forEach(link => {
            if (link.dataset.route === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // Carregar página Home
    loadHome: () => {
        const content = `
            <section class="hero">
                <div class="container">
                    <h2>Transformando Vidas Através da Solidariedade</h2>
                    <p>Juntos podemos construir um futuro melhor para comunidades carentes</p>
                    <a href="#cadastro" class="btn btn-primary" data-route="cadastro">Seja um Voluntário</a>
                </div>
            </section>

            <section class="about">
                <div class="container">
                    <h2>Bem-vindo à ONG Mãos Solidárias</h2>
                    <p>Somos uma organização dedicada a transformar vidas através de projetos sociais, educação e capacitação profissional.</p>
                    
                    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin: 3rem 0;">
                        ${Templates.statsCard('Pessoas Atendidas', '2.000+', '👥')}
                        ${Templates.statsCard('Projetos Ativos', '15', '📊')}
                        ${Templates.statsCard('Voluntários', '200+', '🤝')}
                        ${Templates.statsCard('Comunidades', '10', '🏘️')}
                    </div>

                    <div style="text-align: center; margin-top: 3rem;">
                        <a href="#projetos" class="btn btn-primary" data-route="projetos">Conheça Nossos Projetos</a>
                        <a href="#admin" class="btn btn-outline" data-route="admin" style="margin-left: 1rem;">Painel Admin</a>
                    </div>
                </div>
            </section>
        `;

        Navigation.renderContent(content);
    },

    // Carregar página Projetos
    loadProjetos: () => {
        const projects = [
            {
                title: 'Educação Para Todos',
                category: 'Educação',
                description: 'Programa de reforço escolar e alfabetização para crianças e adolescentes',
                image: 'https://picsum.photos/seed/projeto-educacao/1200/600',
                beneficiaries: 450,
                volunteers: 30,
                featured: true
            },
            {
                title: 'Capacita Jovem',
                category: 'Profissionalização',
                description: 'Cursos profissionalizantes gratuitos para jovens de 16 a 24 anos',
                image: 'https://picsum.photos/seed/projeto-profissionalizante/1200/600',
                beneficiaries: 200,
                volunteers: 15,
                featured: false
            },
            {
                title: 'Fome Zero Comunidade',
                category: 'Assistência Social',
                description: 'Distribuição de cestas básicas e refeições comunitárias',
                image: 'https://picsum.photos/seed/projeto-alimentacao/1200/600',
                beneficiaries: 600,
                volunteers: 40,
                featured: false
            },
            {
                title: 'Arte e Cultura',
                category: 'Cultura',
                description: 'Oficinas de arte, música, dança e teatro para crianças',
                image: 'https://picsum.photos/seed/projeto-cultura/1200/600',
                beneficiaries: 300,
                volunteers: 20,
                featured: false
            }
        ];

        const projectsHTML = projects.map(p => Templates.projectCard(p)).join('');

        const content = `
            <section class="page-header">
                <div class="container">
                    <h2>Nossos Projetos Sociais</h2>
                    <p>Conheça as iniciativas que estão transformando vidas</p>
                </div>
            </section>

            <section class="projects">
                <div class="container">
                    ${projectsHTML}
                    
                    <div style="text-align: center; margin-top: 3rem;">
                        <h3>Quer Fazer Parte?</h3>
                        <p>Cadastre-se como voluntário e ajude a transformar vidas!</p>
                        <a href="#cadastro" class="btn btn-primary" data-route="cadastro">Quero Ser Voluntário</a>
                    </div>
                </div>
            </section>
        `;

        Navigation.renderContent(content);
    },

    // Carregar página Cadastro
    loadCadastro: () => {
        const content = `
            <section class="page-header">
                <div class="container">
                    <h2>Cadastro de Voluntário</h2>
                    <p>Preencha o formulário e faça parte da nossa equipe</p>
                </div>
            </section>

            <section class="form-section">
                <div class="container">
                    <form id="cadastroForm" class="registration-form" novalidate>
                        <fieldset>
                            <legend>Dados Pessoais</legend>
                            
                            <div class="form-group">
                                <label for="nomeCompleto">Nome Completo *</label>
                                <input type="text" id="nomeCompleto" name="nomeCompleto" required minlength="3" placeholder="Digite seu nome completo">
                                <span class="error-message" id="nomeCompletoError"></span>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">E-mail *</label>
                                    <input type="email" id="email" name="email" required placeholder="seuemail@exemplo.com">
                                    <span class="error-message" id="emailError"></span>
                                </div>

                                <div class="form-group">
                                    <label for="telefone">Telefone *</label>
                                    <input type="tel" id="telefone" name="telefone" required placeholder="(00) 00000-0000">
                                    <span class="error-message" id="telefoneError"></span>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cpf">CPF *</label>
                                    <input type="text" id="cpf" name="cpf" required placeholder="000.000.000-00">
                                    <span class="error-message" id="cpfError"></span>
                                </div>

                                <div class="form-group">
                                    <label for="dataNascimento">Data de Nascimento *</label>
                                    <input type="date" id="dataNascimento" name="dataNascimento" required>
                                    <span class="error-message" id="dataNascimentoError"></span>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Endereço</legend>
                            
                            <div class="form-row">
                                <div class="form-group form-group-small">
                                    <label for="cep">CEP *</label>
                                    <input type="text" id="cep" name="cep" required placeholder="00000-000">
                                    <span class="error-message" id="cepError"></span>
                                </div>

                                <div class="form-group">
                                    <label for="endereco">Endereço *</label>
                                    <input type="text" id="endereco" name="endereco" required placeholder="Rua, Avenida, etc.">
                                    <span class="error-message" id="enderecoError"></span>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="cidade">Cidade *</label>
                                    <input type="text" id="cidade" name="cidade" required placeholder="Nome da cidade">
                                    <span class="error-message" id="cidadeError"></span>
                                </div>

                                <div class="form-group form-group-small">
                                    <label for="estado">Estado *</label>
                                    <select id="estado" name="estado" required>
                                        <option value="">Selecione</option>
                                        <option value="SP">SP</option>
                                        <option value="RJ">RJ</option>
                                        <option value="MG">MG</option>
                                        <option value="ES">ES</option>
                                    </select>
                                    <span class="error-message" id="estadoError"></span>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Informações de Voluntariado</legend>
                            
                            <div class="form-group">
                                <label for="areaInteresse">Área de Interesse *</label>
                                <select id="areaInteresse" name="areaInteresse" required>
                                    <option value="">Selecione uma área</option>
                                    <option value="educacao">Educação</option>
                                    <option value="profissionalizacao">Profissionalização</option>
                                    <option value="assistencia">Assistência Social</option>
                                    <option value="cultura">Arte e Cultura</option>
                                    <option value="administrativo">Administrativo</option>
                                </select>
                                <span class="error-message" id="areaInteresseError"></span>
                            </div>

                            <div class="form-group">
                                <label for="disponibilidade">Disponibilidade Semanal *</label>
                                <select id="disponibilidade" name="disponibilidade" required>
                                    <option value="">Selecione</option>
                                    <option value="2-4">2 a 4 horas por semana</option>
                                    <option value="4-8">4 a 8 horas por semana</option>
                                    <option value="8-12">8 a 12 horas por semana</option>
                                </select>
                                <span class="error-message" id="disponibilidadeError"></span>
                            </div>

                            <div class="form-group">
                                <label for="experiencia">Experiência Anterior</label>
                                <textarea id="experiencia" name="experiencia" rows="4" placeholder="Experiência com voluntariado (opcional)"></textarea>
                            </div>

                            <div class="form-group">
                                <label for="motivacao">Por que deseja ser voluntário? *</label>
                                <textarea id="motivacao" name="motivacao" rows="4" required minlength="50" placeholder="Conte-nos suas motivações"></textarea>
                                <span class="error-message" id="motivacaoError"></span>
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend>Termos e Condições</legend>
                            
                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="termos" name="termos" required>
                                    <span>Li e aceito os termos *</span>
                                </label>
                                <span class="error-message" id="termosError"></span>
                            </div>

                            <div class="form-group checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="privacidade" name="privacidade" required>
                                    <span>Autorizo o uso dos meus dados *</span>
                                </label>
                                <span class="error-message" id="privacidadeError"></span>
                            </div>
                        </fieldset>

                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Enviar Cadastro</button>
                            <button type="reset" class="btn btn-secondary">Limpar</button>
                        </div>

                        <div id="successMessage" class="success-message" style="display: none;">
                            <h3>✓ Cadastro realizado com sucesso!</h3>
                            <p>Obrigado por se cadastrar. Seus dados foram salvos!</p>
                            <a href="#admin" class="btn btn-outline" data-route="admin" style="margin-top: 1rem; display: inline-block;">Ver Painel Admin</a>
                        </div>
                    </form>
                </div>
            </section>
        `;

        Navigation.renderContent(content);
        
        // Inicializar validação do formulário após renderizar
        setTimeout(() => {
            FormValidation.init('cadastroForm');
        }, 100);
    },

    // Carregar página Admin
    loadAdmin: () => {
        const content = `
            <section class="page-header">
                <div class="container">
                    <h2>Painel Administrativo</h2>
                    <p>Gerencie os voluntários cadastrados</p>
                </div>
            </section>

            <section>
                <div class="container">
                    ${Templates.adminDashboard()}
                </div>
            </section>
        `;

        Navigation.renderContent(content);
    },

    // Renderizar conteúdo no container
    renderContent: (html) => {
        const container = document.getElementById(Navigation.config.appContainer);
        if (container) {
            container.innerHTML = html;
        }
    }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navigation;
}