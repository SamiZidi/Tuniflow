
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

// Bootstrap
loadScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/js/bootstrap.bundle.min.js", function() {
    console.log("Bootstrap loaded");
});

// AOS
loadScript("https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js", function() {
    console.log("AOS loaded");
    AOS.init({ duration: 800, once: true, offset: 100 });
});

        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        function toggleMenu() {
            document.body.classList.toggle('menu-open');
        }

        // Language switcher
        document.addEventListener('DOMContentLoaded', function() {
            const langButtons = document.querySelectorAll('.lang-btn');
            
            langButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.getAttribute('data-lang');
                    
                    langButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (lang === 'ar') {
                        window.location.href = '/arabic.html';
                    } else {
                        window.location.href = '/';
                    }
                });
            });
        });

        // FAQ accordion
        document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                
                question.addEventListener('click', () => {
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    item.classList.toggle('active');
                });
            });
        });

        // Contact form submission
            document.getElementById("contactForm").addEventListener("submit", async function(e) {
            e.preventDefault();

            const data = new FormData(this);
            const part1 = "https://formspree.io/f/";
            const part2 = "mrbnrrlr";

            const res = await fetch(part1 + part2, {
                method: "POST",
                body: data
            });

            if (res.ok) {
                alert("Message sent!");
                this.reset();
            } else {
                alert("Error sending message.");
            }
            });
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (document.body.classList.contains('menu-open')) {
                        toggleMenu();
                    }
                }
            });
        });
