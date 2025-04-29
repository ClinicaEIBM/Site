// Espera o DOM ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Inicializa todos os componentes com tratamento de erro para cada um
        try { initMobileMenu(); } catch (e) { console.error('Erro em initMobileMenu:', e); }
        try { initSmoothScroll(); } catch (e) { console.error('Erro em initSmoothScroll:', e); }
        try { initTestimonialCarousel(); } catch (e) { console.error('Erro em initTestimonialCarousel:', e); }
        try { initModals(); } catch (e) { console.error('Erro em initModals:', e); }
        try { initBackToTop(); } catch (e) { console.error('Erro em initBackToTop:', e); }
        try { initForms(); } catch (e) { console.error('Erro em initForms:', e); }
        try { observeAnimations(); } catch (e) { console.error('Erro em observeAnimations:', e); }
        try { initPrismaEffect(); } catch (e) { console.error('Erro em initPrismaEffect:', e); }
    } catch (e) {
        console.error('Erro na inicialização do site:', e);
    }
});

/**
 * Menu Mobile
 * Controla a abertura e fechamento do menu em dispositivos móveis
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    
    // Verifica se os elementos existem antes de prosseguir
    if (!mobileMenu) return;
    
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Abre o menu (se o botão existir)
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede rolagem da página
        });
    }

    // Fecha o menu (se o botão existir)
    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; // Restaura rolagem
        });
    }

    // Fecha o menu ao clicar em um link
    if (mobileLinks && mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        if (mobileMenu && menuToggle && mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(e.target) && 
            e.target !== menuToggle && 
            !menuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Rolagem Suave
 * Implementa rolagem suave para os links de navegação
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    if (!navLinks || navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Previne o comportamento padrão do link
            e.preventDefault();
            
            // Obtém o alvo a partir do atributo href
            const targetId = this.getAttribute('href');
            
            // Se for um link vazio (#) ou (#inicio), role para o topo
            if (targetId === '#' || targetId === '#inicio') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            // Encontra o elemento alvo
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calcula a posição considerando o header fixo
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                // Rola até o alvo
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Carrossel de Depoimentos
 * Controla o carrossel na seção de depoimentos
 */
function initTestimonialCarousel() {
    const track = document.querySelector('.testimonial-track');
    const items = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('#testimonial-dots button');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    
    if (!track || !items || items.length === 0) return;
    
    let currentIndex = 0;
    const itemWidth = 100; // % de largura

    // Função para atualizar a posição do carrossel
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * itemWidth}%)`;
        
        // Atualiza os dots apenas se existirem
        if (dots && dots.length > 0) {
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('bg-primary');
                    dot.classList.remove('bg-gray-300');
                } else {
                    dot.classList.remove('bg-primary');
                    dot.classList.add('bg-gray-300');
                }
            });
        }
    }
    
    // Botão anterior
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            updateCarousel();
        });
    }
    
    // Botão próximo
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        });
    }
    
    // Dots de navegação
    if (dots && dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateCarousel();
            });
        });
    }
    
    // Auto-play (opcional)
    let interval = setInterval(() => {
        currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }, 6000);
    
    // Pausa o auto-play ao passar o mouse
    const testimonialContainer = document.querySelector('.testimonial-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', () => {
            clearInterval(interval);
        });
        
        testimonialContainer.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                currentIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
                updateCarousel();
            }, 6000);
        });
    }
}

/**
 * Modais
 * Gerencia a abertura e fechamento de modais em todo o site
 */
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    
    // Abre o modal quando o gatilho é clicado
    if (modalTriggers && modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const modalId = trigger.getAttribute('data-modal');
                const modal = document.getElementById(`modal-${modalId}`);
                
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Impede rolagem da página
                }
            });
        });
    }
    
    // Fecha o modal ao clicar no botão de fechar
    if (modalCloseButtons && modalCloseButtons.length > 0) {
        modalCloseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = ''; // Restaura rolagem
                }
            });
        });
    }
    
    // Fecha o modal ao clicar fora do conteúdo
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList && 
            e.target.classList.contains('modal') && 
            e.target.classList.contains('active')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Fecha o modal ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModals = document.querySelectorAll('.modal.active');
            if (activeModals && activeModals.length > 0) {
                activeModals.forEach(modal => {
                    modal.classList.remove('active');
                });
                document.body.style.overflow = '';
            }
        }
    });
}

/**
 * Botão de Voltar ao Topo
 * Exibe e oculta o botão de voltar ao topo conforme rolagem
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (!backToTopButton) return;
    
    // Exibe o botão após rolar uma certa quantidade
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('opacity-100');
            backToTopButton.classList.remove('opacity-0', 'invisible');
        } else {
            backToTopButton.classList.remove('opacity-100');
            backToTopButton.classList.add('opacity-0', 'invisible');
        }
    });
    
    // Rola para o topo quando clicado
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Formulários
 * Gerencia os formulários de contato e newsletter
 */
function initForms() {
    const schedulingForm = document.getElementById('scheduling-form');
    const newsletterForm = document.getElementById('newsletter-form');
    
    // Formulário de Agendamento
    if (schedulingForm) {
        schedulingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulação de envio (em um caso real, enviaria para um servidor)
            const submitButton = schedulingForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Altera o botão para indicar envio
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            // Simula um atraso de processamento
            setTimeout(() => {
                // Reseta o formulário e exibe agradecimento
                schedulingForm.reset();
                submitButton.textContent = 'Enviado com Sucesso!';
                
                // Restaura o botão após um tempo
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Fecha o modal
                    const modal = document.getElementById('modal-agendamento');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Mensagem de agradecimento
                    alert('Obrigado por entrar em contato! Em breve nossa equipe entrará em contato para confirmar seu agendamento.');
                }, 2000);
            }, 1500);
        });
    }
    
    // Formulário de Newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const submitButton = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Valida o e-mail (simples)
            if (!emailInput.value || !emailInput.value.includes('@')) {
                alert('Por favor, informe um e-mail válido.');
                emailInput.focus();
                return;
            }
            
            // Altera o botão para indicar envio
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simula um atraso de processamento
            setTimeout(() => {
                // Reseta o formulário e exibe agradecimento
                newsletterForm.reset();
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                
                // Restaura o botão após um tempo
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 2000);
                
                // Mensagem de agradecimento
                alert('Obrigado por se inscrever em nossa newsletter!');
            }, 1500);
        });
    }
}

/**
 * Animações baseadas em Observação
 * Ativa animações conforme elementos entram no viewport
 */
function observeAnimations() {
    // Verifica se o IntersectionObserver é suportado
    if (!('IntersectionObserver' in window)) return;
    
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-right');
    
    if (!animatedElements || animatedElements.length === 0) return;
    
    // Configura um novo observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.visibility = 'visible';
                entry.target.style.animationPlayState = 'running';
                
                // Deixa de observar o elemento após ativar a animação
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Porcentagem do elemento visível para ativar a animação
    });
    
    // Prepara os elementos e começa a observá-los
    animatedElements.forEach(element => {
        // Configura estado inicial
        element.style.visibility = 'hidden';
        element.style.animationPlayState = 'paused';
        
        // Começa a observar o elemento
        observer.observe(element);
    });
}

/**
 * Navigation Active State
 * Destaca item do menu conforme a seção visível
 */
function updateNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, #mobile-menu a');
    
    if (!sections || sections.length === 0) return;
    
    // Ponto na página onde consideramos a seção como "ativa"
    const scrollPosition = window.scrollY + window.innerHeight / 3;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove classe ativa de todos os links
            if (navLinks && navLinks.length > 0) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
            }
            
            // Adiciona classe ativa ao link correspondente à seção
            if (sectionId) {
                const activeLinks = document.querySelectorAll(`a[href="#${sectionId}"]`);
                if (activeLinks && activeLinks.length > 0) {
                    activeLinks.forEach(link => {
                        link.classList.add('active');
                    });
                }
            }
        }
    });
}

// Atualiza estado ativo do menu durante rolagem
window.addEventListener('scroll', updateNavActiveState);

/**
 * Efeito 3D nas Bolinhas do Prisma
 * Controla o efeito de movimento 3D e exibição da sinopse ao clicar nas bolinhas
 */
function initPrismaEffect() {
    const container = document.getElementById('prisma-container');
    if (!container) return;

    const circles = document.querySelectorAll('.circle-item');
    if (!circles || circles.length === 0) return;

    let activeCircle = null;
    let isPaused = false;

    // Função para pausar todas as animações
    function pauseAllAnimations() {
        container.classList.add('animation-paused');
        isPaused = true;
    }

    // Função para retomar todas as animações
    function resumeAllAnimations() {
        container.classList.remove('animation-paused');
        isPaused = false;
    }

    // Função para resetar o estado de todas as bolinhas
    function resetAllCircles() {
        circles.forEach(c => {
            c.classList.remove('active');
            c.classList.remove('inactive');
            c.style.zIndex = ""; // Remove o z-index inline
            const s = c.querySelector('.circle-synopsis');
            if (s) {
                s.style.opacity = '0';
                s.style.visibility = 'hidden';
            }
        });
        activeCircle = null;
        document.body.classList.remove('synopsis-active');
        resumeAllAnimations();
    }

    circles.forEach(circle => {
        const button = circle.querySelector('.circle-button');
        const synopsis = circle.querySelector('.circle-synopsis');
        const closeBtn = synopsis ? synopsis.querySelector('.synopsis-close') : null;

        if (!button) return;

        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Se esta bolinha já está ativa, redirecionar para a página
            if (activeCircle === circle && synopsis) {
                const linkElement = synopsis.querySelector('a');
                if (linkElement) {
                    const link = linkElement.getAttribute('href');
                    if (link) window.location.href = link;
                }
                return;
            }

            // Reset todas as bolinhas para o estado original
            resetAllCircles();

            // Pausar todas as animações
            pauseAllAnimations();

            // Ativar efeito na bolinha clicada
            circle.classList.add('active');
            circle.style.zIndex = "50"; // Aumenta o z-index da esfera clicada

            // Marcar outras bolinhas como inativas
            circles.forEach(c => {
                if (c !== circle) {
                    c.classList.add('inactive');
                    c.style.zIndex = "10"; // Reduz o z-index das outras esferas
                }
            });

            // Adicionar classe de perspectiva 3D ao container
            container.style.perspective = '1000px';

            // Exibir a sinopse
            if (synopsis) {
                synopsis.style.visibility = 'visible';
                synopsis.style.opacity = '1';

                // Adicionar classe para overlay mobile
                if (window.innerWidth < 640) {
                    document.body.classList.add('synopsis-active');
                    // Forçar centralização no mobile
                    synopsis.style.left = '50%';
                    synopsis.style.right = 'auto';
                    synopsis.style.top = '50%';
                    synopsis.style.transform = 'translate(-50%, -50%)';
                }
            }

            activeCircle = circle;
        });

        // Permitir clicar na sinopse sem fechar
        if (synopsis) {
            synopsis.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Remover o antigo listener de mousedown para fechar no canto
            // Agora usar o botão de fechar explícito
        }

        // Adicionar evento para o botão de fechar sinopse
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                resetAllCircles();
            });
        }
    });

    // Fechar sinopse ao clicar fora das esferas e sinopses
    document.addEventListener('click', (e) => {
        // Verificar se clicou fora do container ou em alguma parte dele que não é um círculo ou sinopse
        if (!container.contains(e.target) ||
            (container.contains(e.target) &&
                !e.target.closest('.circle-item') &&
                !e.target.closest('.circle-synopsis'))) {
            resetAllCircles();
        }
    });

    // Adicionar responsividade
    function adjustForMobile() {
        const isMobile = window.innerWidth < 640;

        if (isMobile) {
            // Distribuir as bolinhas em posições adequadas para mobile
            circles.forEach(circle => {
                // As posições já estão definidas via CSS com data-attributes
                circle.classList.add('mobile-position');
            });
        } else {
            // Remover ajustes mobile
            circles.forEach(circle => {
                circle.classList.remove('mobile-position');
            });
        }
    }

    // Chamar uma vez na inicialização
    adjustForMobile();

    // Adicionar evento de redimensionamento
    window.addEventListener('resize', adjustForMobile);
}
