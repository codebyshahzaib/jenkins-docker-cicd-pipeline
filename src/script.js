document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('test-deploy-btn');
    const msg = document.getElementById('feedback-msg');

    btn.addEventListener('click', () => {
        // Button press animation effect
        btn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            btn.style.transform = 'translateY(-2px)';
            
            // Show the success feedback message
            msg.classList.remove('hidden');
            
            // Change button state
            btn.textContent = 'Verified! ✨';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.boxShadow = '0 15px 25px -10px #10b981';
            
            // Reset after 3 seconds
            setTimeout(() => {
                msg.classList.add('hidden');
                btn.textContent = 'Verify Interaction';
                btn.style.background = '';
                btn.style.boxShadow = '';
            }, 3000);
            
        }, 150);
    });
});
