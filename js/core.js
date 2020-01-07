var issuesList;
var issuesHTML;

$(document).ready(function() {
    var webURL = window.location.href;
    var splitFlag = "http://";
    if (webURL.substring(0, 5) == "https") {
        splitFlag = "https://";
    }
    var user = webURL.split(splitFlag)[1].split(".")[0];
    user = 'liukaida';  // 本行为调试用，如果提交到github，请注释掉本行
    // blogListURL = 'https://api.github.com/repos/' + user + '/' + user + '.github.io/contents/blog';
    // issuesList = 'https://api.github.com/repos/' + user + '/' + user + '.github.io/issues';
    // issuesHTML = 'https://github.com/' + user + '/' + user + '.github.io/issues'
    // readmeURL = 'https://raw.githubusercontent.com/' + user + '/' + user + '.github.io/master/About Me.md';
    
    // use liukaida api path
    blogListURL = 'https://api.github.com/repos/' + user + '/TinyBlog/contents/blog';
    issuesList = 'https://api.github.com/repos/' + user + '/TinyBlog/issues';
    issuesHTML = 'https://github.com/' + user + '/TinyBlog/issues';
    readmeURL = 'https://raw.githubusercontent.com/' + user + '/TinyBlog/master/AboutMe.md';
    aboutmeURL = 'https://api.github.com/repos/' + user + '/TinyBlog/contents/AboutMe.md?ref=master';


    $("#header").text(user + "'s Blog");
    $("#commentsList").removeAttr('data_comments_url');
    $("#tips").html("我们不会获取您的用户名和密码,评论直接通过 HTTPS 与 Github API交互,<br>如果您开启了两步验证,请在博客的<a  target=\"_blank\" href=\"" + issuesHTML + "\">Github issues</a>下添加 Comment");

    var titleString = getTitleString();

    //set Blog list
        $.getJSON(blogListURL, function(json) {
        for (var i = 0; i < json.length; i++) {
            var name = json[i].name; // Blog title
            var blogURL = json[i].download_url; //Blog Raw Url
            var contentURL = json[i].url; //Blog Raw Url
            // add blog list elements
            var new_li = $("<li></li>");
            var new_a = $("<a></a>")

            var type = json[i].type;
            // delete '.md'
            if (name.substr(-3, 3) == ".md") {
                name = name.substr(0, name.length - 3);
                type = "markdown";
            } else if (name.substr(-5, 5) == ".html") {
                name = name.substr(0, name.length - 5);
                type = "html";
            }

            if (type == "dir"){
                name = "+" + name;
            }
            // console.log(name);
            console.log(type);
            // console.log(titleString);
            if (name == titleString) {
                $("#title").text(name);
                readmeURL = blogURL;
            }

            new_a.text(name);
            //update content
            new_a.attr("data_blogURL", blogURL);
            new_a.attr("data_name", name);
            //new_a.attr("href", "?title=" + name);
            new_a.attr("href", "#");
            new_a.attr("data_type", type);
            new_a.attr("data_contentURL", contentURL);
            new_a.attr("onclick", "setBlogTxt(this)");
            new_li.append(new_a);
            $('#nav').append(new_li);
            $('#nav2').append(new_li.clone());



        }


        //set readme
        $.get(aboutmeURL, function(result) {
            $("#title").show();
            $("#article").html("");

            // base64转码
            var base64 = new Base64();
            var file_content = base64.decode(result.content);

            testEditormdView = editormd.markdownToHTML("article", {
                markdown: file_content, //+ "\r\n" + $("#append-test").text(),
                // htmlDecode: true, // 开启 HTML 标签解析，为了安全性，默认不开启
                htmlDecode: "style,script,iframe", // you can filter tags decode
                //toc             : false,
                tocm: true, // Using [TOCM]
                //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
                //gfm             : false,
                //tocDropdown     : true,
                // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                emoji: true,
                taskList: true,
                tex: true, // 默认不解析
                flowChart: true, // 默认不解析
                sequenceDiagram: true, // 默认不解析
            });



        });
    });




})

function collapseDir(obj){
    obj = $(obj);
    var new_obj_text = "+" + obj.text().substr(1, obj.text().length);
    obj.text(new_obj_text);
    obj.attr("data_name", new_obj_text);
    obj.attr("onclick", "setBlogTxt(this)");
    obj.nextAll().remove();

}

function setBlogTxt(obj) {

    // 隐藏Button
    if (!$('#btnNav').is(':hidden')) {
        $('#btnNav').click();
    }

    obj = $(obj);
    var blogName = obj.attr("data_name");
    var blogURL = obj.attr("data_blogURL");
    var contentURL = obj.attr("data_contentURL");
    var type = obj.attr("data_type");
    $("#title").text(blogName);
    $("#article").html("loading . . .");

    // set blog content
    if (contentURL != "" && (type == "markdown" || type == "html")) {
        // add by liukai ,有时候因为国内原因，直接获取不到文件的raw，改为通过接口获取
        $.get(contentURL, function (result) {
            $("#title").show();
            if (type == "markdown") {

                $("#article").html("");

                // base64转码
                var base64 = new Base64();
                var file_content = base64.decode(result.content);

                testEditormdView = editormd.markdownToHTML("article", {
                    markdown: file_content, //+ "\r\n" + $("#append-test").text(),
                    // htmlDecode: true, // 开启 HTML 标签解析，为了安全性，默认不开启
                    htmlDecode: "style,script,iframe", // you can filter tags decode
                    //toc             : false,
                    tocm: true, // Using [TOCM]
                    //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
                    //gfm             : false,
                    //tocDropdown     : true,
                    // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                    emoji: true,
                    taskList: true,
                    tex: true, // 默认不解析
                    flowChart: true, // 默认不解析
                    sequenceDiagram: true, // 默认不解析
                });

            } else {
                $("#title").hide();
                $("#article").html(result);
            }

        });
    }else if (contentURL != "" && type == "dir") {
        // 如果点击的是目录，则展开子目录
        $("#article").html("请选择目录内文章");

        $.getJSON(contentURL, function(json) {
            var new_ul = $("<ul class=\"nav nav-sidebar\" id=\"nav\"></ul>");

            for (var i = 0; i < json.length; i++) {
                var name = json[i].name; // Blog title
                var blogURL = json[i].download_url; //Blog Raw Url
                var contentURL = json[i].url; //Blog Raw Url
                // add blog list elements
                var new_li = $("<li></li>");
                var new_a = $("<a></a>")

                var type = json[i].type;
                // delete '.md'
                if (name.substr(-3, 3) == ".md") {
                    name = name.substr(0, name.length - 3);
                    type = "markdown";
                } else if (name.substr(-5, 5) == ".html") {
                    name = name.substr(0, name.length - 5);
                    type = "html";
                }

                if (type == "dir"){
                    name = "+" + name;
                }
                // console.log(name);
                console.log(type);
                // console.log(titleString);
                // if (name == titleString) {
                //     $("#title").text(name);
                //     readmeURL = blogURL;
                // }

                new_a.text(name);
                //update content
                new_a.attr("data_blogURL", blogURL);
                new_a.attr("data_name", name);
                //new_a.attr("href", "?title=" + name);
                new_a.attr("href", "#");
                new_a.attr("data_type", type);
                new_a.attr("data_contentURL", contentURL);
                new_a.attr("onclick", "setBlogTxt(this)");
                new_li.append(new_a);
                new_ul.append(new_li.clone());

            }

            // 展开文件夹，并禁止文件夹点击了。后续可以优化成点击后收起来！
            var new_obj_text = "-" + obj.text().substr(1, obj.text().length);
            obj.text(new_obj_text);
            obj.attr("data_name", new_obj_text);
            obj.attr("onclick", "collapseDir(this)");  // 再次点击的话收起来
            // console.log(new_li)
            // $('#nav2').append(new_li.clone());

            obj.after(new_ul.clone());

        });


    }else {
        $.get(blogURL, function(result) {
            $("#title").show();
            if (type == "markdown") {

                $("#article").html("");

                testEditormdView = editormd.markdownToHTML("article", {
                    markdown: result, //+ "\r\n" + $("#append-test").text(),
                    // htmlDecode: true, // 开启 HTML 标签解析，为了安全性，默认不开启
                    htmlDecode: "style,script,iframe", // you can filter tags decode
                    //toc             : false,
                    tocm: true, // Using [TOCM]
                    //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
                    //gfm             : false,
                    //tocDropdown     : true,
                    // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
                    emoji: true,
                    taskList: true,
                    tex: true, // 默认不解析
                    flowChart: true, // 默认不解析
                    sequenceDiagram: true, // 默认不解析
                });

            } else {
                $("#title").hide();
                $("#article").html(result);
            }

        });
    }





    //get comments_url
    setCommentURL(issuesList, blogName);


}

function setCommentURL(issuesList, blogName) {
    $("#comments").show();
    console.log("获取并设置评论区");


    $.ajax({
        type: "GET",
        url: issuesList,
        dataType: 'json',
        async: false,
        success: function(json) {
            for (var i = 0; i < json.length; i++) {
                var title = json[i].title; // Blog title
                var comments_url = json[i].comments_url;
                if (title == blogName) {
                    console.log("该文章存在评论")
                    $('#commentsList').attr("data_comments_url", comments_url);
                    setComment(comments_url);
                    break;
                }
                $("#commentsList").children().remove();
                $("#commentsList").removeAttr('data_comments_url');

            }
        }
    });


}



function setComment(commentURL) {
    $('#commentsList').children().remove();

    $.getJSON(commentURL, function(json) {
        for (var i = 0; i < json.length; i++) {
            var avatar_url = json[i].user.avatar_url; // avatar_url
            var user = json[i].user.login;
            //var updated_at = json[i].updated_at;
            var updated_at = new Date(json[i].updated_at).toLocaleString();
            var body = json[i].body;

            // add blog list elements
            var commentHtml =
                "<li class=\"comment\">" +
                "<a class=\"pull-left\" href=\"#\"><img class=\"avatar\" src=\"" + avatar_url +
                "\" alt=\"avatar\"></a><div class=\"comment-body\"><div class=\"comment-heading\"><h4 class=\"user\">" + user +
                "</h4><h5 class=\"time\">" + updated_at +
                "</h5></div><p>" + body +
                "</p></div></li>";

            var new_obj = $(commentHtml);
            $('#commentsList').append(new_obj);

        }
    });

}

function login() {
    $('#myModal').modal();
}

function subComment() {

    var USERNAME = $("#txt_username").val();
    var PASSWORD = document.getElementById("txt_password").value; //
    var title = null;
    title = $("#title").text();
    // 未开启评论
    if (typeof($("#commentsList").attr("data_comments_url")) == "undefined") {
        if (title == undefined || title == null || title == "") {
            return;
        }

        var createIssueJson = "{\"title\": \"" + title + "\"}";
        console.log(createIssueJson);
        $.ajax({
            type: "POST",
            url: issuesList,
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            data: createIssueJson,
            success: function() {
                console.log('开启评论成功:' + title);
                //重新遍历issue list
                setCommentURL(issuesList, title);
                console.log('重新遍历 issuesList 完成');

            }
        });
    }
    console.log("准备提交评论");
    // 已开启评论
    if (typeof($("#commentsList").attr("data_comments_url")) != "undefined") {
        var issueURL = $("#commentsList").attr("data_comments_url");
        var comment = $("#comment_txt").val();
        var commentJson = "{\"body\": \"" + comment + "\"}";
        console.log(comment);
        if (comment == "") {
            alert("评论不能为空");
            return;
        }

        $.ajax({
            type: "POST",
            url: issueURL,
            dataType: 'json',
            async: false,
            headers: {
                "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
            },
            data: commentJson,
            success: function() {
                console.log('评论成功');

                // 更新评论区
                if (title != null) {
                    setCommentURL(issuesList, title);
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("账号密码错误,或者开启了两步验证");
            }
        });
    } else {
        console.log("未开启评论")
    }
}


function getTitleString() {
    var reg = new RegExp("(^|&)" + "title" + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
