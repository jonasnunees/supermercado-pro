// ========================================
// CONFIGURAÇÃO DO SUPABASE
// Substitua pelas suas credenciais reais
// ========================================

// URL do seu projeto Supabase
const SUPABASE_URL = 'https://vkgqxwcxnzuqjsgfzuau.supabase.co'; // Ex: https://xxxx.supabase.co

// Chave pública (anon key) do Supabase
const SUPABASE_KEY = 'sb_publishable_Ut2QQn4tPMYuAF-E3GNLMw_wOIoJKBE';

// Cria a instância do cliente Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ========================================
// FUNÇÃO PARA ALTERNAR ENTRE LOGIN E CADASTRO
// ========================================
function toggleForms() {
    // Seleciona os dois formulários
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Se o login está visível, mostra o cadastro e vice-versa
    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    }
}

// ========================================
// FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES
// ========================================
function showNotification(text, color) {
    // Seleciona o elemento de notificação
    const note = document.getElementById('notification');
    
    // Define o texto e cor
    note.innerText = text;
    note.style.backgroundColor = color;
    note.style.display = 'block';
    
    // Esconde após 3 segundos
    setTimeout(() => note.style.display = 'none', 3000);
}

// ========================================
// FUNÇÃO PARA MOSTRAR/ESCONDER LOADING
// ========================================
function showLoading(show) {
    // Seleciona todos os elementos
    const loading = document.getElementById('loading');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (show) {
        // Mostra loading e esconde formulários
        loading.style.display = 'block';
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
    } else {
        // Esconde loading e mostra o formulário de login
        loading.style.display = 'none';
        loginForm.style.display = 'block';
    }
}

// ========================================
// FUNÇÃO PARA FAZER LOGIN
// ========================================
async function handleLogin() {
    // Pega os valores dos campos
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    // Validação básica
    if (!email || !password) {
        showNotification('Preencha todos os campos!', '#ef4444');
        return;
    }
    
    // Mostra loading
    showLoading(true);
    
    try {
        // Tenta fazer login no Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        // Se houver erro, exibe mensagem
        if (error) throw error;
        
        // Login bem-sucedido
        showNotification('Login realizado com sucesso!', '#16a34a');
        
        // Aguarda 1 segundo e redireciona para a página principal
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
        
    } catch (error) {
        // Exibe erro
        console.error('Erro no login:', error);
        showNotification('Email ou senha incorretos!', '#ef4444');
        showLoading(false);
    }
}

// ========================================
// FUNÇÃO PARA FAZER CADASTRO
// ========================================
async function handleSignup() {
    // Pega os valores dos campos
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    // Validações
    if (!name || !email || !password || !confirm) {
        showNotification('Preencha todos os campos!', '#ef4444');
        return;
    }
    
    if (password.length < 6) {
        showNotification('A senha deve ter no mínimo 6 caracteres!', '#ef4444');
        return;
    }
    
    if (password !== confirm) {
        showNotification('As senhas não coincidem!', '#ef4444');
        return;
    }
    
    // Mostra loading
    showLoading(true);
    
    try {
        // Cria a conta no Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        // Se houver erro, exibe mensagem
        if (error) throw error;
        
        // Cadastro bem-sucedido
        showNotification('Conta criada com sucesso! Faça login.', '#16a34a');
        
        // Aguarda 2 segundos e volta para o login
        setTimeout(() => {
            showLoading(false);
            toggleForms();
            
            // Limpa os campos
            document.getElementById('signup-name').value = '';
            document.getElementById('signup-email').value = '';
            document.getElementById('signup-password').value = '';
            document.getElementById('signup-confirm').value = '';
        }, 2000);
        
    } catch (error) {
        // Exibe erro
        console.error('Erro no cadastro:', error);
        showNotification(error.message || 'Erro ao criar conta!', '#ef4444');
        showLoading(false);
    }
}

// ========================================
// PERMITE LOGIN COM ENTER
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // No formulário de login
    const loginInputs = document.querySelectorAll('#login-form input');
    loginInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
    });
    
    // No formulário de cadastro
    const signupInputs = document.querySelectorAll('#signup-form input');
    signupInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSignup();
        });
    });
});