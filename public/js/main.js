const socket = io();

socket.on('connect', () => {
    console.log('Connected to server via Socket.IO');
});

function toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) {
        sidebar.classList.toggle('active');
        sidebar.classList.toggle('show');
    }
    if (overlay) {
        overlay.classList.toggle('active');
        overlay.classList.toggle('show');
    }
}

function toggleDesktopSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const mainContent = document.getElementById('mainContent');
    if (sidebar) sidebar.classList.toggle('collapsed');
    if (mainContent) mainContent.classList.toggle('expanded');
}

// Close mobile sidebar when clicking outside on mobile
document.addEventListener('click', function (event) {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (window.innerWidth <= 992) {
        if (overlay && overlay.contains(event.target)) {
            sidebar.classList.remove('active');
            sidebar.classList.remove('show');
            overlay.classList.remove('active');
            overlay.classList.remove('show');
        }
    }
});

// Real-time updates handler (can be expanded based on app needs)
socket.on('payment_updated', (data) => {
    // Logic to update UI without refresh if on relevant page
    // This is already handled in specific EJS files if they have listeners
});
