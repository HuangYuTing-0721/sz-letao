/**
 * Created by Ting on 2017/11/12.
 */
$(function(){
    //发送ajax请求，获取一级分类的数据
    $.ajax({
        url:"/category/queryTopCategory",
        type:"get",
        success:function(data){
            $(".lt_category_l .mui-scroll").html(template("tmp1",data));

            //渲染完一级分类后，渲染二级分类（默认渲染data.rows[0]）
            renderSecond(data.rows[0].id);
        }
    });
    //渲染哪个一级分类下的二级分类
    function renderSecond(id){
        $.ajax({
            url:"/category/querySecondCategory",
            data:{
                id:id
            },
            success:function(data){
                console.log(data);
                $(".lt_category_r .mui-scroll").html(template("tmp2",data));

            }
        })
    }

    /*给一级分类下的所有li标签注册委托事件*/
    $(".lt_category_l").on("click","li",function(){
        $(this).addClass("now").siblings().removeClass("now");
        var id = $(this).data("id");
        renderSecond(id);

        /*滚动到顶部*/
        //
        var temp = mui('.mui-scroll-wrapper').scroll()[1];
        temp.scrollTo(0,0,500);//500毫秒滚动到顶
    })

})