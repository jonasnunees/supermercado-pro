// ========================================
// VARIÁVEIS GLOBAIS
// Armazenam os dados da aplicação
// ========================================

// Carrega a lista de itens da compra atual do localStorage
// Se não existir nada salvo, cria um array vazio []
let currentItems = JSON.parse(localStorage.getItem('shopping_list')) || [];

// Carrega o histórico de compras anteriores do localStorage
// Se não existir nada salvo, cria um array vazio []
let history = JSON.parse(localStorage.getItem('shopping_history')) || [];

// ========================================
// FUNÇÃO EXECUTADA AO CARREGAR A PÁGINA
// window.onload é acionada quando a página termina de carregar
// ========================================
window.onload = () => {
    // Recupera o orçamento salvo anteriormente
    const savedBudget = localStorage.getItem('total_budget');
    
    // Se existe orçamento salvo, preenche o campo de input
    if(savedBudget) {
        document.getElementById('total-budget').value = savedBudget;
    }
    
    // Define o ano atual no filtro de ano
    document.getElementById('filter-year').value = new Date().getFullYear();
    
    // Atualiza os valores do painel (disponível/gasto)
    updateBudget();
    
    // Renderiza os itens da compra atual na tela
    renderItems();
    
    // Renderiza o histórico de compras anteriores
    renderHistory();
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
    // parseFloat converte texto em número decimal
    // || 0 significa: se não houver valor, use 0
    const totalBudget = parseFloat(document.getElementById('total-budget').value) || 0;
    
    // Calcula o total gasto somando (preço x quantidade) de cada item
    // reduce é uma função que acumula valores
    // acc = acumulador, i = item atual
    const spent = currentItems.reduce((acc, i) => acc + (i.price * i.qty), 0);
    
    // Calcula quanto ainda está disponível
    const remaining = totalBudget - spent;

    // Atualiza o texto do card "Disponível" com o valor restante
    document.getElementById('budget-display').innerText = `R$ ${remaining.toFixed(2)}`;
    
    // Atualiza o texto do card "Total da Compra" com o valor gasto
    document.getElementById('current-total-display').innerText = `R$ ${spent.toFixed(2)}`;
    
    // Salva o orçamento total no localStorage para não perder ao recarregar
    localStorage.setItem('total_budget', totalBudget);
    
    // Mostra o botão "Finalizar" apenas se houver itens na lista
    // Usa operador ternário: condição ? verdadeiro : falso
    document.getElementById('btn-finish').style.display = currentItems.length > 0 ? 'block' : 'none';
    
    // Retorna um objeto com os valores calculados
    // Útil para outras funções usarem esses dados
    return { spent, totalBudget, remaining };
}

// ========================================
// FUNÇÃO PARA ADICIONAR ITEM
// Adiciona um novo produto à lista de compras
// ========================================
function addItem() {
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
    // Date.now() gera um ID único baseado no timestamp atual
    currentItems.push({ 
        id: Date.now(),  // ID único do item
        name,            // Nome do produto
        qty,             // Quantidade
        price            // Preço unitário
    });
    
    // Salva a lista atualizada no localStorage
    saveCurrent();
    
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
function editItem(id) {
    // Encontra o item pelo ID
    // find retorna o primeiro elemento que satisfaz a condição
    const item = currentItems.find(i => i.id === id);
    
    // Abre um prompt perguntando novo nome (mostra o atual como sugestão)
    const n = prompt("Novo nome:", item.name);
    
    // Abre um prompt perguntando novo preço (mostra o atual como sugestão)
    const p = prompt("Novo preço:", item.price);
    
    // Se o usuário não cancelou (clicou OK nos dois prompts)
    if(n !== null && p !== null) {
        // Atualiza o nome do item
        item.name = n;
        
        // Atualiza o preço do item (convertendo para número)
        item.price = parseFloat(p);
        
        // Salva as alterações
        saveCurrent();
        
        // Mostra notificação de edição em laranja
        showNotification("Produto editado!", "#f59e0b");
    }
}

// ========================================
// FUNÇÃO PARA REMOVER ITEM
// Remove um produto da lista
// ========================================
function removeItem(id) {
    // Filter cria um novo array excluindo o item com o ID especificado
    // Mantém todos os itens EXCETO o que tem o ID igual ao parâmetro
    currentItems = currentItems.filter(i => i.id !== id);
    
    // Salva a lista atualizada
    saveCurrent();
    
    // Mostra notificação de remoção em vermelho
    showNotification("Produto removido!", "#ef4444");
}

// ========================================
// FUNÇÃO PARA SALVAR LISTA ATUAL
// Salva no localStorage e atualiza a tela
// ========================================
function saveCurrent() {
    // Converte o array currentItems em texto JSON e salva no localStorage
    localStorage.setItem('shopping_list', JSON.stringify(currentItems));
    
    // Atualiza a visualização dos itens na tela
    renderItems();
    
    // Atualiza os valores do orçamento
    updateBudget();
}

// ========================================
// FUNÇÃO PARA RENDERIZAR ITENS
// Mostra todos os produtos da compra atual na tela
// ========================================
function renderItems() {
    // Seleciona o container onde os itens serão exibidos
    const container = document.getElementById('list-container');
    
    // map percorre cada item e cria HTML para ele
    // join('') junta todos os HTMLs em uma única string
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
                    <!-- Botão de editar (chama editItem passando o ID) -->
                    <button class="btn-edit" onclick="editItem(${item.id})">✎</button>
                    <!-- Botão de remover (chama removeItem passando o ID) -->
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
function finalizePurchase() {
    // Pega os valores atualizados de gasto, orçamento e restante
    const stats = updateBudget();
    
    // Pede confirmação ao usuário antes de finalizar
    if(confirm(`Deseja finalizar a compra no valor de R$ ${stats.spent.toFixed(2)}?`)) {
        // Cria objeto Date com data/hora atual
        const now = new Date();
        
        // Cria o registro da compra
        const record = {
            id: Date.now(),  // ID único baseado em timestamp
            
            // Data no formato ISO (para ordenação e filtros)
            date: now.toISOString(),
            
            // Data formatada para exibição (DD/MM/AAAA às HH:MM)
            displayDate: now.toLocaleDateString('pt-BR') + ' às ' + 
                        now.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}),
            
            // Copia todos os itens da compra (usa spread operator [...])
            items: [...currentItems],
            
            // Total gasto
            totalSpent: stats.spent,
            
            // Valor restante
            remaining: stats.remaining
        };

        // Adiciona o registro no INÍCIO do histórico (unshift)
        // Assim as compras mais recentes aparecem primeiro
        history.unshift(record);
        
        // Salva o histórico atualizado no localStorage
        localStorage.setItem('shopping_history', JSON.stringify(history));
        
        // Limpa a lista de itens atuais
        currentItems = [];
        
        // Remove a lista de compras do localStorage
        localStorage.removeItem('shopping_list');
        
        // Salva o estado atual (vazio)
        saveCurrent();
        
        // Atualiza a visualização do histórico
        renderHistory();
        
        // Mostra mensagem de sucesso
        alert("Compra finalizada e salva no histórico!");
    }
}

// ========================================
// FUNÇÃO PARA RENDERIZAR HISTÓRICO
// Mostra as compras anteriores com filtros aplicados
// ========================================
function renderHistory() {
    // Seleciona o container do histórico
    const container = document.getElementById('history-container');
    
    // Pega o valor do filtro de mês (vazio = todos os meses)
    const filterMonth = document.getElementById('filter-month').value;
    
    // Pega o valor do filtro de ano
    const filterYear = document.getElementById('filter-year').value;
    
    // Variável para acumular o total gasto no período
    let totalPeriodo = 0;
    
    // Limpa o container antes de renderizar
    container.innerHTML = '';

    // Filtra o histórico baseado nos filtros selecionados
    const filtered = history.filter(p => {
        // Cria objeto Date a partir da string ISO salva
        const d = new Date(p.date);
        
        // Retorna true se passar nos filtros (ou se filtro estiver vazio)
        return (filterMonth === "" || d.getMonth() == filterMonth) && 
               (filterYear === "" || d.getFullYear() == filterYear);
    });

    // Se não houver compras no período filtrado
    if(filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:gray">Nenhuma compra registrada.</p>';
        
        // Esconde o box de total do período
        document.getElementById('total-month-display').style.display = 'none';
        
        // Para a execução aqui
        return;
    }

    // Para cada compra filtrada
    filtered.forEach(p => {
        // Acumula o valor gasto
        totalPeriodo += p.totalSpent;
        
        // Adiciona o HTML da compra ao container
        container.innerHTML += `
            <div class="history-item">
                <!-- Data e hora da compra -->
                <div class="history-date">📅 ${p.displayDate}</div>
                
                <div style="display:flex; justify-content: space-between">
                    <!-- Valor total gasto -->
                    <strong>Gasto: R$ ${p.totalSpent.toFixed(2)}</strong>
                    
                    <!-- Valor que sobrou -->
                    <small style="color: var(--success)">Sobrou: R$ ${p.remaining.toFixed(2)}</small>
                </div>
                
                <!-- Lista resumida dos itens (quantidade x nome) -->
                <div style="font-size: 0.8rem; color: #666; margin-top: 5px; font-style: italic">
                    ${p.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                </div>
            </div>
        `;
    });

    // Se houver filtro ativo (mês OU ano preenchido)
    if(filterMonth !== "" || filterYear !== "") {
        // Mostra o box com total do período
        document.getElementById('total-month-display').style.display = 'block';
        
        // Atualiza o valor total
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
// Sempre que o valor do input de orçamento mudar, chama updateBudget()
document.getElementById('total-budget').addEventListener('input', updateBudget);