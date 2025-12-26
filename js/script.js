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
// VARIÁVEIS GLOBAIS
// Armazenam os dados da aplicação
// ========================================

// Array para armazenar os itens da compra atual
let currentItems = [];

// Array para armazenar o histórico de compras
let history = [];

// Variável para armazenar o usuário logado
let currentUser = null;

// ========================================
// VERIFICAÇÃO DE AUTENTICAÇÃO
// Redireciona para login se não estiver autenticado
// ========================================
async function checkAuth() {
    // Pega a sessão atual do usuário
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se não houver sessão, redireciona para login
    if (!session) {
        window.location.href = 'index.html';
        return;
    }
    
    // Armazena o usuário atual
    currentUser = session.user;
    
    // Atualiza o nome do usuário no cabeçalho
    const userName = currentUser.user_metadata?.full_name || currentUser.email.split('@')[0];
    document.getElementById('user-name').innerText = `👤 ${userName}`;
    
    // Carrega os dados do banco
    await loadUserData();
}

// ========================================
// FUNÇÃO DE LOGOUT
// Desloga o usuário e redireciona para login
// ========================================
async function handleLogout() {
    if (confirm('Deseja realmente sair?')) {
        // Desloga do Supabase
        await supabase.auth.signOut();
        
        // Redireciona para login
        window.location.href = 'index.html';
    }
}

// ========================================
// CARREGAR DADOS DO USUÁRIO
// Busca compra atual e histórico do banco de dados
// ========================================
async function loadUserData() {
    try {
        // Busca a compra atual do usuário
        const { data: currentShop, error: currentError } = await supabase
            .from('current_shopping')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        
        // Se encontrou uma compra em andamento
        if (currentShop && !currentError) {
            currentItems = currentShop.items || [];
            document.getElementById('total-budget').value = currentShop.budget || 0;
        }
        
        // Busca o histórico de compras do usuário
        const { data: historyData, error: historyError } = await supabase
            .from('shopping_history')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        // Se encontrou histórico
        if (historyData && !historyError) {
            history = historyData;
        }
        
        // Atualiza a interface
        updateBudget();
        renderItems();
        renderHistory();
        
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        showNotification('Erro ao carregar dados!', '#ef4444');
    }
}

// ========================================
// SALVAR COMPRA ATUAL NO BANCO
// Salva ou atualiza a compra em andamento
// ========================================
async function saveCurrentShop() {
    try {
        const budget = parseFloat(document.getElementById('total-budget').value) || 0;
        
        // Dados da compra atual
        const shopData = {
            user_id: currentUser.id,
            budget: budget,
            items: currentItems,
            updated_at: new Date().toISOString()
        };
        
        // Verifica se já existe uma compra em andamento
        const { data: existing } = await supabase
            .from('current_shopping')
            .select('id')
            .eq('user_id', currentUser.id)
            .single();
        
        if (existing) {
            // Atualiza a compra existente
            await supabase
                .from('current_shopping')
                .update(shopData)
                .eq('user_id', currentUser.id);
        } else {
            // Insere uma nova compra
            await supabase
                .from('current_shopping')
                .insert([shopData]);
        }
        
    } catch (error) {
        console.error('Erro ao salvar compra:', error);
        showNotification('Erro ao salvar!', '#ef4444');
    }
}

// ========================================
// FUNÇÃO EXECUTADA AO CARREGAR A PÁGINA
// ========================================
window.onload = async () => {
    // Define o ano atual no filtro
    document.getElementById('filter-year').value = new Date().getFullYear();
    
    // Verifica autenticação e carrega dados
    await checkAuth();
};

// ========================================
// FUNÇÃO PARA MOSTRAR NOTIFICAÇÕES
// Exibe mensagens temporárias no canto da tela
// ========================================
function showNotification(text, color) {
    // Seleciona o elemento de notificação pelo ID
    const note = document.getElementById('notification');
    
    // Define o texto da notificação
    note.innerText = text;
    
    // Define a cor de fundo (verde para sucesso, vermelho para erro, etc)
    note.style.backgroundColor = color;
    
    // Torna a notificação visível
    note.style.display = 'block';
    
    // Após 3 segundos (3000ms), esconde a notificação automaticamente
    setTimeout(() => note.style.display = 'none', 3000);
}

// ========================================
// FUNÇÃO PARA ATUALIZAR O ORÇAMENTO
// Calcula disponível, gasto e atualiza a interface
// ========================================
function updateBudget() {
    // Pega o valor do orçamento total do input
    const totalBudget = parseFloat(document.getElementById('total-budget').value) || 0;
    
    // Calcula o total gasto somando (preço x quantidade) de cada item
    const spent = currentItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
    
    // Calcula quanto ainda está disponível
    const remaining = totalBudget - spent;

    // Atualiza o texto do card "Disponível" com o valor restante
    document.getElementById('budget-display').innerText = `R$ ${remaining.toFixed(2)}`;
    
    // Atualiza o texto do card "Total da Compra" com o valor gasto
    document.getElementById('current-total-display').innerText = `R$ ${spent.toFixed(2)}`;
    
    // Mostra o botão "Finalizar" apenas se houver itens na lista
    document.getElementById('btn-finish').style.display = currentItems.length > 0 ? 'block' : 'none';
    
    // Retorna um objeto com os valores calculados
    return { spent, totalBudget, remaining };
}

// ========================================
// FUNÇÃO PARA ADICIONAR ITEM
// Adiciona um novo produto à lista de compras
// ========================================
async function addItem() {
    // Pega o valor do campo "nome do produto"
    const name = document.getElementById('prod-name').value;
    
    // Pega a quantidade e converte para número inteiro
    const qty = parseInt(document.getElementById('prod-qty').value);
    
    // Pega o preço e converte para número decimal
    const price = parseFloat(document.getElementById('prod-price').value);

    // Validação: se algum campo estiver vazio, mostra alerta e para a execução
    if(!name || !qty || !price) {
        return alert("Por favor, preencha todos os campos do produto.");
    }

    // Adiciona o novo item ao array currentItems
    currentItems.push({ 
        id: Date.now(),  // ID único do item
        name,            // Nome do produto
        qty,             // Quantidade
        price            // Preço unitário
    });
    
    // Salva no banco de dados
    await saveCurrentShop();
    
    // Atualiza a interface
    renderItems();
    updateBudget();
    
    // Mostra notificação de sucesso em verde
    showNotification("Produto adicionado!", "#16a34a");
    
    // Limpa os campos do formulário para nova entrada
    document.getElementById('prod-name').value = ''; 
    document.getElementById('prod-qty').value = ''; 
    document.getElementById('prod-price').value = '';
}

// ========================================
// FUNÇÃO PARA EDITAR ITEM
// Permite editar nome e preço de um produto
// ========================================
async function editItem(id) {
    // Encontra o item pelo ID
    const item = currentItems.find(i => i.id === id);
    
    // Abre um prompt perguntando novo nome
    const n = prompt("Novo nome:", item.name);
    
    // Abre um prompt perguntando novo preço
    const p = prompt("Novo preço:", item.price);
    
    // Se o usuário não cancelou
    if(n !== null && p !== null) {
        // Atualiza o nome do item
        item.name = n;
        
        // Atualiza o preço do item
        item.price = parseFloat(p);
        
        // Salva no banco
        await saveCurrentShop();
        
        // Atualiza a interface
        renderItems();
        updateBudget();
        
        // Mostra notificação de edição em laranja
        showNotification("Produto editado!", "#f59e0b");
    }
}

// ========================================
// FUNÇÃO PARA REMOVER ITEM
// Remove um produto da lista
// ========================================
async function removeItem(id) {
    // Filter cria um novo array excluindo o item com o ID especificado
    currentItems = currentItems.filter(i => i.id !== id);
    
    // Salva no banco
    await saveCurrentShop();
    
    // Atualiza a interface
    renderItems();
    updateBudget();
    
    // Mostra notificação de remoção em vermelho
    showNotification("Produto removido!", "#ef4444");
}

// ========================================
// FUNÇÃO PARA RENDERIZAR ITENS
// Mostra todos os produtos da compra atual na tela
// ========================================
function renderItems() {
    // Seleciona o container onde os itens serão exibidos
    const container = document.getElementById('list-container');
    
    // map percorre cada item e cria HTML para ele
    container.innerHTML = currentItems.map(item => `
        <div class="item">
            <div>
                <!-- Nome do produto em negrito -->
                <strong>${item.name}</strong><br>
                <!-- Quantidade x Preço unitário -->
                <small>${item.qty} un x R$ ${item.price.toFixed(2)}</small>
            </div>
            <div style="text-align: right">
                <!-- Valor total do item (quantidade × preço) -->
                <div style="font-weight:bold">R$ ${(item.qty * item.price).toFixed(2)}</div>
                <div class="actions">
                    <!-- Botão de editar -->
                    <button class="btn-edit" onclick="editItem(${item.id})">✎</button>
                    <!-- Botão de remover -->
                    <button class="btn-remove" onclick="removeItem(${item.id})">✕</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// FUNÇÃO PARA FINALIZAR COMPRA
// Salva a compra no histórico e limpa a lista atual
// ========================================
async function finalizePurchase() {
    // Pega os valores atualizados de gasto, orçamento e restante
    const stats = updateBudget();
    
    // Pede confirmação ao usuário antes de finalizar
    if(confirm(`Deseja finalizar a compra no valor de R$ ${stats.spent.toFixed(2)}?`)) {
        try {
            // Cria objeto Date com data/hora atual
            const now = new Date();
            
            // Cria o registro da compra para o histórico
            const record = {
                user_id: currentUser.id,
                items: currentItems,
                total_spent: stats.spent,
                remaining: stats.remaining,
                budget: stats.totalBudget,
                created_at: now.toISOString()
            };

            // Insere no histórico
            await supabase
                .from('shopping_history')
                .insert([record]);
            
            // Remove a compra atual do banco
            await supabase
                .from('current_shopping')
                .delete()
                .eq('user_id', currentUser.id);
            
            // Limpa a lista de itens atuais
            currentItems = [];
            
            // Atualiza a interface
            renderItems();
            updateBudget();
            
            // Recarrega o histórico
            await loadUserData();
            
            // Mostra mensagem de sucesso
            showNotification("Compra finalizada com sucesso!", "#16a34a");
            
        } catch (error) {
            console.error('Erro ao finalizar compra:', error);
            showNotification("Erro ao finalizar compra!", "#ef4444");
        }
    }
}

// ========================================
// FUNÇÃO PARA RENDERIZAR HISTÓRICO
// Mostra as compras anteriores com filtros aplicados
// ========================================
function renderHistory() {
    // Seleciona o container do histórico
    const container = document.getElementById('history-container');
    
    // Pega o valor do filtro de mês
    const filterMonth = document.getElementById('filter-month').value;
    
    // Pega o valor do filtro de ano
    const filterYear = document.getElementById('filter-year').value;
    
    // Variável para acumular o total gasto no período
    let totalPeriodo = 0;
    
    // Limpa o container antes de renderizar
    container.innerHTML = '';

    // Filtra o histórico baseado nos filtros selecionados
    const filtered = history.filter(p => {
        // Cria objeto Date a partir da string ISO
        const d = new Date(p.created_at);
        
        // Retorna true se passar nos filtros
        return (filterMonth === "" || d.getMonth() == filterMonth) && 
               (filterYear === "" || d.getFullYear() == filterYear);
    });

    // Se não houver compras no período filtrado
    if(filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray">Nenhuma compra registrada.</p>';
        document.getElementById('total-month-display').style.display = 'none';
        return;
    }

    // Para cada compra filtrada
    filtered.forEach(p => {
        // Acumula o valor gasto
        totalPeriodo += p.total_spent;
        
        // Formata a data para exibição
        const date = new Date(p.created_at);
        const displayDate = date.toLocaleDateString('pt-BR') + ' às ' + 
                           date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        
        // Adiciona o HTML da compra ao container
        container.innerHTML += `
            <div class="history-item">
                <!-- Data e hora da compra -->
                <div class="history-date">📅 ${displayDate}</div>
                
                <div style="display:flex; justify-content: space-between">
                    <!-- Valor total gasto -->
                    <strong>Gasto: R$ ${p.total_spent.toFixed(2)}</strong>
                    
                    <!-- Valor que sobrou -->
                    <small style="color: var(--success)">Sobrou: R$ ${p.remaining.toFixed(2)}</small>
                </div>
                
                <!-- Lista resumida dos itens -->
                <div style="font-size: 0.8rem; color: #666; margin-top: 5px; font-style: italic">
                    ${p.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                </div>
            </div>
        `;
    });

    // Se houver filtro ativo
    if(filterMonth !== "" || filterYear !== "") {
        // Mostra o box com total do período
        document.getElementById('total-month-display').style.display = 'block';
        document.getElementById('month-value').innerText = totalPeriodo.toFixed(2);
    } else {
        // Sem filtro ativo, esconde o box de total
        document.getElementById('total-month-display').style.display = 'none';
    }
}

// ========================================
// EVENT LISTENER
// Detecta quando o usuário digita no campo de orçamento
// ========================================
document.getElementById('total-budget').addEventListener('input', async () => {
    updateBudget();
    await saveCurrentShop();
});