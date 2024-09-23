document.addEventListener('DOMContentLoaded', () => {
    // Adicionando um parâmetro de versão para evitar cache
    fetch('https://raw.githubusercontent.com/W-Fonseca/pizza/main/data.json?v=' + new Date().getTime())
        .then(response => response.json())
        .then(data => {
            if (data.menu && data.bebidas && data.promocao) {
                populateMenu(data.menu);
                populateBebidas(data.bebidas);
                populatePromocoes(data.promocao);
            } else {
                console.error('Estrutura do JSON inválida');
            }
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    setupNavigation();
    setupLoginModal();
    checkLoginStatus(); // Verificar se o usuário já está logado
});

// Função para verificar o status de login ao carregar a página
function checkLoginStatus() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.isLoggedIn) {
        displayUserInfo(userInfo.username);
    }
}

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
                <button class="add-to-cart" data-name="${item.nome}" data-price="${parseFloat(item.valor.replace('R$ ', '').replace(',', '.'))}" data-type="pizza">Adicionar</button>
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
                <p>${item.conteudo}</p>
                <p><strong>${item.valor}</strong></p>
                <button class="add-to-cart" data-name="${item.nome}" data-price="${parseFloat(item.valor.replace('R$ ', '').replace(',', '.'))}" data-type="drink">Adicionar</button>
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
                <button class="add-to-cart" data-name="${item.nome}" data-price="${parseFloat(item.valor.replace('R$ ', '').replace(',', '.'))}" data-type="promotion">Adicionar</button>
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
    // Remove event listeners antigos antes de adicionar novos
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
            button.removeEventListener('click', removeFromCartHandler);
            button.addEventListener('click', removeFromCartHandler);
        });
    }
}

function removeFromCartHandler() {
    const index = parseInt(this.getAttribute('data-index'), 10);
    if (!isNaN(index)) {
        cart.splice(index, 1);  // Remove o item do carrinho
        updateCart();  // Atualiza o carrinho
    }
}

function showNotification(message = 'Item adicionado ao carrinho') {
    const popup = document.getElementById('notification-popup');
    if (popup) {
        popup.innerText = message;
        popup.classList.remove('hidden');
        popup.classList.add('show');

        // Esconder o popup após 2 segundos
        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hidden');
        }, 2000);
    } else {
        console.error('Elemento de notificação não encontrado.');
    }
}

// Função para configurar o Modal de Login
function setupLoginModal() {
    const openModalButton = document.getElementById('open-login-modal');
    const modal = document.getElementById('login-modal');
    const closeButton = document.querySelector('.close-button');

    // Abrir o modal quando o botão for clicado
    if (openModalButton && modal) {
        openModalButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('show');
        });
    }

    // Fechar o modal quando o botão de fechar for clicado
    if (closeButton && modal) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        });
    }

    // Fechar o modal quando clicar fora do conteúdo do modal
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    });

    // Tratar o envio do formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredUsername = document.getElementById('username').value;
            const enteredPassword = document.getElementById('password').value;

            // Definir credenciais de teste
            const TEST_CREDENTIALS = {
                username: "usuario1",
                password: "senha123"
            };

           // if (enteredUsername === TEST_CREDENTIALS.username && enteredPassword === TEST_CREDENTIALS.password) {
                // Login bem-sucedido
                modal.classList.remove('show');
                modal.classList.add('hidden');
                // Salvar informações do usuário no localStorage
                localStorage.setItem('userInfo', JSON.stringify({
                    isLoggedIn: true,
                    username: enteredUsername
                }));
                // Atualizar o header com as informações do usuário
                displayUserInfo(enteredUsername);
                // Exibir notificação de sucesso
                showNotification('Login realizado com sucesso!');
          //  } else {
                // Login falhou
                showNotification('Usuário ou senha inválidos!');
          //  }
        });
    }

    // Configurar o botão de logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
}

// Função para exibir informações do usuário no header
function displayUserInfo(username) {
    const userInfoContainer = document.getElementById('user-info');
    const userNameSpan = document.getElementById('user-name');

    if (userInfoContainer && userNameSpan) {
        userNameSpan.textContent = username;
        userInfoContainer.classList.remove('hidden');
    }
}

// Função para lidar com o logout
function handleLogout() {
    // Remover informações do usuário do localStorage
    localStorage.removeItem('userInfo');

    // Ocultar o contêiner de informações do usuário
    const userInfoContainer = document.getElementById('user-info');
    if (userInfoContainer) {
        userInfoContainer.classList.add('hidden');
    }

    // Exibir uma notificação de logout bem-sucedido
    showNotification('Logout realizado com sucesso!');
}
document.getElementById('finalizar-compra').addEventListener('click', showSuccessPopup);

function showSuccessPopup() {
    const popup = document.getElementById('popup');
    const confettiGif = document.getElementById('confetti-gif');

    // Mostra o popup
    popup.classList.remove('hidden');

    // Mostra a imagem do confete
    confettiGif.style.display = 'block'; // Muda o display para block
    confettiGif.classList.remove('hidden'); // Remove a classe hidden

    // Para garantir que a imagem do confete fique oculta novamente após 3 segundos
    setTimeout(() => {
        confettiGif.classList.add('hidden'); // Adiciona a classe hidden novamente
        confettiGif.style.display = 'none'; // Oculta a imagem do confete
    }, 3000); // Oculta após 3 segundos
}

document.getElementById("fechar-popup").onclick = function() {
    closePopup();
}

// Função para fechar o popup
function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// Fechar o popup ao clicar fora dele
window.onclick = function(event) {
    const popup = document.getElementById("popup");
    if (event.target === popup) {
        closePopup();
    }
}
let isLoggedIn = false; // Mude para true se o usuário estiver logado

function updateAccountPage() {
    const loginContainer = document.getElementById('login-container');
    const profileContainer = document.getElementById('profile-container');

    if (isLoggedIn) {
        loginContainer.classList.add('hidden');
        profileContainer.classList.remove('hidden');
    } else {
        loginContainer.classList.remove('hidden');
        profileContainer.classList.add('hidden');
    }
}

// Chame essa função para atualizar a página de conta ao carregar
updateAccountPage();

// Função para simular login
document.getElementById('open-login-modal').addEventListener('click', function() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.remove('hidden');
});

// Fechar modal
document.querySelector('.close-button').addEventListener('click', function() {
    const loginModal = document.getElementById('login-modal');
    loginModal.classList.add('hidden');
});

// Ao enviar o formulário de login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio do formulário
    isLoggedIn = true; // Muda o estado de login
    updateAccountPage(); // Atualiza a página
    document.getElementById('login-modal').classList.add('hidden'); // Fecha o modal
});

// Função para simular logout
document.getElementById('logout-button').addEventListener('click', function() {
    isLoggedIn = false; // Muda o estado de login
    updateAccountPage(); // Atualiza a página
});


