# 🛒 Supermercado Pro - Controle Total

Um sistema completo e intuitivo para gerenciar suas compras de supermercado, controlar orçamento e acompanhar seus gastos ao longo do tempo.

![License](https://img.shields.io/badge/license-GPL%20v3.0-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 📋 Sobre o Projeto

O **Supermercado Pro** é uma aplicação web desenvolvida para ajudar pessoas a controlarem melhor seus gastos no supermercado. Com ele, você pode:

- ✅ Definir um orçamento antes de começar as compras
- ✅ Adicionar produtos com quantidade e preço
- ✅ Ver em tempo real quanto ainda está disponível
- ✅ Editar ou remover itens facilmente
- ✅ Salvar compras finalizadas no histórico
- ✅ Filtrar compras por mês e ano
- ✅ Visualizar o total gasto em períodos específicos

## 🎯 Funcionalidades

### 🔐 Sistema de Autenticação
- Cadastro de usuários com email e senha
- Login seguro com Supabase
- Cada usuário tem seus próprios dados isolados
- Logout seguro

### 💰 Controle de Orçamento
- Define quanto você pode gastar
- Mostra o valor disponível em tempo real
- Exibe o total da compra atual
- Salva orçamento automaticamente

### 📝 Gestão de Produtos
- Adiciona produtos com nome, quantidade e preço
- Calcula automaticamente o subtotal de cada item
- Edita produtos já adicionados
- Remove itens indesejados
- Sincroniza automaticamente com o banco de dados

### 📊 Histórico Completo
- Salva todas as compras finalizadas na nuvem
- Filtra por mês e ano
- Mostra data e hora de cada compra
- Exibe quanto foi gasto e quanto sobrou
- Lista resumida dos produtos de cada compra
- Acesse de qualquer dispositivo

### ☁️ Armazenamento em Nuvem
- Todos os dados salvos no Supabase (PostgreSQL)
- Sincronização automática entre dispositivos
- Backup automático dos dados
- Acesso de qualquer lugar

## 🚀 Como Usar

### Instalação e Configuração

#### Requisitos
- Conta no [Supabase](https://supabase.com) (gratuita)

#### Passo a Passo

**1. Clone o repositório:**
```bash
git clone https://github.com/jonasnunees/supermercado-pro.git
cd supermercado-pro
```

**2. Configure o Supabase:**
- Siga o guia completo no arquivo [SETUP.md](SETUP.md)
- Crie o projeto no Supabase
- Execute o script SQL para criar as tabelas
- Copie suas credenciais (URL e chave pública)

**3. Configure as credenciais:**
- Edite `auth.js` e `script.js`
- Substitua `SUPABASE_URL` e `SUPABASE_KEY` pelas suas credenciais

**4. Teste localmente:**
- Abra o arquivo `login.html` no navegador
- Ou use um servidor local (ex: Live Server do VS Code)

### Uso Básico

1. **Cadastre-se** na tela de login com email e senha
2. **Faça login** para acessar sua conta
3. **Defina seu orçamento** no campo "Defina seu Orçamento"
4. **Adicione produtos** preenchendo:
   - Nome do produto
   - Quantidade
   - Preço unitário
5. **Acompanhe** o valor disponível e o total da compra em tempo real
6. **Edite ou remova** produtos conforme necessário
7. **Finalize a compra** clicando em "Finalizar e Salvar"
8. **Consulte o histórico** e filtre por período
9. **Faça logout** quando terminar

## 📁 Estrutura do Projeto

```
supermercado-pro/
│
├── login.html          # Tela de login e cadastro
├── index.html          # Aplicação principal
├── styles.css          # Estilização completa
├── auth.js             # Sistema de autenticação
├── script.js           # Lógica da aplicação
├── database.sql        # Schema do banco de dados
├── SETUP.md            # Guia de configuração completo
├── README.md           # Este arquivo
├── .gitignore          # Arquivos ignorados pelo Git
├── config.example.js   # Exemplo de configuração
└── LICENSE             # Licença GPL v3.0
```

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica da página
- **CSS3**: Estilização moderna com variáveis CSS, Flexbox e Grid
- **JavaScript (Vanilla)**: Lógica da aplicação sem frameworks
- **Supabase**: 
  - Autenticação de usuários
  - Banco de dados PostgreSQL
  - API REST automática
  - Row Level Security (RLS)

## 💻 Compatibilidade

O projeto funciona em todos os navegadores modernos:

- ✅ Google Chrome (recomendado)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Opera
- ✅ Navegadores mobile (iOS e Android)

**Requisitos:**
- Conexão com internet (para sincronizar dados)
- JavaScript habilitado
- Cookies habilitados (para autenticação)

## 🎨 Recursos Técnicos

### Frontend
- Variáveis CSS para fácil personalização de cores
- Layout responsivo com Flexbox e Grid
- Bordas arredondadas e sombras suaves
- Transições animadas
- Sistema de notificações (toasts)

### Backend (Supabase)
- Autenticação JWT segura
- Banco de dados PostgreSQL
- Row Level Security (RLS) - cada usuário vê apenas seus dados
- Políticas de segurança automatizadas
- Triggers para atualização automática de timestamps
- Índices otimizados para performance

### JavaScript
- Funções organizadas e reutilizáveis
- Async/Await para operações assíncronas
- Manipulação eficiente do DOM
- Validação de dados do usuário
- Tratamento de erros robusto

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🐛 Reportando Bugs

Encontrou um bug? Abra uma [issue](https://github.com/jonasnunees/supermercado-pro/issues) descrevendo:

- O que aconteceu
- O que deveria acontecer
- Passos para reproduzir o problema
- Navegador e versão utilizada

## 📝 Roadmap

Futuras melhorias planejadas:

- [ ] Exportar histórico para PDF
- [ ] Modo escuro (dark mode)
- [ ] Gráficos de gastos mensais
- [ ] Categorias de produtos
- [ ] Lista de compras recorrentes
- [ ] Comparação de preços entre compras
- [ ] PWA (funcionar offline como app)
- [ ] Notificações push
- [ ] Compartilhar lista com família
- [ ] Importar lista de texto/foto
- [ ] Integração com APIs de supermercados

## 📄 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

### O que isso significa?

✅ Você pode:
- Usar comercialmente
- Modificar o código
- Distribuir
- Usar para fins privados

⚠️ Condições:
- Deve divulgar o código fonte
- Manter a mesma licença
- Documentar mudanças
- Incluir aviso de copyright

## 👨‍💻 Autor

Desenvolvido com ❤️ para ajudar pessoas a controlarem melhor seus gastos.

---

## 🌟 Apoie o Projeto

Se este projeto foi útil para você, considere:

- ⭐ Dar uma estrela no GitHub
- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- 🔀 Contribuir com código
- 📢 Compartilhar com amigos

---

**Boas compras e economia controlada! 💰🛒**
