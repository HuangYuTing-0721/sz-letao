/**
 *
 * Created by Ting on 2017/11/10.
 */
$(function(){
    var currentPage = 1;
    var pageSize = 5;
    function render(){
        $.ajax({
            url:"/category/queryTopCategoryPaging",
            type:"get",
            data:{
                page:currentPage,
                pageSize: pageSize
            },
            success:function(data){
                //console.log(data);
                $("tbody").html( template("first-tmp",data));

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

    /*点击添加按钮*/
    $(".btn-add").on("click",function(){
        $("#firstModal").modal("show");
    })

    /*校验表单*/
    var $form = $("form");
    $form.bootstrapValidator({
        /*小图标*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*校验规则*/
        fields:{
            categoryName:{
                validators:{
                    /*非空*/
                    notEmpty:{
                        message:"请输入一级分类"
                    }
                }
            }
        }
    })

    /*表单校验成功之后注册事件*/
    $form.on("success.form.bv",function(e){
        /*阻止事件的默认行为*/
        e.preventDefault();
        /*关掉模态框*/
        $("#firstModal").modal("hide");
        /*发送ajax*/
        $.ajax({
            url:"/category/addTopCategory",
            type:"post",
            data: $form.serialize(),
            success:function(data){
                //console.log(data);
                if(data.success){
                    currentPage = 1;
                    render();
                }
                /*重置表单*/
                $form[0].reset();
                /*重置表单*/
                $form.data("bootstrapValidator").resetForm();
            }
        })

    })

    /*点击取消清除内容和表单*/
    $(".cancel").on("click",function(){
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();
    })
})
