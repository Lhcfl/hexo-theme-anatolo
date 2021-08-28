var visitors_path = window.location.pathname
var visitors_title = $(".post-title h3 a").text()

$(".leancloud_visitors").html('<i class="fa fa-thermometer"></i><em class="post-meta-item-text">热度</em><i class="leancloud-visitors-count"></i></span>')
$(".leancloud_visitors").attr('id',visitors_path)
$(".leancloud_visitors").attr('data-flag-title',visitors_title)