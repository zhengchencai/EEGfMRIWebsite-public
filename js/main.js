
// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const heroNavList = document.querySelector('.hero-nav-list');
const heroSection = document.querySelector('.hero');

if (mobileMenuToggle && heroNavList) {
    // Position menu icon and dropdown based on actual banner height
    function updateMobileMenuPosition() {
        if (heroSection && mobileMenuToggle) {
            const heroHeight = heroSection.offsetHeight;
            const iconHeight = mobileMenuToggle.offsetHeight;
            const iconMargin = 5; // 5px margin from banner bottom
            const dropdownGap = 8; // 8px gap between icon and dropdown

            // Position icon with 5px margin above banner bottom
            const iconTop = heroHeight - iconHeight - iconMargin;
            const iconBottom = iconTop + iconHeight;
            const menuTop = iconBottom + dropdownGap; // 8px below icon bottom

            // Only set position on mobile and when not scrolled
            if (window.innerWidth <= 768 && !mobileMenuToggle.classList.contains('mobile-scrolled')) {
                mobileMenuToggle.style.setProperty('top', `${iconTop}px`, 'important');
            }

            // Update dropdown menu position (always relative to icon)
            document.documentElement.style.setProperty('--mobile-menu-list-top', `${menuTop}px`);
        }
    }

    // Show/hide hamburger menu based on scroll position
    function handleScrollNav() {
        if (window.innerWidth > 768 && heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition > heroBottom - 100) {
                mobileMenuToggle.classList.add('scroll-visible');
                heroNavList.classList.add('mobile-menu-active');
            } else {
                mobileMenuToggle.classList.remove('scroll-visible');
                mobileMenuToggle.classList.remove('active');
                heroNavList.classList.remove('active');
                heroNavList.classList.remove('mobile-menu-active');
            }
        } else if (window.innerWidth <= 768 && heroSection) {
            // On mobile, float menu to top when scrolled past hero
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            const scrollPosition = window.scrollY;

            if (scrollPosition > heroBottom - 100) {
                mobileMenuToggle.classList.add('mobile-scrolled');
                // Remove inline style to let CSS take over
                mobileMenuToggle.style.removeProperty('top');
            } else {
                mobileMenuToggle.classList.remove('mobile-scrolled');
                // Reapply position
                updateMobileMenuPosition();
            }

            // Remove desktop classes
            heroNavList.classList.remove('mobile-menu-active');
        }
    }

    // Helper to update position with retry logic
    function initializeMenuPosition() {
        updateMobileMenuPosition();
        // Retry after delays to catch banner image load
        setTimeout(updateMobileMenuPosition, 100);
        setTimeout(updateMobileMenuPosition, 300);
    }

    // Update position on resize
    window.addEventListener('resize', updateMobileMenuPosition);

    // Update on page load
    window.addEventListener('load', initializeMenuPosition);

    // Update when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMenuPosition);
    } else {
        initializeMenuPosition();
    }

    // Update when banner image loads
    const heroBanner = document.querySelector('.hero-banner');
    if (heroBanner && !heroBanner.complete) {
        heroBanner.addEventListener('load', updateMobileMenuPosition);
    }
    
    window.addEventListener('scroll', handleScrollNav);
    handleScrollNav(); // Check initial position
    
    // Show menu on hover (only on devices with proper hover support)
    if (window.matchMedia('(hover: hover)').matches) {
        mobileMenuToggle.addEventListener('mouseenter', () => {
            mobileMenuToggle.classList.add('active');
            heroNavList.classList.add('active');
        });

        // Keep menu open when hovering over the menu itself
        heroNavList.addEventListener('mouseenter', () => {
            mobileMenuToggle.classList.add('active');
            heroNavList.classList.add('active');
        });

        // Hide menu when mouse leaves both toggle and menu
        mobileMenuToggle.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!heroNavList.matches(':hover')) {
                    mobileMenuToggle.classList.remove('active');
                    heroNavList.classList.remove('active');
                }
            }, 100);
        });

        heroNavList.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!mobileMenuToggle.matches(':hover')) {
                    mobileMenuToggle.classList.remove('active');
                    heroNavList.classList.remove('active');
                }
            }, 100);
        });
    }

    // Also keep click functionality
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        heroNavList.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.hero-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            heroNavList.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !heroNavList.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            heroNavList.classList.remove('active');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Observe cards and items (non-program cards use inline styles)
document.querySelectorAll('.info-card, .speaker-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe program cards with class-based animation (like interest-category)
const programObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate-in');
            }, index * 100);
            programObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.timeline-item').forEach(card => {
    programObserver.observe(card);
});

// Parallax scrolling effect for hero banner - DISABLED
// const heroBanner = document.querySelector('.hero-banner');
// if (heroBanner) {
//     window.addEventListener('scroll', () => {
//         const scrolled = window.pageYOffset;
//         const heroHeight = document.querySelector('.hero').offsetHeight;
//
//         // Only apply parallax within hero section
//         if (scrolled < heroHeight) {
//             heroBanner.style.transform = `translateY(${scrolled * 0.5}px)`;
//         }
//     });
// }

// Registration button - link now works directly, no JavaScript needed

// Load and display interest summary
async function loadInterestSummary() {
    try {
        const response = await fetch('data/interest-summary.json');
        const summaryData = await response.json();
        
        // Update date only
        document.getElementById('lastUpdated').textContent = new Date(summaryData.lastUpdated).toLocaleDateString();
        
        // Helper function to convert counts to percentages and render as text
        function renderCategory(containerId, data) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            const total = Object.values(data).reduce((sum, val) => sum + val, 0);
            
            // Sort by percentage descending
            const items = Object.entries(data)
                .map(([label, count]) => ({
                    label: label.replace(/\bFMRI\b/g, 'fMRI').charAt(0).toUpperCase() + label.replace(/\bFMRI\b/g, 'fMRI').slice(1),
                    percentage: Math.round((count / total) * 100)
                }))
                .sort((a, b) => b.percentage - a.percentage);
            
            // Create HTML for each item with progress bar
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'interest-item';
                
                const barDiv = document.createElement('div');
                barDiv.className = 'interest-bar';
                barDiv.style.width = item.percentage + '%';
                barDiv.style.background = 'rgba(18, 105, 199, 0.9)';
                barDiv.style.boxShadow = '0 2px 8px rgba(18, 105, 199, 0.15)';
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'interest-label';
                labelSpan.textContent = item.label;
                labelSpan.style.left = item.percentage + '%';
                labelSpan.style.maxWidth = `calc(${100 - item.percentage}% - 2rem)`;
                
                itemDiv.appendChild(barDiv);
                itemDiv.appendChild(labelSpan);
                container.appendChild(itemDiv);
            });
        }
        
        // Helper function to render Interest Level as a single scale bar
        function renderInterestScale(containerId, data) {
            const container = document.getElementById(containerId);
            if (!container) return;
            
            // Calculate weighted average
            let totalScore = 0;
            let totalCount = 0;
            for (const [level, count] of Object.entries(data)) {
                totalScore += parseInt(level) * count;
                totalCount += count;
            }
            const average = totalScore / totalCount;
            const percentage = (average / 5) * 100;
            
            // Create scale bar HTML
            const scaleBar = document.createElement('div');
            scaleBar.className = 'interest-scale-bar';
            
            const fillDiv = document.createElement('div');
            fillDiv.className = 'interest-scale-fill';
            fillDiv.style.background = `linear-gradient(to right, rgba(18, 105, 199, 0.9) 0%, rgba(18, 105, 199, 0.9) ${percentage}%, rgba(18, 105, 199, 0.25) ${percentage}%, rgba(18, 105, 199, 0.25) 100%)`;
            fillDiv.style.boxShadow = '0 2px 8px rgba(18, 105, 199, 0.15)';
            
            scaleBar.appendChild(fillDiv);
            container.appendChild(scaleBar);
        }
        
        // Render each category in desired order
        renderInterestScale('interestSummary', summaryData.data["How interested are you in the topic of EEG-fMRI in epilepsy?"]);
        renderCategory('activitySummary', summaryData.data["What is your principal activity?"]);
        renderCategory('familiaritySummary', summaryData.data["How familiar are you with EEG-fMRI in epilepsy?"]);
        renderCategory('excitedSummary', summaryData.data["Tell us what you are mainly excited to learn about"]);
        renderCategory('challengesSummary', summaryData.data["What do you see as the main challenges in using EEG-fMRI for epilepsy?"]);
        
        // Add decorative markers to each category
        document.querySelectorAll('.interest-category').forEach(category => {
            const marker = document.createElement('div');
            marker.className = 'interest-category-marker';
            category.insertBefore(marker, category.firstChild);
        });
        
        // Add scroll animation with Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.interest-category').forEach(category => {
            observer.observe(category);
        });
        
    } catch (error) {
        console.error('Error loading interest summary:', error);
    }
}

// Load charts when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInterestSummary);
} else {
    loadInterestSummary();
}
