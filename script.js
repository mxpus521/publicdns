// Page load animations
document.addEventListener('DOMContentLoaded', () => {
    // Add loading class to body initially
    document.body.classList.add('loading');

    // Remove loading class after animations start
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 100);

    // Add animation delays to cards
    const dnsCards = document.querySelectorAll('.dns-card');
    dnsCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });

    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach((card, index) => {
        card.style.setProperty('--index', index);
    });
});

// Navigation active state with smooth transitions
const navLinks = document.querySelectorAll('.nav-link');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            let current = '';

            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });

            ticking = false;
        });
        ticking = true;
    }
});

// Enhanced mobile menu toggle
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when clicking a link with smooth animation
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const menu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');

        menu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Enhanced copy to clipboard with multiple fallback methods
function copyToClipboard(text) {
    // Method 1: Try modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.warn('Modern clipboard API failed, trying fallback:', err);
            tryFallbackMethods(text);
        });
        return;
    }

    // Method 2: Direct fallback for non-HTTPS or older browsers
    tryFallbackMethods(text);
}

// Multiple fallback methods for maximum compatibility
function tryFallbackMethods(text) {
    // Method 2a: Try document.execCommand with textarea
    if (tryTextareaCopy(text)) {
        showCopySuccess();
        return;
    }

    // Method 2b: Try document.execCommand with input
    if (tryInputCopy(text)) {
        showCopySuccess();
        return;
    }

    // Method 2c: Try selection-based copy
    if (trySelectionCopy(text)) {
        showCopySuccess();
        return;
    }

    // All methods failed
    showCopyError();
}

// Fallback using textarea
function tryTextareaCopy(text) {
    try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);

        // Modern approach
        textArea.focus();
        textArea.select();
        textArea.setSelectionRange(0, text.length);

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        return successful;
    } catch (err) {
        console.warn('Textarea copy failed:', err);
        return false;
    }
}

// Fallback using input element
function tryInputCopy(text) {
    try {
        const input = document.createElement('input');
        input.value = text;
        input.style.position = 'fixed';
        input.style.left = '-999999px';
        input.style.top = '-999999px';
        input.style.opacity = '0';
        document.body.appendChild(input);

        input.focus();
        input.select();
        input.setSelectionRange(0, text.length);

        const successful = document.execCommand('copy');
        document.body.removeChild(input);

        return successful;
    } catch (err) {
        console.warn('Input copy failed:', err);
        return false;
    }
}

// Fallback using text selection
function trySelectionCopy(text) {
    try {
        // Create a temporary div to hold the text
        const tempDiv = document.createElement('div');
        tempDiv.innerText = text;
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-999999px';
        tempDiv.style.top = '-999999px';
        tempDiv.style.opacity = '0';
        tempDiv.style.whiteSpace = 'pre';
        document.body.appendChild(tempDiv);

        // Select the text
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        const successful = document.execCommand('copy');

        // Clean up
        selection.removeAllRanges();
        document.body.removeChild(tempDiv);

        return successful;
    } catch (err) {
        console.warn('Selection copy failed:', err);
        return false;
    }
}

// Show copy success feedback
function showCopySuccess() {
    const btn = event.target;
    const originalText = btn.textContent;

    // Add visual feedback
    btn.textContent = '✓ 已复制';
    btn.classList.add('copied');

    // Reset after delay
    setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
    }, 2000);

    // Show toast notification
    showToast('DNS地址已复制到剪贴板');
}

// Show copy error feedback
function showCopyError() {
    showToast('复制失败，请手动复制地址');
}

// Toast notification system
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '100px',
        right: '40px',
        background: 'rgba(102, 126, 234, 0.9)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease'
    });

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);

    // Animate out and remove
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Enhanced back to top button with smooth animation
window.addEventListener('scroll', () => {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const menu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');

        menu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Dynamic navbar on scroll
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Add/remove scrolled class based on scroll position
    if (currentScrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// Apply debounced scroll handler
window.addEventListener('scroll', debounce(() => {
    // Additional scroll-based features can be added here
}, 16));

// Search functionality
const dnsProviders = [
    {
        name: 'Google DNS',
        flag: '🇺🇸',
        description: 'Google提供的公共DNS服务，全球可用，速度快，隐私保护好。',
        ipv4: ['8.8.8.8', '8.8.4.4'],
        ipv6: ['2001:4860:4860::8888', '2001:4860:4860::8844'],
        features: ['可靠性高', '全球节点覆盖', '支持IPv6'],
        category: 'global'
    },
    {
        name: 'Cloudflare DNS',
        flag: '🇺🇸',
        description: '速度快，隐私保护严格，支持DoH和DoT加密协议。',
        ipv4: ['1.1.1.1', '1.0.0.1'],
        ipv6: ['2606:4700:4700::1111', '2606:4700:4700::1001'],
        features: ['隐私保护最强', '速度最快', '支持加密协议'],
        category: 'privacy'
    },
    {
        name: 'Quad9 DNS',
        flag: '🇺🇸',
        description: '安全DNS服务，自动过滤恶意网站和钓鱼网站。',
        ipv4: ['9.9.9.9', '149.112.112.112'],
        ipv6: ['2620:fe::fe', '2620:fe::9'],
        features: ['自动过滤恶意网站', '保护免受威胁', '支持加密'],
        category: 'security'
    },
    {
        name: '阿里 Public DNS',
        flag: '🇨🇳',
        description: '阿里巴巴提供的公共DNS，在中国速度快。',
        ipv4: ['223.5.5.5', '223.6.6.6'],
        ipv6: ['2400:3200::1', '2400:3200:baba::1'],
        features: ['中国优化', '覆盖广泛', '速度快'],
        category: 'china'
    },
    {
        name: '腾讯 Public DNS',
        flag: '🇨🇳',
        description: '腾讯提供的公共DNS服务，面向全球用户。',
        ipv4: ['119.29.29.29', '119.28.28.28'],
        ipv6: ['2402:4e00::', '2402:4e00:1::1'],
        features: ['中国覆盖广', '可靠性强', '性能稳定'],
        category: 'china'
    },
    {
        name: '114 DNS',
        flag: '🇨🇳',
        description: 'CNNIC提供的公共DNS，具有强大的安全防护功能。',
        ipv4: ['114.114.114.114', '114.114.115.115'],
        ipv6: [],
        features: ['速度快', '安全防护', '防止DNS污染'],
        category: 'china'
    },
    {
        name: 'OpenDNS',
        flag: '🇺🇸',
        description: 'Cisco旗下的DNS服务，提供内容过滤和网络安全功能。',
        ipv4: ['208.67.222.222', '208.67.220.220'],
        ipv6: ['2620:119:35::35', '2620:119:53::53'],
        features: ['内容过滤功能', '家庭安全模式', '可自定义规则'],
        category: 'family'
    },
    {
        name: 'Cloudflare Families',
        flag: '🇺🇸',
        description: '专为家庭用户设计，提供恶意网站过滤和成人内容过滤。',
        ipv4: ['1.1.1.2', '1.0.0.2'],
        ipv6: ['2606:4700:4700::1112', '2606:4700:4700::1002'],
        features: ['成人内容过滤', '恶意网站拦截', '适合家庭使用'],
        category: 'family'
    },
    {
        name: '百度 Public DNS',
        flag: '🇨🇳',
        description: '百度提供的公共DNS服务，专注于中国用户体验。',
        ipv4: ['180.76.76.76'],
        ipv6: ['2400:da00::6666'],
        features: ['百度生态', '中国优化', '稳定可靠'],
        category: 'china'
    },
    {
        name: '火山引擎 DNS',
        flag: '🇨🇳',
        description: '字节跳动旗下的火山引擎提供的TrafficRoute DNS套件，专为中国用户优化。',
        ipv4: ['180.184.1.1', '180.184.2.2'],
        ipv6: [],
        features: ['字节跳动生态', '中国优化', '高性能'],
        category: 'china'
    },
    {
        name: 'OpenDNS Family Shield',
        flag: '🇺🇸',
        description: 'OpenDNS家庭护盾，阻止恶意软件和成人内容。',
        ipv4: ['208.67.222.123', '208.67.220.123'],
        ipv6: ['2620:119:35::123', '2620:119:53::123'],
        features: ['恶意软件过滤', '成人内容拦截', '家庭友好'],
        category: 'family'
    },
    {
        name: 'Verisign DNS',
        flag: '🇺🇸',
        description: 'Verisign提供的公共DNS，可靠性高，是.com/.net域名注册机构。',
        ipv4: ['64.6.64.6', '64.6.65.6'],
        ipv6: ['2620:74:4e::4e', '2620:74:4e::6'],
        features: ['高度可靠', '权威机构', '支持IPv6'],
        category: 'global'
    }
];

// Search functionality
let searchTimeout;
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Initialize search
function initSearch() {
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', showSearchResults);
    searchInput.addEventListener('keydown', handleSearchKeydown);

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-search')) {
            hideSearchResults();
        }
    });
}

// Handle search input
function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
}

// Handle search keydown
function handleSearchKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value.trim().toLowerCase());
    } else if (e.key === 'Escape') {
        hideSearchResults();
        searchInput.blur();
    }
}

// Perform search
function performSearch(query) {
    if (!query) {
        hideSearchResults();
        return;
    }

    const results = dnsProviders.filter(provider => {
        return provider.name.toLowerCase().includes(query) ||
            provider.description.toLowerCase().includes(query) ||
            provider.features.some(feature => feature.toLowerCase().includes(query)) ||
            provider.category.toLowerCase().includes(query);
    });

    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    searchResults.innerHTML = '';

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item">
                <div class="search-result-text">未找到匹配的DNS提供商</div>
                <div class="search-result-desc">尝试使用不同的关键词</div>
            </div>
        `;
    } else {
        results.forEach(provider => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.onclick = () => selectProvider(provider);

            const highlightedName = highlightText(provider.name, query);
            const highlightedDesc = highlightText(provider.description, query);

            resultItem.innerHTML = `
                        <div class="search-result-icon">${provider.flag}</div>
                        <div class="search-result-text">
                            <div>${highlightedName}</div>
                            <div class="search-result-desc">${highlightedDesc}</div>
                        </div>
                    `;

            searchResults.appendChild(resultItem);
        });
    }

    showSearchResults();
}

// Highlight search text
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Select provider from search results
function selectProvider(provider) {
    // Scroll to providers section
    document.getElementById('providers').scrollIntoView({ behavior: 'smooth' });

    // Find and highlight the provider card
    const cards = document.querySelectorAll('.dns-card');
    cards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent;
        if (cardTitle.includes(provider.name)) {
            card.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 1000);
        }
    });

    hideSearchResults();
    searchInput.value = '';
}

// Show search results
function showSearchResults() {
    searchResults.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    searchResults.style.display = 'none';
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
});

// Enhanced mobile responsiveness for search
function updateSearchForMobile() {
    const isMobile = window.innerWidth <= 768;
    const searchInput = document.querySelector('.search-input');

    if (isMobile) {
        searchInput.placeholder = '搜索...';
        searchInput.style.width = '150px';
    } else {
        searchInput.placeholder = '搜索DNS提供商...';
        searchInput.style.width = '200px';
    }
}

// Update search on window resize
window.addEventListener('resize', debounce(updateSearchForMobile, 250));
updateSearchForMobile(); // Initial call
