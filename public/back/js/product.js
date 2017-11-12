/**
 * Created by Ting on 2017/11/12.
 */
$(function () {
    var Page = 1;
    var pageSize = 5;
    function render(){
        $.ajax({
            url:"/product/queryProductDetailList",
            type:"get",
            data:{
                page:Page,
                pageSize:pageSize
            },
            success:function(data){
                console.log(data);
                $("tbody").html(template("productTmp",data));

                /*分页*/
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:Page,
                    totalPages : Math.ceil(data.total / pageSize),
                    onPageClicked :function (a,b,c,page){
                        Page = page;
                        render();
                    }
                })
            }
        })
    };
    render();

    /*点击添加按钮*/
    $(".btn-add").on("click",function(){
        $("#productModal").modal("show");

        $.ajax({
            url:"/category/querySecondCategoryPaging",
            type:"get",
            data:{
                page:1,
                pageSize:100
            },
            success:function(data){
                $(".dropdown-menu").html(template("menuTmp",data));
            }
        })
    });
   /*点击下拉菜单的a标签注册事件 (委托事件)*/
    $(".dropdown-menu").on("click","a",function(){
        $(".dropdow-text").text($(this).text());
        $("#brandId").val($(this).data("id"));
        $form.data("bootstrapValidator").updateStatus("brandId","VALID");
    })

    /*校验表单*/
    $form = $("form");
    $form.bootstrapValidator({
        excluded:[],
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*校验规则*/
        fields:{
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入商品名称"
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            num:{
                validators:{
                    notEmpty:{
                        message:"请输入商品存库"
                    },
                    regexp:{
                        regexp: /^[1-9]\d*$/,
                        message: "请输入正确的数字"
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:"情输入商品的尺码"
                    },
                    regexp:{
                        regexp: /^\d{2}-\d{2}$/,
                        message:"请输入正确的尺码 (例如:40-50)"
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价"
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:" 请输入商品价格"
                    }
                }
            },
            productLogo:{
                validators:{
                    notEmpty:{
                        message:"请输如三张图片"
                    }
                }
            }
        }
    });

    $("#fileupload").fileupload({
        dataType : "json",
        done: function(e,data){
            if($(".img-box").find("img").length >= 3){
                return false;
            }

            $(".img-box").append('<img data-name="' + data.result.picName + '" data-src = "' + data.result.picAddr + '" src="'+data.result.picAddr+'" width="100" height="100" alt=""/>')

            /*图片校验*/
            if($(".img-box").find("img").length === 3){
                $form.data("bootstrapValidator").updateStatus('productLogo', "VALID")
            }else{
                $form.data("bootstrapValidator").updateStatus('productLogo', "INVALID")
            }

            /*删除图片*/
            $(".img-box").find("img").off().on("dblclick",function(){
                $(this).remove();
                if($(".img-box").find("img").length === 3){
                    $form.data("bootstrapValidator").updateStatus('productLogo', "VALID")
                }else{
                    $form.data("bootstrapValidator").updateStatus('productLogo', "INVALID")
                }
            });
        }
    });

    /*校验表单成功事件*/
    $form.on("success.form.bv",function(e){
        e.preventDefault();

        var data = $form.serialize();
        /*获取到img-box下的所有图片,获取picName和picAddr 拼接到data上*/
        var $img = $(".img-box img");

        data += "&picName1=" + $img[0].dataset.name + "&picAddr1=" + $img[0].dataset.src;
        data += "&picName2=" + $img[1].dataset.name + "&picAddr2=" + $img[1].dataset.src;
        data += "&picName3=" + $img[2].dataset.name + "&picAddr3=" + $img[2].dataset.src;

        $.ajax({
            url:"/product/addProduct",
            type:"post",
            data:data,
            success:function(data){
                if(data.success){
                    $("#productModal").modal("hide");
                    Page = 1;
                    render();

                    /*重置*/
                    $form[0].reset();
                    $form.data("bootstrapValidator").resetForm();

                    $(".dropdown-text").text("请选择二级分类");
                    $("#brandId").val('');
                    $(".img-box img").remove();
                    $("#productLogo").val('');
                }
            }
        })
    })

    /*点击退出重置表单*/
    $(".cancel").on("click",function(){
        /*重置*/
        $form[0].reset();
        $form.data("bootstrapValidator").resetForm();

        $(".dropdown-text").text("请选择二级分类");
        $("#brandId").val('');
        $(".img-box img").remove();
        $("#productLogo").val('');
    })

});
