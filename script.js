document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    // --- 1.5 Three.js Procedural 3D Background ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.position.setZ(30);

        // Procedural Geometry (Abstract 3D Shape)
        const geometry = new THREE.TorusKnotGeometry(12, 3, 120, 20);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x3b82f6, 
            wireframe: true,
            emissive: 0x1e3a8a,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.15 
        });
        const torus = new THREE.Mesh(geometry, material);
        scene.add(torus);

        // Lighting
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(20, 20, 20);
        scene.add(pointLight, new THREE.AmbientLight(0xffffff, 0.8));

        // Responsive Resizing
        window.addEventListener('resize', () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        });

        // SCROLL to ROTATE logic!
        window.addEventListener('scroll', () => {
            const scrollDist = window.scrollY;
            torus.rotation.x = scrollDist * -0.001;
            torus.rotation.y = scrollDist * -0.002;
            torus.rotation.z = scrollDist * -0.001;
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        // Prevent scrolling on body when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- 3. Scroll Animations (AOS) ---
    // Map our existing custom classes to AOS attributes
    document.querySelectorAll('.fade-in').forEach(el => el.setAttribute('data-aos', 'fade-up'));
    document.querySelectorAll('.fade-in-up').forEach(el => el.setAttribute('data-aos', 'fade-up'));
    document.querySelectorAll('.fade-in-left').forEach(el => el.setAttribute('data-aos', 'fade-right'));

    // Initialize AOS Library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            offset: 50
        });
    }

    // --- 4. Google Form Submission ---
    const contactForm = document.getElementById('contactForm');
    const successPopup = document.getElementById('successPopup');
    const closePopupBtn = document.getElementById('closePopupBtn');
    
    // Popup Close Handlers
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            successPopup.classList.remove('active');
        });
    }
    if (successPopup) {
        successPopup.addEventListener('click', (e) => {
            if (e.target === successPopup) {
                successPopup.classList.remove('active');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // UI Update for sending state
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            // Fetch to Google Forms
            fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSf9-6y8Sz6baERy8y4DKfOe1mhVud1KiTtb7UsmHcImbx2I2Q/formResponse', {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).then(() => {
                // Show Popup
                if (successPopup) {
                    successPopup.classList.add('active');
                }
                
                // Clear form & Revert button
                contactForm.reset();
                btn.textContent = originalText;
                btn.style.background = '';
                btn.style.opacity = '1';
                btn.disabled = false;
                
            }).catch((err) => {
                console.error('Error:', err);
                btn.textContent = 'Error Sending Message';
                btn.style.background = 'red';
                btn.style.opacity = '1';
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }
});
