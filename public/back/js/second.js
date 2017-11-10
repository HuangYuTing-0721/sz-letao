/**
 * Created by Ting on 2017/11/10.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 5;
    function render(){
        $.ajax({
            url:"/category/querySecondCategoryPaging",
            type:"GET",
            data:{
                page:currentPage,
                pageSize: pageSize
            },
            success:function(data){
                //console.log(data);
                $("tbody").html( template("second-tmp",data));

                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion :3, // 指定bootstrap的版本，如果是3，必须指定
                    currentPage:currentPage,//当前页面
                    totalPages:Math.ceil(data.total/pageSize),//总页数
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }

        })
    }
    render();

    // 点击添加按钮
    $(".btn-add").on("click",function(){
        $("#secondModal").modal("show");
        $.ajax({
            url:"/category/queryTopCategoryPaging",
            type:"get",
            data:{
                page:currentPage,
                pageSize:100
            },
            success:function(data){
                console.log(data);
                $(".dropdown-menu").html(template("dropdown-tmp",data));
            }
        })
    });

    // 给下拉框中的a标签版绑定事件(委托事件)
    $(".dropdown-menu").on("click","a",function(){
        $(".dropdow-text").text($(this).text());
        /*修改input的value,获取到自定义属性id*/
        $("#categoryId").val($(this).data("id"));
    })
})