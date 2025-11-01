// ========================================
// ACCESSIBILITY.JS - Sistema de Acessibilidade
// Controle de Modo Escuro e Alto Contraste
// ======================================== */

const Accessibility = {
    // Configuração
    modes: {
        NORMAL: 'normal',
        DARK: 'dark-mode',
        HIGH_CONTRAST: 'high-contrast'
    },

    currentMode: 'normal',

    // Inicializar sistema de acessibilidade
    init: () => {
        // Criar botões de controle
        Accessibility.createControls();

        // Carregar preferência salva
        Accessibility.loadPreference();

        // Detectar preferências do sistema
        Accessibility.detectSystemPreferences();

        // Adicionar atalhos de teclado
        Accessibility.setupKeyboardShortcuts();

        console.log('♿ Sistema de acessibilidade iniciado');
    },

    // Criar botões de controle
    createControls: () => {
        // Verificar se já existem
        if (document.querySelector('.accessibility-controls')) {
            return;
        }

        const controls = document.createElement('div');
        controls.className = 'accessibility-controls';
        controls.setAttribute('role', 'region');
        controls.setAttribute('aria-label', 'Controles de Acessibilidade');

        controls.innerHTML = `
            <button 
                class="accessibility-btn btn-normal-mode" 
                onclick="Accessibility.setMode('${Accessibility.modes.NORMAL}')"
                aria-label="Ativar modo normal"
                title="Modo Normal (Alt + 1)">
                Modo Normal
            </button>
            <button 
                class="accessibility-btn btn-dark-mode" 
                onclick="Accessibility.setMode('${Accessibility.modes.DARK}')"
                aria-label="Ativar modo escuro"
                title="Modo Escuro (Alt + 2)">
                Modo Escuro
            </button>
            <button 
                class="accessibility-btn btn-high-contrast" 
                onclick="Accessibility.setMode('${Accessibility.modes.HIGH_CONTRAST}')"
                aria-label="Ativar alto contraste"
                title="Alto Contraste (Alt + 3)">
                Alto Contraste
            </button>
        `;

        document.body.appendChild(controls);
    },

    // Definir modo
    setMode: (mode) => {
        const body = document.body;

        // Remover todos os modos
        Object.values(Accessibility.modes).forEach(m => {
            body.classList.remove(m);
        });

        // Aplicar novo modo (exceto normal)
        if (mode !== Accessibility.modes.NORMAL) {
            body.classList.add(mode);
        }

        Accessibility.currentMode = mode;

        // Salvar preferência
        Accessibility.savePreference(mode);

        // Atualizar botões
        Accessibility.updateButtons(mode);

        // Anunciar mudança para leitores de tela
        Accessibility.announceMode(mode);

        // Log
        console.log(`♿ Modo alterado para: ${mode}`);
    },

    // Atualizar estado visual dos botões
    updateButtons: (activeMode) => {
        const buttons = document.querySelectorAll('.accessibility-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Marcar botão ativo
        if (activeMode === Accessibility.modes.DARK) {
            document.querySelector('.btn-dark-mode')?.classList.add('active');
        } else if (activeMode === Accessibility.modes.HIGH_CONTRAST) {
            document.querySelector('.btn-high-contrast')?.classList.add('active');
        } else {
            document.querySelector('.btn-normal-mode')?.classList.add('active');
        }
    },

    // Salvar preferência no localStorage
    savePreference: (mode) => {
        try {
            localStorage.setItem('accessibility_mode', mode);
        } catch (e) {
            console.warn('Não foi possível salvar preferência de acessibilidade');
        }
    },

    // Carregar preferência salva
    loadPreference: () => {
        try {
            const savedMode = localStorage.getItem('accessibility_mode');
            if (savedMode && Object.values(Accessibility.modes).includes(savedMode)) {
                Accessibility.setMode(savedMode);
            }
        } catch (e) {
            console.warn('Não foi possível carregar preferência de acessibilidade');
        }
    },

    // Detectar preferências do sistema
    detectSystemPreferences: () => {
        // Detectar preferência de modo escuro
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // Opcional: ativar automaticamente se não houver preferência salva
            const savedMode = localStorage.getItem('accessibility_mode');
            if (!savedMode) {
                console.log('♿ Modo escuro detectado nas preferências do sistema');
                // Descomente para ativar automaticamente:
                // Accessibility.setMode(Accessibility.modes.DARK);
            }
        }

        // Detectar preferência de alto contraste
        if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
            console.log('♿ Alto contraste detectado nas preferências do sistema');
        }

        // Detectar mudanças em tempo real
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                console.log('♿ Preferência de modo escuro do sistema alterada:', e.matches);
            });
        }
    },

    // Configurar atalhos de teclado
    setupKeyboardShortcuts: () => {
        document.addEventListener('keydown', (e) => {
            // Alt + 1: Modo Normal
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                Accessibility.setMode(Accessibility.modes.NORMAL);
            }

            // Alt + 2: Modo Escuro
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                Accessibility.setMode(Accessibility.modes.DARK);
            }

            // Alt + 3: Alto Contraste
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                Accessibility.setMode(Accessibility.modes.HIGH_CONTRAST);
            }
        });

        console.log('♿ Atalhos de teclado configurados (Alt + 1/2/3)');
    },

    // Anunciar mudança para leitores de tela
    announceMode: (mode) => {
        const messages = {
            [Accessibility.modes.NORMAL]: 'Modo normal ativado',
            [Accessibility.modes.DARK]: 'Modo escuro ativado. Melhor para ambientes com pouca luz',
            [Accessibility.modes.HIGH_CONTRAST]: 'Alto contraste ativado. Melhor para pessoas com baixa visão'
        };

        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = messages[mode] || 'Modo alterado';

        document.body.appendChild(announcement);

        setTimeout(() => {
            announcement.remove();
        }, 1000);
    },

    // Melhorias gerais de acessibilidade
    enhanceAccessibility: () => {
        // Adicionar ARIA labels faltantes
        Accessibility.addAriaLabels();

        // Melhorar navegação por teclado
        Accessibility.enhanceKeyboardNavigation();

        // Adicionar skip links
        Accessibility.addSkipLinks();

        console.log('♿ Melhorias de acessibilidade aplicadas');
    },

    // Adicionar ARIA labels
    addAriaLabels: () => {
        // Adicionar labels em imagens sem alt
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.setAttribute('alt', 'Imagem decorativa');
            img.setAttribute('role', 'presentation');
        });

        // Adicionar labels em links vazios
        document.querySelectorAll('a:not([aria-label])').forEach(link => {
            if (!link.textContent.trim()) {
                link.setAttribute('aria-label', 'Link');
            }
        });

        // Marcar região principal
        const main = document.querySelector('main');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Marcar navegação
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
    },

    // Melhorar navegação por teclado
    enhanceKeyboardNavigation: () => {
        // Garantir que elementos interativos tenham foco visível
        document.querySelectorAll('a, button, input, select, textarea').forEach(el => {
            el.addEventListener('focus', (e) => {
                e.target.setAttribute('data-keyboard-focus', 'true');
            });

            el.addEventListener('blur', (e) => {
                e.target.removeAttribute('data-keyboard-focus');
            });
        });

        // Adicionar navegação por teclado em cards clicáveis
        document.querySelectorAll('[onclick]').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }

            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    el.click();
                }
            });
        });
    },

    // Adicionar skip links
    addSkipLinks: () => {
        // Verificar se já existe
        if (document.querySelector('.skip-to-content')) {
            return;
        }

        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.setAttribute('accesskey', 's');

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Garantir que main tenha ID
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }
    },

    // Verificar contraste de cores
    checkContrast: () => {
        console.log('♿ Verificando contrastes de cores...');
        // Esta função seria mais complexa em produção
        // Aqui apenas logamos que a verificação foi solicitada
        console.log('♿ Recomenda-se usar ferramentas como WAVE ou Lighthouse para verificação completa');
    },

    // Gerar relatório de acessibilidade
    generateReport: () => {
        const report = {
            currentMode: Accessibility.currentMode,
            images: {
                total: document.querySelectorAll('img').length,
                withoutAlt: document.querySelectorAll('img:not([alt])').length
            },
            links: {
                total: document.querySelectorAll('a').length,
                withoutLabel: document.querySelectorAll('a:not([aria-label])').length
            },
            forms: {
                total: document.querySelectorAll('input, select, textarea').length,
                withLabel: document.querySelectorAll('label').length
            },
            headings: {
                h1: document.querySelectorAll('h1').length,
                h2: document.querySelectorAll('h2').length,
                h3: document.querySelectorAll('h3').length
            }
        };

        console.table(report);
        return report;
    }
};

// Inicializar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Accessibility.init();
        Accessibility.enhanceAccessibility();
    });
} else {
    Accessibility.init();
    Accessibility.enhanceAccessibility();
}

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Accessibility;
}

// Tornar disponível globalmente
window.Accessibility = Accessibility;

console.log('%c♿ accessibility.js carregado', 'color: #27ae60; font-weight: bold;');