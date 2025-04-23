(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })

    // Responsive behavior enhancements
    document.addEventListener('DOMContentLoaded', function () {
        // Auto-collapse navbar when clicking on a link in mobile view
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768 && navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });

        // Adjust filter items based on screen width
        const adjustFilters = () => {
            const filterItems = document.querySelectorAll('.filter-item');
            if (window.innerWidth < 576) {
                // Show only 4 filters on very small screens
                filterItems.forEach((item, index) => {
                    if (index < 4) {
                        item.classList.remove('d-none');
                        item.classList.add('d-block');
                    } else {
                        item.classList.add('d-none');
                        item.classList.remove('d-block');
                    }
                });
            } else if (window.innerWidth < 768) {
                // Show only 6 filters on medium-small screens
                filterItems.forEach((item, index) => {
                    if (index < 6) {
                        item.classList.remove('d-none');
                        item.classList.add('d-block');
                    } else {
                        item.classList.add('d-none');
                        item.classList.remove('d-block');
                    }
                });
            }
        };

        // Call on load and resize
        adjustFilters();
        window.addEventListener('resize', adjustFilters);

        // Add smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    });

    // Share functionality tracking
    document.addEventListener('DOMContentLoaded', function () {
        // Get all share buttons
        const shareLinks = document.querySelectorAll('.share-dropdown .dropdown-item');

        // Add click event listener to each button
        shareLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                // Get the platform being shared to
                const platform = this.textContent.trim();

                // For demonstration purposes, log to console
                // In a real app, you might want to send this to your analytics
                console.log(`Shared to ${platform}`);

                // Optional: Show a toast notification
                showToast(`Shared to ${platform}!`);
            });
        });

        // Function to show toast notification
        function showToast(message) {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'position-fixed bottom-0 end-0 p-3';
            toast.style.zIndex = '11';

            toast.innerHTML = `
                <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="toast-header">
                        <strong class="me-auto">Wanderlust</strong>
                        <small>Just now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">
                        ${message}
                    </div>
                </div>
            `;

            // Add to document
            document.body.appendChild(toast);

            // Remove after 3 seconds
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        }
    });

    // Auto-dismiss flash messages after 5 seconds
    document.addEventListener('DOMContentLoaded', function () {
        const alerts = document.querySelectorAll('.alert');

        alerts.forEach(alert => {
            setTimeout(() => {
                // Use Bootstrap's dismiss method
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }, 5000); // 5 seconds
        });
    });
})()
