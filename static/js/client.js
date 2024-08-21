$(document).ready(function() {
    $(".menu > ul > li").click(function (e) {
        e.stopPropagation();
        $(this).siblings().removeClass("active").find("ul").slideUp();
        $(this).toggleClass("active").find("ul").slideToggle();
    });

    $(".menu-btn").click(function () {
        $(".sidebar").toggleClass("active");
        $(".main-content").toggleClass("sidebar-collapsed");
    });

    const authData = localStorage.getItem('client_auth');
    if (!authData) {
        window.location.href = 'login.html';
    }

    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('client_auth');
        window.location.href = '/login';
    });
});
