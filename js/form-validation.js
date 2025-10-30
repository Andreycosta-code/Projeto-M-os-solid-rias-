// ========================================
// FORM-VALIDATION.JS - Sistema de Validação de Formulários
// ========================================

const FormValidation = {
    // Configuração
    config: {
        showErrorsOnBlur: true,
        showErrorsOnSubmit: true,
        scrollToFirstError: true
    },

    // Regras de validação
    rules: {
        required: (value) => {
            return value.trim() !== '';
        },
        
        email: (value) => {
            return Utils.validateEmail(value);
        },
        
        cpf: (value) => {
            return Utils.validateCPF(value);
        },
        
        phone: (value) => {
            return Utils.validatePhone(value);
        },
        
        cep: (value) => {
            return Utils.validateCEP(value);
        },
        
        minLength: (value, min) => {
            return value.length >= parseInt(min);
        },
        
        maxLength: (value, max) => {
            return value.length <= parseInt(max);
        },
        
        minAge: (birthDate, minAge) => {
            const age = Utils.calculateAge(birthDate);
            return age >= parseInt(minAge);
        },
        
        maxAge: (birthDate, maxAge) => {
            const age = Utils.calculateAge(birthDate);
            return age <= parseInt(maxAge);
        },
        
        match: (value, matchValue) => {
            return value === matchValue;
        }
    },

    // Mensagens de erro padrão
    messages: {
        required: 'Este campo é obrigatório',
        email: 'Por favor, insira um e-mail válido',
        cpf: 'CPF inválido',
        phone: 'Telefone inválido. Use o formato (11) 98765-4321',
        cep: 'CEP inválido. Use o formato 12345-678',
        minLength: 'Mínimo de {min} caracteres',
        maxLength: 'Máximo de {max} caracteres',
        minAge: 'Idade mínima: {minAge} anos',
        maxAge: 'Idade máxima: {maxAge} anos',
        match: 'Os campos não coincidem'
    },

    // Validar campo individual
    validateField: (field) => {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}Error`);
        let isValid = true;
        let errorMessage = '';

        // Remover classe de erro anterior
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
        }

        // Validação de campo obrigatório
        if (field.hasAttribute('required') && !FormValidation.rules.required(value)) {
            isValid = false;
            errorMessage = FormValidation.messages.required;
        }
        
        // Validação de e-mail
        else if (field.type === 'email' && value && !FormValidation.rules.email(value)) {
            isValid = false;
            errorMessage = FormValidation.messages.email;
        }
        
        // Validação de CPF
        else if (field.id === 'cpf' && value && !FormValidation.rules.cpf(value)) {
            isValid = false;
            errorMessage = FormValidation.messages.cpf;
        }
        
        // Validação de telefone
        else if (field.id === 'telefone' && value && !FormValidation.rules.phone(value)) {
            isValid = false;
            errorMessage = FormValidation.messages.phone;
        }
        
        // Validação de CEP
        else if (field.id === 'cep' && value && !FormValidation.rules.cep(value)) {
            isValid = false;
            errorMessage = FormValidation.messages.cep;
        }
        
        // Validação de comprimento mínimo
        else if (field.hasAttribute('minlength') && value.length > 0) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (!FormValidation.rules.minLength(value, minLength)) {
                isValid = false;
                errorMessage = FormValidation.messages.minLength.replace('{min}', minLength);
            }
        }
        
        // Validação de comprimento máximo
        else if (field.hasAttribute('maxlength') && value.length > 0) {
            const maxLength = parseInt(field.getAttribute('maxlength'));
            if (!FormValidation.rules.maxLength(value, maxLength)) {
                isValid = false;
                errorMessage = FormValidation.messages.maxLength.replace('{max}', maxLength);
            }
        }
        
        // Validação de data de nascimento (idade)
        else if (field.type === 'date' && field.id === 'dataNascimento' && value) {
            const age = Utils.calculateAge(value);
            if (age < 14 || age > 100) {
                isValid = false;
                errorMessage = 'Idade deve estar entre 14 e 100 anos';
            }
        }
        
        // Validação de checkbox obrigatório
        else if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
            isValid = false;
            errorMessage = 'Você deve aceitar este termo';
        }

        // Aplicar erro visual se não for válido
        if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }

        return isValid;
    },

    // Validar formulário completo
    validateForm: (form) => {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!FormValidation.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    },

    // Verificação de consistência de dados
    checkDataConsistency: (formData) => {
        const warnings = [];

        // Verificar se nome parece válido
        if (formData.nomeCompleto) {
            const nameParts = formData.nomeCompleto.trim().split(' ');
            if (nameParts.length < 2) {
                warnings.push({
                    field: 'nomeCompleto',
                    message: 'Sugestão: Inclua nome e sobrenome completos'
                });
            }
        }

        // Verificar consistência de idade com área de interesse
        if (formData.dataNascimento && formData.areaInteresse) {
            const age = Utils.calculateAge(formData.dataNascimento);
            
            if (age < 18 && formData.areaInteresse === 'administrativo') {
                warnings.push({
                    field: 'areaInteresse',
                    message: 'Atenção: Área administrativa geralmente requer maioridade'
                });
            }
        }

        // Verificar se disponibilidade é compatível com área
        if (formData.disponibilidade === '2-4' && formData.areaInteresse === 'profissionalizacao') {
            warnings.push({
                field: 'disponibilidade',
                message: 'Sugestão: Área de profissionalização requer mais horas semanais'
            });
        }

        // Verificar se motivação tem tamanho adequado
        if (formData.motivacao && formData.motivacao.length < 50) {
            warnings.push({
                field: 'motivacao',
                message: 'Sugestão: Detalhe melhor suas motivações (mínimo 50 caracteres)'
            });
        }

        return warnings;
    },

    // Mostrar avisos de consistência
    showConsistencyWarnings: (warnings) => {
        if (warnings.length > 0) {
            let message = '<strong>Avisos de Preenchimento:</strong><ul style="margin: 10px 0; padding-left: 20px;">';
            warnings.forEach(warning => {
                message += `<li>${warning.message}</li>`;
            });
            message += '</ul><small>Você pode continuar, mas recomendamos revisar estes campos.</small>';
            
            Utils.showAlert(message, 'warning');
        }
    },

    // Inicializar validação em um formulário
    init: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        
        // Aplicar máscaras
        const cpfInput = form.querySelector('#cpf');
        const telefoneInput = form.querySelector('#telefone');
        const cepInput = form.querySelector('#cep');

        if (cpfInput) {
            cpfInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatCPF(e.target.value);
            });
        }

        if (telefoneInput) {
            telefoneInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatPhone(e.target.value);
            });
        }

        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                e.target.value = Utils.formatCEP(e.target.value);
            });

            // Buscar CEP automaticamente
            cepInput.addEventListener('blur', async () => {
                const cep = cepInput.value.replace(/\D/g, '');
                
                if (cep.length === 8) {
                    try {
                        // Verificar cache primeiro
                        let data = Storage.getCachedCEP(cep);
                        
                        if (!data) {
                            // Buscar da API
                            data = await Utils.fetchCEP(cep);
                            Storage.cacheCEP(cep, data);
                        }
                        
                        // Preencher campos
                        const enderecoInput = form.querySelector('#endereco');
                        const cidadeInput = form.querySelector('#cidade');
                        const estadoInput = form.querySelector('#estado');
                        
                        if (enderecoInput && data.logradouro) {
                            enderecoInput.value = data.logradouro;
                        }
                        if (cidadeInput) cidadeInput.value = data.localidade;
                        if (estadoInput) estadoInput.value = data.uf;
                        
                        Utils.showToast('CEP encontrado com sucesso!', 'success');
                    } catch (error) {
                        Utils.showToast(error.message, 'error');
                    }
                }
            });
        }

        // Validação em tempo real (blur)
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (FormValidation.config.showErrorsOnBlur) {
                    FormValidation.validateField(input);
                }
            });

            // Remover erro ao digitar
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

        // Validação ao submeter
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validar formulário
            const isValid = FormValidation.validateForm(form);
            
            if (isValid) {
                // Coletar dados
                const formData = new FormData(form);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                // Verificar consistência
                const warnings = FormValidation.checkDataConsistency(data);
                
                if (warnings.length > 0) {
                    FormValidation.showConsistencyWarnings(warnings);
                    
                    // Perguntar se deseja continuar
                    setTimeout(() => {
                        if (confirm('Foram detectados alguns avisos. Deseja revisar o formulário ou continuar mesmo assim?')) {
                            FormValidation.submitForm(form, data);
                        }
                    }, 500);
                } else {
                    FormValidation.submitForm(form, data);
                }
            } else {
                // Scroll para primeiro erro
                if (FormValidation.config.scrollToFirstError) {
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        Utils.smoothScrollTo(firstError);
                        firstError.focus();
                    }
                }
                
                Utils.showToast('Por favor, corrija os erros no formulário', 'error');
            }
        });

        // Auto-salvar rascunho
        const autoSave = Utils.debounce(() => {
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                // Não salvar checkboxes de termos
                if (key !== 'termos' && key !== 'privacidade') {
                    data[key] = value;
                }
            });
            
            if (Object.keys(data).length > 0) {
                Storage.saveDraft(formId, data);
                console.log('Rascunho salvo automaticamente');
            }
        }, 3000);

        inputs.forEach(input => {
            input.addEventListener('input', autoSave);
        });

        // Carregar rascunho se existir
        FormValidation.loadDraft(form, formId);
    },

    // Submeter formulário
    submitForm: (form, data) => {
        // Salvar voluntário
        Storage.saveVolunteer(data);
        
        // Remover rascunho
        Storage.removeDraft(form.id);
        
        // Mostrar mensagem de sucesso
        form.style.display = 'none';
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.style.display = 'block';
            Utils.smoothScrollTo(successMessage);
        }
        
        Utils.showToast('Cadastro realizado com sucesso!', 'success');
        
        console.log('Dados do formulário:', data);
    },

    // Carregar rascunho
    loadDraft: (form, formId) => {
        const draft = Storage.getDraft(formId);
        
        if (draft && Object.keys(draft.data).length > 0) {
            const load = confirm('Encontramos um rascunho salvo anteriormente. Deseja recuperá-lo?');
            
            if (load) {
                Object.keys(draft.data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = draft.data[key];
                    }
                });
                
                Utils.showToast('Rascunho recuperado com sucesso!', 'success');
            } else {
                Storage.removeDraft(formId);
            }
        }
    },

    // Limpar formulário
    resetForm: (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
            
            // Remover classes de erro
            const errors = form.querySelectorAll('.error');
            errors.forEach(el => el.classList.remove('error'));
            
            // Limpar mensagens de erro
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(el => el.textContent = '');
            
            // Remover rascunho
            Storage.removeDraft(formId);
            
            Utils.showToast('Formulário limpo', 'info');
        }
    }
};

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidation;
}