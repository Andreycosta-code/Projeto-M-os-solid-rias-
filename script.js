// ========================================
// MENU MOBILE RESPONSIVO
// ========================================

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Fecha o menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ========================================
// MÁSCARAS DE INPUT (CPF, TELEFONE, CEP)
// ========================================

// Função genérica para aplicar máscara
function applyMask(input, maskFunction) {
    if (input) {
        input.addEventListener('input', (e) => {
            e.target.value = maskFunction(e.target.value);
        });
    }
}

// Máscara de CPF: 000.000.000-00
function maskCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Máscara de Telefone: (00) 00000-0000
function maskPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Máscara de CEP: 00000-000
function maskCEP(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{3})\d+?$/, '$1');
}

// Aplicar máscaras aos inputs
const cpfInput = document.getElementById('cpf');
const telefoneInput = document.getElementById('telefone');
const cepInput = document.getElementById('cep');

applyMask(cpfInput, maskCPF);
applyMask(telefoneInput, maskPhone);
applyMask(cepInput, maskCEP);

// ========================================
// VALIDAÇÃO DO FORMULÁRIO
// ========================================

const cadastroForm = document.getElementById('cadastroForm');

if (cadastroForm) {
    // Validação em tempo real
    const inputs = cadastroForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validação ao sair do campo
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Remove erro ao digitar
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                input.classList.remove('error');
                const errorElement = document.getElementById(`${input.id}Error`);
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
    });

    // Validação ao submeter o formulário
    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const inputs = cadastroForm.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            submitForm();
        } else {
            // Rola para o primeiro erro
            const firstError = cadastroForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // Limpar formulário
    cadastroForm.addEventListener('reset', () => {
        setTimeout(() => {
            const errorMessages = cadastroForm.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
            
            const errorInputs = cadastroForm.querySelectorAll('.error');
            errorInputs.forEach(input => {
                input.classList.remove('error');
            });
        }, 10);
    });
}

// Função de validação individual de campo
function validateField(field) {
    const errorElement = document.getElementById(`${field.id}Error`);
    let errorMessage = '';
    let isValid = true;

    // Remove validação visual anterior
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }

    // Validação de campo obrigatório
    if (field.hasAttribute('required') && !field.value.trim()) {
        errorMessage = 'Este campo é obrigatório';
        isValid = false;
    }
    // Validação de e-mail
    else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            errorMessage = 'Por favor, insira um e-mail válido';
            isValid = false;
        }
    }
    // Validação de CPF
    else if (field.id === 'cpf' && field.value) {
        if (!validateCPF(field.value)) {
            errorMessage = 'CPF inválido';
            isValid = false;
        }
    }
    // Validação de telefone
    else if (field.id === 'telefone' && field.value) {
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        if (!phoneRegex.test(field.value)) {
            errorMessage = 'Telefone inválido. Use o formato (11) 98765-4321';
            isValid = false;
        }
    }
    // Validação de CEP
    else if (field.id === 'cep' && field.value) {
        const cepRegex = /^\d{5}-\d{3}$/;
        if (!cepRegex.test(field.value)) {
            errorMessage = 'CEP inválido. Use o formato 12345-678';
            isValid = false;
        }
    }
    // Validação de data de nascimento
    else if (field.type === 'date' && field.value) {
        const birthDate = new Date(field.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 14 || age > 100) {
            errorMessage = 'Idade deve estar entre 14 e 100 anos';
            isValid = false;
        }
    }
    // Validação de comprimento mínimo
    else if (field.hasAttribute('minlength') && field.value.length > 0) {
        const minLength = parseInt(field.getAttribute('minlength'));
        if (field.value.length < minLength) {
            errorMessage = `Mínimo de ${minLength} caracteres`;
            isValid = false;
        }
    }
    // Validação de checkbox obrigatório
    else if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        errorMessage = 'Você deve aceitar este termo';
        isValid = false;
    }

    // Aplica o erro se não for válido
    if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
        }
    }

    return isValid;
}

// Validação de CPF
function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(9))) {
        return false;
    }
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10) digit = 0;
    if (digit !== parseInt(cpf.charAt(10))) {
        return false;
    }
    
    return true;
}

// ========================================
// BUSCA DE CEP (API ViaCEP)
// ========================================

if (cepInput) {
    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                
                if (!data.erro) {
                    // Preenche os campos automaticamente
                    const enderecoInput = document.getElementById('endereco');
                    const cidadeInput = document.getElementById('cidade');
                    const estadoInput = document.getElementById('estado');
                    
                    if (enderecoInput) enderecoInput.value = data.logradouro;
                    if (cidadeInput) cidadeInput.value = data.localidade;
                    if (estadoInput) estadoInput.value = data.uf;
                } else {
                    alert('CEP não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    });
}

// ========================================
// SUBMIT DO FORMULÁRIO
// ========================================

function submitForm() {
    const form = document.getElementById('cadastroForm');
    const successMessage = document.getElementById('successMessage');
    
    // Simula envio (em produção, enviaria para um servidor)
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    console.log('Dados do formulário:', data);
    
    // Mostra mensagem de sucesso
    form.style.display = 'none';
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Em produção, aqui você faria uma requisição AJAX/Fetch para o servidor
    // Exemplo:
    // fetch('/api/cadastro', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('Success:', data);
    // })
    // .catch((error) => {
    //     console.error('Error:', error);
    // });
}

// ========================================
// ANIMAÇÕES AO SCROLL
// ========================================

// Intersection Observer para animações
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

// Observa elementos para animação
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('.project-card, .team-member, .opportunity-card, .donation-card');
    elementsToAnimate.forEach(el => observer.observe(el));
});

// ========================================
// SMOOTH SCROLL PARA LINKS ÂNCORA
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========================================
// CONTADOR DE CARACTERES PARA TEXTAREA
// ========================================

const textareas = document.querySelectorAll('textarea[maxlength]');
textareas.forEach(textarea => {
    const maxLength = textarea.getAttribute('maxlength');
    const helpText = textarea.nextElementSibling;
    
    if (helpText && helpText.tagName === 'SMALL') {
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            const originalText = helpText.textContent;
            const baseText = originalText.split('(')[0].trim();
            helpText.textContent = `${baseText} (${remaining} caracteres restantes)`;
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter();
    }
});

// ========================================
// LAZY LOADING PARA IMAGENS
// ========================================

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback para navegadores que não suportam lazy loading nativo
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ========================================
// ACESSIBILIDADE - SKIP TO CONTENT
// ========================================

// Adiciona link "Pular para conteúdo" para acessibilidade
const body = document.body;
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.className = 'skip-to-content';
skipLink.textContent = 'Pular para o conteúdo principal';
body.insertBefore(skipLink, body.firstChild);

// Adiciona ID ao main se não existir
const main = document.querySelector('main');
if (main && !main.id) {
    main.id = 'main';
}

// ========================================
// PERFORMANCE - DEBOUNCE PARA EVENTOS
// ========================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exemplo de uso: otimização de eventos de resize
const handleResize = debounce(() => {
    // Código a ser executado no resize
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ========================================
// MENSAGENS DE FEEDBACK
// ========================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Adiciona animações CSS para o toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// PROTEÇÃO CONTRA SPAM NO FORMULÁRIO
// ========================================

let formSubmitCount = 0;
const MAX_SUBMIT_ATTEMPTS = 3;
const RESET_TIME = 300000; // 5 minutos

function checkSubmitLimit() {
    if (formSubmitCount >= MAX_SUBMIT_ATTEMPTS) {
        showToast('Você atingiu o limite de envios. Tente novamente mais tarde.', 'error');
        return false;
    }
    formSubmitCount++;
    
    if (formSubmitCount === 1) {
        setTimeout(() => {
            formSubmitCount = 0;
        }, RESET_TIME);
    }
    
    return true;
}

// ========================================
// VALIDAÇÃO DE FORÇA DE SENHA (caso adicione campo de senha)
// ========================================

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    const levels = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#2ecc71', '#27ae60'];
    
    return {
        strength: Math.min(strength, 5),
        label: levels[Math.min(strength, 4)],
        color: colors[Math.min(strength, 4)]
    };
}

// ========================================
// MODAL HELPER (para futuras implementações)
// ========================================

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" aria-label="Fechar">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const overlay = modal.querySelector('.modal-overlay');
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 8px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        z-index: 1;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    const closeButton = modal.querySelector('.modal-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        line-height: 1;
        padding: 0.5rem;
    `;
    
    const closeModal = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
    
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    return modal;
}

// ========================================
// FORMATAÇÃO DE DADOS PARA EXIBIÇÃO
// ========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    } else if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

// ========================================
// STORAGE HELPER (localStorage)
// ========================================

const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    },
    
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
            return null;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
            return false;
        }
    },
    
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Erro ao limpar localStorage:', e);
            return false;
        }
    }
};

// ========================================
// SALVAR RASCUNHO DO FORMULÁRIO
// ========================================

if (cadastroForm) {
    // Salva rascunho a cada 30 segundos
    const saveDraft = debounce(() => {
        const formData = new FormData(cadastroForm);
        const draft = {};
        
        formData.forEach((value, key) => {
            if (key !== 'termos' && key !== 'privacidade') {
                draft[key] = value;
            }
        });
        
        storage.set('cadastroDraft', draft);
        console.log('Rascunho salvo automaticamente');
    }, 30000);
    
    // Monitora mudanças no formulário
    cadastroForm.addEventListener('input', saveDraft);
    
    // Carrega rascunho ao carregar a página
    window.addEventListener('load', () => {
        const draft = storage.get('cadastroDraft');
        
        if (draft && Object.keys(draft).length > 0) {
            const loadDraft = confirm('Encontramos um rascunho salvo. Deseja recuperá-lo?');
            
            if (loadDraft) {
                Object.keys(draft).forEach(key => {
                    const field = document.getElementById(key);
                    if (field) {
                        field.value = draft[key];
                    }
                });
                showToast('Rascunho recuperado com sucesso!', 'success');
            } else {
                storage.remove('cadastroDraft');
            }
        }
    });
    
    // Remove rascunho após envio bem-sucedido
    cadastroForm.addEventListener('submit', () => {
        storage.remove('cadastroDraft');
    });
}

// ========================================
// ANALYTICS E TRACKING (preparação)
// ========================================

function trackEvent(category, action, label = '', value = 0) {
    // Integração com Google Analytics ou similar
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Log para desenvolvimento
    console.log('Event tracked:', { category, action, label, value });
}

// Exemplos de tracking
document.addEventListener('DOMContentLoaded', () => {
    // Track page view
    trackEvent('Page', 'View', window.location.pathname);
    
    // Track link clicks
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Navigation', 'Click', link.href);
        });
    });
    
    // Track form submission
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', () => {
            trackEvent('Form', 'Submit', 'Cadastro Voluntário');
        });
    }
});

// ========================================
// VERIFICAÇÃO DE CONEXÃO
// ========================================

function checkConnection() {
    if (!navigator.onLine) {
        showToast('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'error');
    }
}

window.addEventListener('online', () => {
    showToast('Conexão restaurada!', 'success');
});

window.addEventListener('offline', () => {
    showToast('Você está offline.', 'error');
});

// Verifica conexão ao carregar
window.addEventListener('load', checkConnection);

// ========================================
// PRINT HELPER
// ========================================

function printPage() {
    window.print();
}

// Adiciona botão de imprimir se necessário
document.addEventListener('DOMContentLoaded', () => {
    const printButtons = document.querySelectorAll('[data-print]');
    printButtons.forEach(button => {
        button.addEventListener('click', printPage);
    });
});

// ========================================
// COPIAR PARA CLIPBOARD
// ========================================

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copiado para a área de transferência!', 'success');
        return true;
    } catch (err) {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar para a área de transferência', 'error');
        return false;
    }
}

// ========================================
// COMPARTILHAMENTO SOCIAL
// ========================================

function shareOnSocial(platform, url = window.location.href, text = '') {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        trackEvent('Social', 'Share', platform);
    }
}

// ========================================
// INICIALIZAÇÃO FINAL
// ========================================

console.log('%c🤝 ONG Mãos Solidárias', 'font-size: 20px; font-weight: bold; color: #2c5f8d;');
console.log('%cPlataforma carregada com sucesso!', 'font-size: 14px; color: #27ae60;');
console.log('%cTransformando vidas através da solidariedade', 'font-size: 12px; color: #7f8c8d; font-style: italic;');

// Log de ambiente
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('%c⚠️ Ambiente de Desenvolvimento', 'background: #f39c12; color: white; padding: 4px 8px; border-radius: 4px;');
}

// Expõe funções úteis no console para debugging (apenas em desenvolvimento)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugTools = {
        storage,
        showToast,
        copyToClipboard,
        validateCPF,
        formatDate,
        formatCurrency,
        trackEvent
    };
    console.log('%cFerramentas de debug disponíveis em window.debugTools', 'color: #2c5f8d;');
}