// Handle pagination
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination button');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to top of blog section
            document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupPagination();
    
    console.log('Blog loaded successfully');
});