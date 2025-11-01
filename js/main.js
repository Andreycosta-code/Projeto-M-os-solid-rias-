// ========================================
// MAIN.JS - Script Principal da Aplicação
// ========================================

/**
 * Aplicação ONG Mãos Solidárias
 * Sistema modular com SPA, validações avançadas e armazenamento local
 * 
 * Módulos:
 * - Utils: Funções utilitárias
 * - Storage: Armazenamento local
 * - FormValidation: Validação de formulários
 * - Templates: Sistema de templates
 * - Navigation: Sistema SPA
 */

const App = {
    // Versão da aplicação
    version: '3.0.0',

    // Configuração
    config: {
        debug: true,
        autoSave: true,
        autoSaveInterval: 30000, // 30 segundos
        enableSPA: false // Desabilitado por padrão para manter compatibilidade
    },

    // Inicializar aplicação
    init: () => {
        console.log(`%c🤝 ONG Mãos Solidárias v${App.version}`, 'font-size: 20px; font-weight: bold; color: #4A90E2;');
        console.log('%c✨ Aplicação carregada com sucesso!', 'font-size: 14px; color: #27ae60;');

        // Verificar compatibilidade do navegador
        App.checkBrowserCompatibility();

        // Inicializar componentes
        App.initializeComponents();

        // Inicializar menu mobile
        App.initMobileMenu();

        // Inicializar formulários
        App.initForms();

        // Inicializar animações
        App.initAnimations();

        // Verificar modo SPA
        if (App.config.enableSPA) {
            App.initSPA();
        }

        // Log de estatísticas
        if (App.config.debug) {
            App.logStats();
        }

        // Verificar service worker (PWA)
        App.registerServiceWorker();

        console.log('%c📊 Sistema pronto para uso!', 'color: #4A90E2; font-weight: bold;');
    },

    // Verificar compatibilidade do navegador
    checkBrowserCompatibility: () => {
        const features = {
            localStorage: typeof(Storage) !== 'undefined',
            fetch: typeof(fetch) !== 'undefined',
            promise: typeof(Promise) !== 'undefined',
            async: typeof(async function(){}) === 'function'
        };

        const unsupported = Object.keys(features).filter(key => !features[key]);

        if (unsupported.length > 0) {
            console.warn('⚠️ Recursos não suportados:', unsupported);
            Utils.showAlert(
                'Seu navegador pode não suportar todas as funcionalidades. Recomendamos atualizar para a versão mais recente.',
                'warning'
            );
        }
    },

    // Inicializar componentes
    initializeComponents: () => {
        // Configurar tooltips
        App.initTooltips();

        // Configurar smooth scroll
        App.initSmoothScroll();

        // Configurar back to top
        App.initBackToTop();

        // Configurar lazy loading de imagens
        App.initLazyLoading();
    },

    // Inicializar menu mobile
    initMobileMenu: () => {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Fechar ao clicar em link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Fechar ao clicar fora
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    },

    // Inicializar formulários
    initForms: () => {
        const cadastroForm = document.getElementById('cadastroForm');
        
        if (cadastroForm) {
            console.log('📝 Inicializando validação de formulário...');
            FormValidation.init('cadastroForm');
        }

        // Adicionar listener para reset
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('reset', () => {
                setTimeout(() => {
                    const errorMessages = form.querySelectorAll('.error-message');
                    errorMessages.forEach(error => error.textContent = '');
                    
                    const errorInputs = form.querySelectorAll('.error');
                    errorInputs.forEach(input => input.classList.remove('error'));
                }, 10);
            });
        });
    },

    // Inicializar animações
    initAnimations: () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const elementsToAnimate = document.querySelectorAll('.project-card, .team-member, .opportunity-card, .donation-card');
        elementsToAnimate.forEach(el => observer.observe(el));
    },

    // Inicializar SPA
    initSPA: () => {
        console.log('🚀 Modo SPA ativado');
        Navigation.init();
    },

    // Inicializar tooltips
    initTooltips: () => {
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.dataset.tooltip;
                tooltip.style.cssText = `
                    position: absolute;
                    background: #2c3e50;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    font-size: 0.875rem;
                    z-index: 10000;
                    pointer-events: none;
                `;
                document.body.appendChild(tooltip);

                const rect = e.target.getBoundingClientRect();
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
                tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;

                e.target.addEventListener('mouseleave', () => {
                    tooltip.remove();
                }, { once: true });
            });
        });
    },

    // Inicializar smooth scroll
    initSmoothScroll: () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '' && !this.dataset.route) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        Utils.smoothScrollTo(target);
                    }
                }
            });
        });
    },

    // Inicializar botão voltar ao topo
    initBackToTop: () => {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4A90E2 0%, #5CA9FB 100%);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
            box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
        `;

        document.body.appendChild(backToTop);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.opacity = '1';
                backToTop.style.visibility = 'visible';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.visibility = 'hidden';
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },

    // Inicializar lazy loading
    initLazyLoading: () => {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.src;
            });
        } else {
            // Fallback para navegadores antigos
            const images = document.querySelectorAll('img[loading="lazy"]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    },

    // Registrar Service Worker (PWA)
    registerServiceWorker: () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service worker desabilitado por padrão
                // Para habilitar, crie o arquivo sw.js na raiz
                // navigator.serviceWorker.register('/sw.js')
                //     .then(reg => console.log('Service Worker registrado', reg))
                //     .catch(err => console.log('Erro no Service Worker', err));
            });
        }
    },

    // Log de estatísticas
    logStats: () => {
        const stats = Storage.getStats();
        console.log('%c📊 Estatísticas do Sistema:', 'font-weight: bold; color: #4A90E2;');
        console.table(stats);
    },

    // Verificar conexão
    checkConnection: () => {
        if (!navigator.onLine) {
            Utils.showAlert('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning');
        }
    },

    // Handlers de eventos globais
    setupGlobalHandlers: () => {
        // Online/Offline
        window.addEventListener('online', () => {
            Utils.showToast('Conexão restaurada!', 'success');
        });

        window.addEventListener('offline', () => {
            Utils.showToast('Você está offline', 'error');
        });

        // Erro global
        window.addEventListener('error', (e) => {
            if (App.config.debug) {
                console.error('Erro global capturado:', e);
            }
        });

        // Aviso antes de sair (se houver formulário não salvo)
        window.addEventListener('beforeunload', (e) => {
            const forms = document.querySelectorAll('form');
            let hasUnsavedData = false;

            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.value && input.type !== 'checkbox') {
                        hasUnsavedData = true;
                    }
                });
            });

            if (hasUnsavedData) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },

    // Modo debug
    enableDebugMode: () => {
        console.log('%c🔧 Modo Debug Ativado', 'background: #f39c12; color: white; padding: 4px 8px; border-radius: 4px;');
        
        window.AppDebug = {
            Storage: typeof Storage !== 'undefined' ? Storage : null,
            Utils: typeof Utils !== 'undefined' ? Utils : null,
            FormValidation: typeof FormValidation !== 'undefined' ? FormValidation : null,
            Templates: typeof Templates !== 'undefined' ? Templates : null,
            Navigation: typeof Navigation !== 'undefined' ? Navigation : null,
            clearStorage: () => typeof Storage !== 'undefined' ? Storage.clear() : null,
            getVolunteers: () => typeof Storage !== 'undefined' ? Storage.getVolunteers() : [],
            exportData: () => typeof Templates !== 'undefined' ? Templates.exportVolunteers() : null
        };

        console.log('Ferramentas disponíveis em: window.AppDebug');
    }
};

// ========================================
// INICIALIZAÇÃO
// ========================================

// Aguardar DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        App.init();
        App.setupGlobalHandlers();
        App.checkConnection();
    });
} else {
    App.init();
    App.setupGlobalHandlers();
    App.checkConnection();
}

// Ativar modo debug em desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    App.enableDebugMode();
}

// Exportar App para console
window.App = App;

// ========================================
// FUNÇÕES GLOBAIS (para compatibilidade)
// ========================================

// Manter funções do script.js original para compatibilidade
function showToast(message, type) {
    Utils.showToast(message, type);
}

function showAlert(message, type) {
    Utils.showAlert(message, type);
}

// Log de carregamento
console.log('%c✓ main.js carregado', 'color: #27ae60; font-weight: bold;');