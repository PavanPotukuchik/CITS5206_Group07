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
});