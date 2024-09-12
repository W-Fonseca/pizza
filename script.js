document.addEventListener('DOMContentLoaded', () => {
    fetch('https://raw.githubusercontent.com/W-Fonseca/pizza/main/data.json')
        .then(response => response.json())
        .then(data => {
            populateMenu(data.menu);
            populateBebidas(data.bebidas);
            populatePromocoes(data.promocao);
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    setupNavigation();
});

function setupNavigation() {
    const navLinks = document.querySelectorAll('.bottom-nav a');
    const sections = document.querySelectorAll('main section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1); // Remove o '#'
            showSection(targetId);
            updateActiveNavLink(this);
        });
    });

    function showSection(id) {
        sections.forEach(section => {
            section.classList.add('hidden');
            if (section.id === id) {
                section.classList.remove('hidden');
            }
        });
    }

    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
}

function populateMenu(menu) {
    const container = document.getElementById('pizza-container');
    container.innerHTML = '';

    Object.values(menu).forEach(item => {
        const pizzaElement = document.createElement('div');
        pizzaElement.classList.add('pizza-item');
        pizzaElement.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="pizza-details">
                <h3>${item.nome}</h3>
                <p>${item.conteudo}</p>
                <p><strong>${item.valor}</strong></p>
                <button class="add-to-cart" data-name="${item.nome}" data-price="${item.valor.replace('R$ ', '').replace(',', '.')}" data-type="pizza">Adicionar</button>
            </div>
        `;
        container.appendChild(pizzaElement);
    });

    // Re-attach event listeners after populating
    attachCartButtons();
}

function populateBebidas(bebidas) {
    const container = document.getElementById('drink-container');
    container.innerHTML = '';

    Object.values(bebidas).forEach(item => {
        const drinkElement = document.createElement('div');
        drinkElement.classList.add('drink-item');
        drinkElement.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="drink-details">
                <h3>${item.nome}</h3>
                <p><strong>${item.valor}</strong></p>
                <button class="add-to-cart" data-name="${item.nome}" data-price="${item.valor.replace('R$ ', '').replace(',', '.')}" data-type="drink">Adicionar</button>
            </div>
        `;
        container.appendChild(drinkElement);
    });

    // Re-attach event listeners after populating
    attachCartButtons();
}

function populatePromocoes(promocoes) {
    const container = document.getElementById('promotion-container');
    container.innerHTML = '';

    Object.values(promocoes).forEach(item => {
        const promotionElement = document.createElement('div');
        promotionElement.classList.add('pizza-item');
        promotionElement.innerHTML = `
            <img src="${item.img}" alt="${item.nome}">
            <div class="pizza-details">
                <h3>${item.nome}</h3>
                <p>${item.conteudo}</p>
                <p><strong>${item.valor}</strong> <span class="old-price">${item.valorAntigo}</span></p>
                <button class="add-to-cart" data-name="${item.nome}" data-price="${item.valor.replace('R$ ', '').replace(',', '.')}" data-type="promotion">Adicionar</button>
            </div>
        `;
        container.appendChild(promotionElement);
    });

    // Re-attach event listeners after populating
    attachCartButtons();
}

// Função para atualizar o carrinho e exibir o popup
const cart = [];
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');
const cartSummary = document.getElementById('cart-summary');

function attachCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.removeEventListener('click', addToCartHandler); // Remover listener antigo
        button.addEventListener('click', addToCartHandler);
    });
}

function addToCartHandler() {
    const name = this.getAttribute('data-name');
    const price = parseFloat(this.getAttribute('data-price'));

    // Adiciona ao carrinho
    cart.push({ name, price });
    updateCart();

    // Exibe o popup de notificação
    showNotification();
}

function updateCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Carrinho vazio</p>';
        totalPriceElement.innerText = '0.00';  // Zera o total
        cartSummary.classList.add('hidden');  // Esconde o resumo do carrinho
    } else {
        cartSummary.classList.remove('hidden');
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <p>${item.name} - R$ ${item.price.toFixed(2)}</p>
                <button class="remove-item" data-index="${index}">Remover</button>
            `;
            cartItemsContainer.appendChild(itemElement);
            total += item.price;
        });

        totalPriceElement.innerText = total.toFixed(2);

        // Adicione o evento para remover itens do carrinho
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'), 10);
                cart.splice(index, 1);  // Remove o item do carrinho
                updateCart();  // Atualiza o carrinho
            });
        });
    }
}

function showNotification() {
    const popup = document.getElementById('notification-popup');
    if (popup) {
        console.log('Exibindo notificação'); // Adicione um log para depuração
        popup.classList.remove('hidden');
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hidden');
        }, 2000); // O popup desaparece após 2 segundos
    } else {
        console.error('Elemento de notificação não encontrado');
    }
}



