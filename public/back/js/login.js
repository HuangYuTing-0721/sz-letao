/**
 * Created by Ting on 2017/11/8.
 */
$(function(){
    /*
    * 登录表单校验
    * 1. 用户名不能为空
    * 2. 密码不能为空
    * 3. 密码长度为6-12位
    * */

    // 获取表单
    var $form = $('form');

    // 调用bootstrapValidator 校验表单
    $form.bootstrapValidator({
        // 配置小图标
        feedbackIcons:{
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 规则
        fields:{
            username:{
                validators :{
                    notEmpty:{
                        message : "用户名不能为空"
                    },
                    callback:{
                        message: "用户名错误"
                    }
                }
            },
            password : {
                validators: {
                    notEmpty:{
                        message: "密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max: 12,
                        message: "密码的长度为2-16位"
                    },
                    callback: {
                        message : "密码错误"
                    }
                }
            }
        }
    });

    // 给表单注册一个校验成功事件
    $form.on("success.form.bv",function(e){
        // 阻止默认行为
        e.preventDefault();

        $.ajax({
            type:"POST",
            url:"/employee/employeeLogin",
            data: $form.serialize(),
            success:function(data){
                console.log(data);
                if(data.success){
                    location.href = 'index.html'
                }
                if(data.error === 1000){

                    $form.data("bootstrapValidator").updateStatus("username","INVALID", "callback");
                    console.log("用户名错误！");
                }
                if(data.error === 1001){

                    $form.data("bootstrapValidator").updateStatus("password","INVALID","callback");
                    console.log("密码错误！");
                }
            }
        })
    })

    // 表单重置
    $("[type='reset']").on("click",function(){
        // 获取到validator对象，调用resetForm方法
        $form.data("bootstrapValidator").resetForm();
    })
})