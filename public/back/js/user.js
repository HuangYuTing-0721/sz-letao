/**
 * Created by Ting on 2017/11/10.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 5;

    function render(){
        $.ajax({
            url : '/user/queryUser',
            type: 'get',
            data:{
                page : currentPage,
                pageSize : pageSize
            },
            success : function(data){
                //console.log(data);
                var html = template('tmp',data);
                $("tbody").html(html);

                /*分页的初始化*/
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion :3, // 指定bootstrap的版本，如果是3，必须指定
                    currentPage:currentPage,//当前页面
                    totalPages:Math.ceil(data.total/pageSize),//总页数
                    onPageClicked:function(a,b,c,page){
                        currentPage = page;
                        render();
                    }
                })
            }
        });
    }
    render();

    // 禁用启用功能
    $("tbody").on("click",".btn",function(){
        $("#userModal").modal("show");
        var id = $(this).parent().data("id");
        //console.log(id);
        var isDelete = $(this).hasClass("btn-danger")?0:1;
        //console.log(isDelete);
        $(".btn_edit").off().on("click",function(){
            $.ajax({
                type:"POST",
                url:"/user/updateUser",
                data:{
                    id:id,
                    isDelete:isDelete
                },
                success:function(data){
                    //console.log(data);
                    if(data.success){
                        $("#userModal").modal("hide");
                        //console.log("hjji");
                        render();
                    }
                }
            })
        })
    });
});
