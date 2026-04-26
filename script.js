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

        // Load Custom 3D Model: HOUSE.glb
        let loadedModel = null;
        if (THREE.GLTFLoader) {
            const loader = new THREE.GLTFLoader();
            loader.load('HOUSE.glb', function(gltf) {
                loadedModel = gltf.scene;
                
                // Set baseline scale and position
                loadedModel.scale.set(5, 5, 5); 
                loadedModel.position.set(0, -2, 0); 
                
                scene.add(loadedModel);
            }, undefined, function (error) {
                console.error('Error loading HOUSE.glb - if testing locally via file://, you must use a local server or test via GitHub pages!', error);
            });
        }

        // Lighting (Brighter for custom textured models)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        directionalLight.position.set(10, 20, 10);
        scene.add(directionalLight, new THREE.AmbientLight(0xffffff, 1.5));

        // Responsive Resizing
        window.addEventListener('resize', () => {
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        });

        // Clock for animations & time-based rotation
        const clock = new THREE.Clock();
        let scrollOffset = 0;

        // SCROLL to ROTATE logic (update offset target)
        window.addEventListener('scroll', () => {
            scrollOffset = window.scrollY * -0.002;
        });

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            
            if (loadedModel) {
                // Continuous Idle Base Rotation + Scroll Turntable Offset
                const idleSpin = clock.getElapsedTime() * 0.05; 
                loadedModel.rotation.y = idleSpin + scrollOffset;
            }

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
