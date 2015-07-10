cordova.define("plugins.utils", function(require, exports, module) {
    "use strict";
	var exec = require('cordova/exec'); 
	var CLASS = "UtilsPlugin";
	module.exports = {  
		/** 
		 * exec一共5个参数 
		   第一个 :成功会掉 
		   第二个 :失败回调 
		   第三个 :将要调用的类的配置名字(config.xml文件中指定的<feature name>) 
		   第四个 :调用的方法名(android中对已的action) 
		   第五个 :传递的参数  以json的格式 (android中对已的args)
		 */
		callNumber: function(number) {
			app.toast('桌面客户端不支持拨打电话');
		},
		sendSms: function(number) {
			app.toast('桌面客户端不支持发送短信');
		},
        getLocalValue: function(tag, success) {
            success(localStorage.getItem(tag));
        },
        setLocalValue: function(tag, value) {
            localStorage.setItem(tag, value);
        },
        exitApp: function() {
            navigator.app.exitApp();
        },
        restart: function() {
            window.location.reload();
        },
        toast: function(message, timeout) {
            var context = $('#afui').parent();
            var id = "jfbToastMessage";
            timeout = timeout||1000;

            $("#"+id).remove();
            var msgDIV = new Array();
            msgDIV.push('<div id="'+id+'">');
            msgDIV.push('<span>'+message+'</span>');
            msgDIV.push('</div>');
            var msgEntity = $(msgDIV.join('')).appendTo(context);
            var span = msgEntity.find('span')[0];

            var left = context.width()*0.5-span.offsetWidth*0.55+"px";
            var bottom = span.offsetHeight+"px";
            msgEntity.css({position:'absolute','z-index':'2000000',bottom:bottom,left:left,'background-color':'black',color:'white','font-size':'18px',padding:'10px',margin:'10px', 'border-radius':'5px'});

            var actions = new $.css3AnimateQueue();
            actions.push({ id: id,opacity: 0, time: "0ms",previous: true});
            actions.push({ id: id,opacity: 1, time: "200ms",previous: true});
            actions.push({ id: id,opacity: 1, time: timeout+"ms",previous: true});
            actions.push({ id: id,opacity: 0, time: "600ms",previous: true});
            actions.push(function(){msgEntity.remove()});
            actions.run();
        },
        setupAudio: function() {
            $('body').append('<audio id="audio_sound" style="display:none"></audio>');
            $('body').append('<audio id="audio_ring" style="display:none" loop></audio>');
            //$('body').append('<audio id="audio_music" style="display:none"></audio>');
        },
        setupFileChooser: function() {
            $('body').append('<a id="file_download" style="display: none">download</a>');
            $('body').append('<input id="file_reader" type="file" style="display: none">');
        },
        saveasFile: function(name, src) {
            var el = $("#file_download");
            el.attr("download", name);
            el.attr("href", src);
            el.click();
        },
        readFile: function(success) {
            var el = $("#file_reader");
            el.unbind("change").bind("change", function(evt) {
                var file = this.files[0];
                var reader = new FileReader();
                reader.onload = (function(f) {
                    return function(e) {
                        var data = this.result.replace(/data:.*;base64,/, '');
                        success(f.name, data);
                    };
                })(file);
                reader.onerror = function() {
                    success();
                };
                reader.readAsDataURL(file);
            }, false);
            el.click();
        },
        getAppInfo: function(success) {
            success({
                documentPath: "./",
                mainVersion: app.info.mainVersion,
                maxVersion: app.info.maxVersion,
                minVersion: app.info.minVersion
            });
        }
    };
});

