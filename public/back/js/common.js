// 进度条
NProgress.configure({ showSpinner : false});
$(document).ajaxStart(function(){
    NProgress.start();
});
$(document).ajaxStop(function(){
    setTimeout(function(){
        NProgress.done();
    },1000);
});

//二级菜单显示隐藏
//prev() 取上一个元素
//next() 去下一个元素
//slideToggle() 高度变化，显示是从上到下变换，隐藏是从下到上
$(".classify").prev().on("click", function () {
    $(this).next().slideToggle();
});

// 侧边栏显示隐藏
$('.btn_menu').on("click",function(){
    $('.sidebar').toggleClass('now');
    $('.main').toggleClass('now');
})

// 点击退出框显示
$('.btn_logout').on("click",function(){
    $('#myModal').modal('show');
    $('.sure').off().on("click",function(){
        $.ajax({
            url:'/employee/employeeLogout',
            success:function(data){
                //console.log(data);
                if(data.success === true){
                    location.href='login.html';
                }
            }
        })
    })
})