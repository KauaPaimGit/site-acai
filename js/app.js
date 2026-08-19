document.addEventListener('DOMContentLoaded', () => {
  const DELIVERY_FEE = 5;
  const checkoutLinkBase = 'https://checkout.goatpay.com/';

  const produtoModal = document.getElementById('modal-produto');
  const carrinhoModal = document.getElementById('modal-carrinho');
  const confirmacaoModal = document.getElementById('modal-confirmacao');
  const produtoForm = document.getElementById('modal-produto-form');
  const modalTamanhos = document.getElementById('modal-tamanhos');
  const modalAdicionais = document.getElementById('modal-adicionais');
  const modalProdutoTotal = document.getElementById('modal-produto-total');
  const modalProdutoImagem = document.getElementById('modal-produto-imagem');
  const modalProdutoTitulo = document.getElementById('modal-produto-titulo');
  const modalProdutoDescricao = document.getElementById('modal-produto-descricao');
  const modalProdutoObservacoes = document.getElementById('modal-observacoes');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartTotalEl = document.getElementById('cart-total');
  const cartDeliveryEl = document.getElementById('cart-delivery');
  const cartCountEl = document.getElementById('cart-count');
  const goToCheckoutBtn = document.getElementById('go-to-checkout');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutBtn = document.getElementById('checkout-btn');
  const openCartBtn = document.getElementById('open-cart');
  const confirmNameEl = document.getElementById('confirmacao-nome');
  const confirmWhatsappEl = document.getElementById('confirmacao-whatsapp');
  const confirmEnderecoEl = document.getElementById('confirmacao-endereco');
  const confirmComplementoEl = document.getElementById('confirmacao-complemento');
  const confirmTotalEl = document.getElementById('confirmacao-total');
  const confirmarCheckoutBtn = document.getElementById('confirmar-checkout');
  const currentYearEl = document.getElementById('current-year');
  const themeToggleBtn = document.getElementById('theme-toggle');

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  let produtoAtualId = null;
  let checkoutPendente = null;
  let temaAtual = null; // 'light' | 'dark'

  function aplicarTema(theme) {
    temaAtual = theme === 'dark' ? 'dark' : 'light';
    if (temaAtual === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', temaAtual);
    atualizarIconeTema();
  }

  function atualizarIconeTema() {
    if (!themeToggleBtn) return;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    themeToggleBtn.title = isDark ? 'Usar tema claro' : 'Usar tema escuro';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Usar tema claro' : 'Usar tema escuro');
  }

  const catalogo = {
    'acai-500': {
      tamanhos: [
        { id: 'p', rotulo: '300ml', descricao: 'Para um boost rápido', preco: 15 },
        { id: 'm', rotulo: '500ml', descricao: 'Clássico da casa', preco: 18 },
        { id: 'g', rotulo: '700ml', descricao: 'Para dividir', preco: 22 }
      ],
      adicionais: [
        { id: 'granola', rotulo: 'Granola crocante', preco: 2 },
        { id: 'leitePo', rotulo: 'Leite em pó', preco: 2.5 },
        { id: 'banana', rotulo: 'Banana fresca', preco: 2 }
      ]
    },
    'acai-700': {
      tamanhos: [
        { id: 'm', rotulo: '500ml', descricao: 'Clássico reforçado', preco: 24 },
        { id: 'g', rotulo: '700ml', descricao: 'Super power', preco: 27 },
        { id: 'gg', rotulo: '1 litro', descricao: 'Família feliz', preco: 34 }
      ],
      adicionais: [
        { id: 'doceLeite', rotulo: 'Doce de leite', preco: 3 },
        { id: 'morangos', rotulo: 'Morangos frescos', preco: 3.5 },
        { id: 'oreo', rotulo: 'Biscoito Oreo', preco: 3 }
      ]
    },
    'acai-copo': {
      tamanhos: [
        { id: 'unique', rotulo: '400ml', descricao: 'Camadas perfeitas', preco: 16 },
        { id: 'plus', rotulo: '500ml', descricao: 'Com extra milk', preco: 19 }
      ],
      adicionais: [
        { id: 'leiteCondensado', rotulo: 'Leite condensado', preco: 2.5 },
        { id: 'nutella', rotulo: 'Creme de avelã', preco: 3.5 },
        { id: 'confete', rotulo: 'Confete colorido', preco: 2 }
      ]
    },
    'acai-bowl': {
      tamanhos: [
        { id: 'm', rotulo: '500ml', descricao: 'Bowl tropical', preco: 22 },
        { id: 'g', rotulo: '700ml', descricao: 'Explosão de frutas', preco: 26 }
      ],
      adicionais: [
        { id: 'kiwi', rotulo: 'Kiwi extra', preco: 3 },
        { id: 'castanhas', rotulo: 'Mix de castanhas', preco: 4 },
        { id: 'mel', rotulo: 'Mel orgânico', preco: 2.5 }
      ]
    },
    'acai-zero': {
      tamanhos: [
        { id: 'p', rotulo: '350ml', descricao: 'Perfeito para dietas', preco: 20 },
        { id: 'm', rotulo: '500ml', descricao: 'Zero com sabor', preco: 23 },
        { id: 'g', rotulo: '700ml', descricao: 'Compartilhe sem culpa', preco: 28 }
      ],
      adicionais: [
        { id: 'granolaZero', rotulo: 'Granola sem açúcar', preco: 2.5 },
        { id: 'morango', rotulo: 'Morangos frescos', preco: 3 },
        { id: 'whey', rotulo: 'Whey protein', preco: 4.5 }
      ]
    },
    'acai-mini': {
      tamanhos: [
        { id: 'kids', rotulo: '250ml', descricao: 'Mini delícia', preco: 12 },
        { id: 'kidsPlus', rotulo: '300ml', descricao: 'Com extra confete', preco: 14 }
      ],
      adicionais: [
        { id: 'confete', rotulo: 'Confete colorido', preco: 1.5 },
        { id: 'gummies', rotulo: 'Gomas divertidas', preco: 2 },
        { id: 'caldaMorango', rotulo: 'Calda de morango', preco: 1.5 }
      ]
    }
  };

  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }

  function atualizarContadorCarrinho() {
    cartCountEl.textContent = carrinho.length;
  }

  function formatCurrency(value) {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function abrirModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function fecharModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function preencherProdutoModal(produtoEl) {
    const productId = produtoEl.dataset.id;
    const nome = produtoEl.dataset.name;
    const descricao = produtoEl.querySelector('p')?.textContent?.trim() || '';
    const imagem = produtoEl.querySelector('img')?.getAttribute('src');
    const config = catalogo[productId];

    if (!config) {
      console.warn(`Configuração não encontrada para o produto ${productId}`);
      return;
    }

    produtoAtualId = productId;
    produtoForm.reset();
    modalProdutoTitulo.textContent = nome;
    modalProdutoDescricao.textContent = descricao;
    modalProdutoImagem.setAttribute('src', imagem || '');
    modalProdutoImagem.setAttribute('alt', nome);
    modalProdutoObservacoes.value = '';

    modalTamanhos.innerHTML = '';
    config.tamanhos.forEach((option, index) => {
      const optionId = `size-${productId}-${option.id}`;
      const wrapper = document.createElement('label');
      wrapper.className = 'modal-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'produto-tamanho';
      input.value = option.id;
      input.dataset.price = option.preco;
      input.required = true;
      if (index === 0) {
        input.checked = true;
      }

      const info = document.createElement('div');
      info.className = 'modal-option__info';

      const strong = document.createElement('strong');
      strong.textContent = option.rotulo;

      const small = document.createElement('small');
      small.textContent = option.descricao;

      const price = document.createElement('span');
      price.className = 'modal-option__price';
      price.textContent = formatCurrency(option.preco);

      info.append(strong, small);
      wrapper.append(input, info, price);
      modalTamanhos.appendChild(wrapper);
    });

    modalAdicionais.innerHTML = '';
    config.adicionais.forEach((addon) => {
      const wrapper = document.createElement('label');
      wrapper.className = 'modal-option';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'produto-adicional';
      input.value = addon.id;
      input.dataset.price = addon.preco;

      const info = document.createElement('div');
      info.className = 'modal-option__info';

      const strong = document.createElement('strong');
      strong.textContent = addon.rotulo;

      const price = document.createElement('span');
      price.className = 'modal-option__price';
      price.textContent = `+ ${formatCurrency(addon.preco)}`;

      info.append(strong);
      wrapper.append(input, info, price);
      modalAdicionais.appendChild(wrapper);
    });

    atualizarTotalModal();
    abrirModal(produtoModal);
  }

  function atualizarTotalModal() {
    const selectedSize = produtoForm.querySelector('input[name="produto-tamanho"]:checked');
    const selectedAddons = Array.from(produtoForm.querySelectorAll('input[name="produto-adicional"]:checked'));

    let total = 0;
    if (selectedSize) {
      total += Number(selectedSize.dataset.price);
    }
    selectedAddons.forEach((addon) => {
      total += Number(addon.dataset.price);
    });

    modalProdutoTotal.textContent = formatCurrency(total);
    return total;
  }

  function renderizarCarrinho() {
    cartItemsList.innerHTML = '';

    if (!carrinho.length) {
      const empty = document.createElement('li');
      empty.textContent = 'Seu carrinho está vazio. Monte seu açaí e volte aqui!';
      empty.className = 'cart-item cart-item--empty';
      cartItemsList.appendChild(empty);
      cartSubtotalEl.textContent = formatCurrency(0);
      cartTotalEl.textContent = formatCurrency(0);
      cartDeliveryEl.textContent = formatCurrency(0);
      return;
    }

    let subtotal = 0;

    carrinho.forEach((item, index) => {
      subtotal += item.total;

      const li = document.createElement('li');
      li.className = 'cart-item';

      const info = document.createElement('div');
      const title = document.createElement('p');
      title.className = 'cart-item__title';
      title.textContent = `${item.name} (${item.size.label})`;

      const details = document.createElement('p');
      details.className = 'cart-item__details';
      const addonsText = item.addons.length
        ? `Adicionais: ${item.addons.map((addon) => addon.label).join(', ')}`
        : 'Sem adicionais';
      const notesText = item.notes ? ` • Obs: ${item.notes}` : '';
      details.textContent = `${addonsText}${notesText}`;

      info.append(title, details);

      const actions = document.createElement('div');
      actions.style.display = 'flex';
      actions.style.flexDirection = 'column';
      actions.style.alignItems = 'flex-end';
      actions.style.gap = '0.35rem';

      const price = document.createElement('span');
      price.className = 'cart-item__price';
      price.textContent = formatCurrency(item.total);

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'cart-item__remove';
      removeBtn.textContent = 'Remover';
      removeBtn.addEventListener('click', () => {
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarContadorCarrinho();
        renderizarCarrinho();
      });

      actions.append(price, removeBtn);
      li.append(info, actions);
      cartItemsList.appendChild(li);
    });

    cartSubtotalEl.textContent = formatCurrency(subtotal);
    const total = subtotal + DELIVERY_FEE;
    cartTotalEl.textContent = formatCurrency(total);
    cartDeliveryEl.textContent = formatCurrency(DELIVERY_FEE);
  }

  function abrirCarrinho() {
    renderizarCarrinho();
    abrirModal(carrinhoModal);
  }

  function fecharTodosModals() {
    fecharModal(produtoModal);
    fecharModal(carrinhoModal);
    fecharModal(confirmacaoModal);
  }

  function obterTotalPedido() {
    const subtotal = carrinho.reduce((acc, item) => acc + item.total, 0);
    if (!subtotal) {
      return 0;
    }
    return subtotal + DELIVERY_FEE;
  }

  produtoForm.addEventListener('change', atualizarTotalModal);

  produtoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const selectedSize = produtoForm.querySelector('input[name="produto-tamanho"]:checked');
    if (!selectedSize) {
      alert('Escolha um tamanho para continuar.');
      return;
    }

    const sizeLabel = selectedSize.parentElement.querySelector('strong')?.textContent || '';
    const addons = Array.from(produtoForm.querySelectorAll('input[name="produto-adicional"]:checked')).map(
      (addonInput) => ({
        id: addonInput.value,
        label: addonInput.parentElement.querySelector('strong')?.textContent || '',
        price: Number(addonInput.dataset.price)
      })
    );

    const produtoBase = document.querySelector(`.produto-item[data-id="${produtoAtualId}"]`);
    if (!produtoBase) {
      console.error('Produto base não encontrado para adicionar ao carrinho.');
      return;
    }

    const nome = produtoBase.dataset.name || produtoBase.querySelector('h3')?.textContent || '';
    const image = produtoBase.querySelector('img')?.getAttribute('src') || '';
    const descricao = produtoBase.querySelector('p')?.textContent?.trim() || '';

    const total = atualizarTotalModal();
    const item = {
      id: `${produtoAtualId}-${Date.now()}`,
      productId: produtoAtualId,
      name: nome,
      description: descricao,
      image,
      size: {
        id: selectedSize.value,
        label: sizeLabel,
        price: Number(selectedSize.dataset.price)
      },
      addons,
      notes: modalProdutoObservacoes.value.trim(),
      total
    };

    carrinho.push(item);
    salvarCarrinho();
    atualizarContadorCarrinho();
    fecharModal(produtoModal);
  });

  document.querySelectorAll('[data-close="modal"]').forEach((el) => {
    el.addEventListener('click', () => fecharTodosModals());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      fecharTodosModals();
    }
  });

  document.querySelectorAll('.produto-item').forEach((produtoEl) => {
    produtoEl.addEventListener('click', () => preencherProdutoModal(produtoEl));
    produtoEl.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        preencherProdutoModal(produtoEl);
      }
    });
    produtoEl.setAttribute('tabindex', '0');
    produtoEl.setAttribute('role', 'button');
    produtoEl.setAttribute('aria-label', `${produtoEl.dataset.name} - clique para personalizar`);
  });

  openCartBtn.addEventListener('click', abrirCarrinho);

  goToCheckoutBtn.addEventListener('click', () => {
    if (!carrinho.length) {
      alert('Seu carrinho está vazio. Monte seu açaí para continuar.');
      return;
    }
    fecharModal(carrinhoModal);
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
  });

  function prepararConfirmacaoCheckout(dados, total) {
    const nome = dados['customer-name']?.trim() || 'Não informado';
    const whatsapp = dados['customer-phone']?.trim() || 'Não informado';
    const cep = dados['customer-cep']?.trim() || '';
    const rua = dados['customer-street']?.trim() || '';
    const numero = dados['customer-number']?.trim() || '';
    const bairro = dados['customer-neighborhood']?.trim() || '';
    const complemento = dados['customer-complement']?.trim();

    confirmNameEl.textContent = nome;
    confirmWhatsappEl.textContent = whatsapp;

    const enderecoPartes = [
      cep && `CEP: ${cep}`,
      rua && numero ? `${rua}, ${numero}` : rua || numero,
      bairro
    ].filter(Boolean);

    confirmEnderecoEl.textContent = enderecoPartes.join(' • ') || 'Endereço incompleto';
    confirmComplementoEl.textContent = complemento || 'Sem complemento';
    confirmTotalEl.textContent = formatCurrency(total);

    confirmarCheckoutBtn.disabled = false;
    confirmarCheckoutBtn.textContent = 'Confirmar e pagar';
  }

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!carrinho.length) {
      alert('Adicione itens ao carrinho antes de finalizar o pedido.');
      return;
    }

    const formEntries = Object.fromEntries(new FormData(checkoutForm).entries());
    const total = obterTotalPedido();
    checkoutPendente = { dados: formEntries, total };
    prepararConfirmacaoCheckout(formEntries, total);
    abrirModal(confirmacaoModal);
  });

  confirmarCheckoutBtn.addEventListener('click', () => {
    if (!checkoutPendente) {
      fecharModal(confirmacaoModal);
      return;
    }

    confirmarCheckoutBtn.disabled = true;
    confirmarCheckoutBtn.textContent = 'Redirecionando...';

    const { dados, total } = checkoutPendente;
    const params = new URLSearchParams({
      valor: total.toFixed(2),
      nome: dados['customer-name'] || '',
      telefone: dados['customer-phone'] || ''
    });

    const url = `${checkoutLinkBase}?${params.toString()}`;
    window.open(url, '_blank');

    setTimeout(() => {
      confirmarCheckoutBtn.disabled = false;
      confirmarCheckoutBtn.textContent = 'Confirmar e pagar';
      fecharModal(confirmacaoModal);
      checkoutPendente = null;
    }, 1200);
  });

  confirmacaoModal.addEventListener('click', (event) => {
    if (event.target.dataset.close === 'modal') {
      checkoutPendente = null;
    }
  });

  currentYearEl.textContent = String(new Date().getFullYear());
  cartDeliveryEl.textContent = formatCurrency(DELIVERY_FEE);
  atualizarContadorCarrinho();

  // Tema: inicialização e toggle
  (function initTema() {
    const armazenado = localStorage.getItem('theme');
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const inicial = armazenado || (prefereEscuro ? 'dark' : 'light');
    aplicarTema(inicial);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const proximo = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        aplicarTema(proximo);
      });
    }
  })();
});
