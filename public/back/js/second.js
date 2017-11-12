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
                //console.log(data);
                $(".dropdown-menu").html(template("dropdown-tmp",data));
            }
        })
    });

    // 给下拉框中的a标签版绑定事件(委托事件)
    $(".dropdown-menu").on("click","a",function(){
        $(".dropdow-text").text($(this).text());
        /*修改input的value,获取到自定义属性id*/
        $("#categoryId").val($(this).data("id"));
        /*点击了手动校验成功*/
        $form.data("bootstrapValidator").updateStatus("categoryId", "VALID");

    });

    /*初始化上传文件*/
    $('#fileupload').fileupload({
        dataType: "json",
        done: function (e, data) {
           //console.log("12313");
           //console.log(data);
            //console.log(data.result.picAddr);
            $(".img-box img").attr("src",data.result.picAddr);
            $("#boandLogo").val(data.result.picAddr);

            $form.data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });
    /*校验表单*/
    var $form = $("form");
    $form.bootstrapValidator({
        /*设置不校验的内容,所有都校验*/
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message :"请选择一级分类"
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message :"请选择二级分类名称"
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message :"请上传图片"
                    }
                }
            }
        }
    });

    //注册表单校验成功事件
    $form.on("success.form.bv",function(e){
        e.preventDefault();

        $.ajax({
            url:"/category/addSecondCategory",
            type:"post",
            data:$form.serialize(),
            success:function(data){
                $("#secondModal").modal("hide");
                currentPage = 1;
                render();

                // 清除内容
                $form[0].reset();
                $form.data("bootstrapValidator").resetForm();
                $(".dropdow-text").text("请选择一级分类");
                $(".img-box img").attr("src","images/none.png");
                $("#categoryId").val("");
                $("#brandLogo").val();
            }
        })
    })

    // 点击取消 清除模态框的内容和校验
    $(".cancel").on("click",function(){
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
        $(".dropdow-text").text("请选择一级分类");
        $(".img-box img").attr("src","images/none.png");
        $("#categoryId").val("");
        $("#brandLogo").val();
    })
})