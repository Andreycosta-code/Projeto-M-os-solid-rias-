# Projeto-Maos-solidarias-
# ONG Mãos Solidárias - Plataforma Web

Plataforma web completa e profissional para gestão de ONGs, incluindo gerenciamento de atividades, divulgação de projetos, captação de recursos e engajamento de voluntários.

##  Sobre o Projeto

Este projeto foi desenvolvido seguindo todos os requisitos das diretrizes fornecidas, aplicando conceitos de HTML5 semântico, CSS3 avançado, JavaScript interativo e boas práticas de desenvolvimento web.

##  Funcionalidades Principais

###  Página Inicial (index.html)
- Informações institucionais da ONG
- Missão, visão e valores
- História e conquistas organizacionais
- Apresentação da equipe (Nomes e informações apresentadas são fictcias)
- Relatórios de transparência
- Informações de contato completas

###  Projetos Sociais (projetos.html)
- Catálogo detalhado de projetos
- Indicadores de impacto e resultados
- Galerias de fotos e vídeos (Placeholders temporários)
- Informações sobre voluntariado
- Sistema de doações
- Categorização de projetos

###  Cadastro (cadastro.html)
- Formulário completo de cadastro de voluntários
- Validação nativa HTML5
- Validação JavaScript avançada
- Máscaras para CPF, telefone e CEP
- Busca automática de endereço via CEP (API ViaCEP)
- Sistema de salvamento automático de rascunho
- Feedback em tempo real

##  Requisitos Técnicos Atendidos

###  HTML5 Semântico
- Estrutura semântica completa (header, nav, main, section, article, footer)
- Hierarquia de títulos lógica e consistente
- Uso adequado de tags como `<address>`, `<details>`, `<fieldset>`, `<legend>`
- Mínimo de 3 páginas HTML implementadas
- Imagens com atributos `alt` descritivos

###  Formulários Complexos
- Tipos de input HTML5: text, email, tel, date, checkbox, select, textarea
- Validação nativa com atributos `required`, `minlength`, `maxlength`, `pattern`
- Agrupamento lógico com `<fieldset>` e `<legend>`
- Máscaras aplicadas para CPF (000.000.000-00), telefone ((00) 00000-0000) e CEP (00000-000)

###  CSS3 Responsivo
- Design mobile-first
- Breakpoints bem definidos (768px para tablet, 480px para mobile)
- Imagens e mídias adaptáveis
- Menu responsivo funcional
- Grid e Flexbox para layouts

###  JavaScript Interativo
- Menu mobile funcional
- Validação de formulário completa
- Máscaras de input dinâmicas
- Integração com API ViaCEP
- Animações ao scroll
- Sistema de notificações (toasts)
- Salvamento automático de rascunho

###  Desempenho
- Lazy loading de imagens
- CSS e JavaScript minificáveis
- Otimização de recursos
- Tempo de carregamento otimizado

###  Acessibilidade (WCAG 2.1 AA)
- Navegação por teclado
- Labels associados a inputs
- Contraste adequado de cores
- Atributos ARIA
- Skip to content link
- Suporte a leitores de tela
- Foco visível em elementos interativos

###  SEO e Descoberta
- Meta tags otimizadas
- Estrutura semântica adequada
- URLs amigáveis
- Títulos descritivos
- Descrições nas páginas

##  Estrutura de Arquivos

```
Projeto-M-os-solid-rias-/
├── README.md     #Documentação do preojeto
├── index.html    #Página inicial
├── projetos.html #Pagina de projetos sociais
├── cadastro.html #Página de cadastro
├── styles.css    #Arquivo CSS principal
├── script.js     #Arquivo JavaScript principal

##  Como Executar

1. **Clone ou baixe o projeto**
   ```bash
   git clone [url-do-repositorio]
   ```

2. **Organize os arquivos**
   - Coloque todos os arquivos HTML, CSS e JS na raiz do projeto
   - Crie a pasta `images/` e adicione as imagens necessárias
   - Crie a pasta `videos/` e adicione os vídeos necessários

3. **Abra no navegador**
   - Abra o arquivo `index.html` em qualquer navegador moderno
   - Ou utilize um servidor local (recomendado):
     ```bash
     # Usando Python 3
     python -m http.server 8000
     
     # Usando Node.js (http-server)
     npx http-server
     ```

4. **Teste a responsividade**
   - Use as ferramentas de desenvolvedor do navegador (F12)
   - Teste em diferentes tamanhos de tela

##  Responsividade

O projeto é totalmente responsivo e se adapta a:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: até 767px

##  Checklist de Entrega

- [x] Código fonte completo
- [x] Estrutura de pastas organizada
- [x] Arquivos HTML validados (W3C Validator)
- [x] 3 páginas HTML com estrutura semântica
- [x] Formulário complexo com validação
- [x] CSS responsivo com design mobile-first
- [x] JavaScript com funcionalidades interativas
- [x] Máscaras de input implementadas
- [x] Integração com API externa (ViaCEP)
- [x] Acessibilidade WCAG 2.1 AA
- [x] Imagens otimizadas
- [x] Documentação completa

##  Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e formulários
- **CSS3**: Estilização, Grid, Flexbox, animações
- **JavaScript ES6+**: Interatividade e validações
- **API ViaCEP**: Busca de endereços por CEP

##  Navegadores Suportados

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Opera 76+

##  Notas Importantes

1. **Imagens**: Este projeto utiliza placeholders do [Picsum Photos](https://picsum.photos/) para fins de demonstração e testes de responsividade. Em um ambiente de produção real, estas imagens seriam substituídas por fotografias oficiais da organização.
2. **Dados**: Os dados do formulário são apenas simulados. Em produção, conecte a um backend
**Nota:** Nenhum arquivo de imagem está incluído no repositório, as imagens são carregadas via CDN público.

O sistema foi desenvolvido considerando 4 tipos de usuários:

1. **Administrador da ONG**: Gerencia informações institucionais
2. **Voluntário**: Descobre oportunidades e se cadastra
3. **Doador/Apoiador**: Conhece projetos e faz doações
4. **Visitante**: Conhece a organização e seus projetos

##  Objetivos de Aprendizagem Alcançados

- ✅ Aplicação de HTML5 semântico em estruturas complexas
- ✅ Implementação de layouts responsivos com CSS3
- ✅ Desenvolvimento de funcionalidades interativas com JavaScript
- ✅ Integração de ferramentas de versionamento e acessibilidade
- ✅ Simulação de ambiente de desenvolvimento profissional
- ✅ Produção de documentação técnica 


Este projeto foi desenvolvido para fins educacionais.
---
