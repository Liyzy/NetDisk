/*----------------------------------------------------
[ 点击上传，显示或隐藏 选择文件/文件夹 ]
 */
function controlUploadChoices() {
    let typeChoose = $('#typeChooseDiv');
    let uploadControl = $('#uploadControl');
    // 根据是否可见进行状态转换
    if (typeChoose.hasClass('display-none')) {
        typeChoose.removeClass('display-none');
        uploadControl.addClass('element-onfocus');
    } else {
        typeChoose.addClass('display-none');
        uploadControl.removeClass('element-onfocus');
    }
}

/*----------------------------------------------------
[ 加密、解密 ]
 */
function encrypt(str, key) {
    key = CryptoJS.enc.Utf8.parse(key ? key : "1111111111111111");// 秘钥
    var iv = CryptoJS.enc.Utf8.parse('1234567890123412');//向量iv
    var encrypted = CryptoJS.AES.encrypt(str, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
}

function decrypt(str) {
    var key = CryptoJS.enc.Utf8.parse("1111111111111111");// 秘钥
    var iv = CryptoJS.enc.Utf8.parse('1234567890123412');//向量iv
    var decrypted = CryptoJS.AES.decrypt(str, key, {iv: iv, padding: CryptoJS.pad.ZeroPadding});
    return decrypted.toString(CryptoJS.enc.Utf8);
}

/*----------------------------------------------------
[ 文件上传 ]
 */
function uploadFile() {
    // 显示上传信息窗口
    let uploadDiv = $('#upload-window');
    uploadDiv.removeClass('display-none');

    // 添加选择的文件信息
    addUploadItem();

    let fileList = document.getElementById('fileInput').files;

    // 计算文件md5

    // 上传
    upload.upload(fileList[0]);
    console.log(upload.upload(fileList[0]));

    /* 读取文件太大问题 */
    // const files = document.getElementById('fileInput').files;
    // // 获取文件信息
    // for (let i = 0; i < files.length; i++) {
    //     let fileName = files[i].name;      // 文件名
    //     let fileSize = files[i].size;      // 文件大小 单位：B
    //     let fileType = files[i].type;      // 文件类型 比如：application/pdf image/jpeg text/plain
    //     let fileUploadTime = new Date();   // 上传时间 当前操作时间
    //     // 读取文件内容
    //     var reader = new FileReader();
    //     reader.readAsArrayBuffer(files[i]);  // 二进制读取
    //     reader.onload = function() {  // onload成功读取文件后调用
    //         var data = this.result;        // 文件内容
    //         $.ajax({
    //             url:'http://10.6.34.221:8000/bpcloud/upload/',
    //             method: 'post',
    //             data: {
    //                 "fileName": fileName,
    //                 "fileSize": fileSize,
    //                 "fileType": fileType,
    //                 "fileUploadTime": fileUploadTime,
    //                 "data": data,
    //             },
    //         })
    //     };
    // }
    //
    // // for (let i = 0; i < fileJSONArray.length; i++) {
    // //     console.log(fileJSONArray[i].fileName, fileJSONArray[i].fileSize, fileJSONArray[i].fileType);
    // // }

    // 重置input，解决：两次选择同一个文件，事件不会调用的问题
    document.getElementById('fileInput').value = '';
}

/*----------------------------------------------------
[ 右键菜单 ]
 */
function rightClickMenu() {
    $('.contextmenu-able').contextmenu(function (e) {
        // 阻止默认的右键菜单出现
        e.preventDefault();

        // 显示自定义菜单
        let menu = $('.context-menu');
        menu.removeClass('display-none');

        // 定位
        menu.css({
            'top': e.pageY,
            'left': e.pageX,
        });

        // 右键勾选复选框
        $(this).find('input[type="checkbox"]').prop('checked', true);
        $(this).addClass('checkbox-checked');

        // 是否显示功能区
        showOrHideFunctionWrapper();
    });

    // 任意单击事件都会隐藏右键菜单
    document.onclick = function () {
        let menu = $('.context-menu');
        menu.addClass('display-none');
    };
}

/*-----------------------------------------------------
[ 上传信息控制 ]
 */

// 窗口最小化
function minimizeDiv() {
    let curDiv = $('#upload-window');
    curDiv.css('height', '30px');
    let maxBtn = $('#maximizeBtn');
    maxBtn.removeClass('display-none');
    let minBtn = $('#minimizeBtn');
    minBtn.addClass('display-none');
}

// 窗口还原
function maximizeDiv() {
    let curDiv = $('#upload-window');
    curDiv.css('height', '600px');
    let maxBtn = $('#maximizeBtn');
    maxBtn.addClass('display-none');
    let minBtn = $('#minimizeBtn');
    minBtn.removeClass('display-none');
}

// 关闭窗口
function closeDiv() {
    let curDiv = $('#upload-window');
    curDiv.addClass('display-none');
}

// 添加上传文件信息
function addUploadItem() {
    let files = $('#fileInput')[0].files;
    let uploadItemList = $('#upload-item-list');
    for (let i = 0; i < files.length; i++) {
        let filesize = (files[i].size / (1024 * 1024)).toFixed(2);
        uploadItemList.append('<li><div class="upload-filename"><span>' + files[i].name + '</span></div><div class="upload-progress"><progress id="progressBar" value="0" max="100"></progress><span id="progressPercent">0%</span></div><div class="upload-info"><span class="p-r-15">文件大小：' + filesize + 'M</span><span class="p-r-15">已上传：0</span><span class="p-r-15">速度：0</span></div></li>');
    }
}

/*----------------------------------------------------
[ 从服务器获取文件列表 ]
 */

// 根据当前路径获取文件列表
function getFilesByDir(curDir) {
    if (curDir.charAt(curDir.length - 1) === '/') {

        // 在按路径获得文件时,显示 返回\上传\新建文件夹 功能
        $('.function-item1').removeClass('display-none');
        $('.function-item2').removeClass('display-none');

        clearTable();

        // $.ajax({
        //     url: '',  // 添加url后删除！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        //     data: {'curDir': curDir},
        //     type: 'POST',
        //     dataType: 'json',
        //     success: function (data) {
        //         data = JSON.parse(data);
        //         showFileListUseTable(data);
        //     }
        // });
        var data = {
            "files": {
                "file1": {
                    "fileName": 'testFile1',
                    "fileSize": '123456',
                    "fileType": 'image/png',
                    "fileDir": '/lihui/',
                    "fileUploadDate": '2019-7-5',
                },
                "file2": {
                    "fileName": 'testFile2',
                    "fileSize": '230403',
                    "fileType": 'application/pdf',
                    "fileDir": '/lihui/',
                    "fileUploadDate": '2019-7-6',
                },
                "file3": {
                    "fileName": 'testFile3',
                    "fileSize": '1998',
                    "fileType": 'woxiaxiede',
                    "fileDir": '/lihui/',
                    "fileUploadDate": '2019-7-7',
                },
                "file4": {
                    "fileName": 'testDir',
                    "fileSize": '99999',
                    "fileType": 'dir',
                    "fileDir": '/lihui/',
                    "fileUploadDate": '2019-7-8',
                },
            }
        };
        // console.log(data);
        showFileListUseTable(data);
    } else {
        return '路径错误';
    }
}

// 根据类型获取文件列表
function getFilesByType(filetype) {
    // 在按类型获得文件时,不显示 返回\上传\新建文件夹 功能
    $('.function-item1').addClass('display-none');
    $('.function-item2').addClass('display-none');

    clearTable();

    $.ajax({
        url: '',  // 添加url后删除！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        data: {'fileType': filetype},
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            data = JSON.parse(data);
            showFileListUseTable(data);
        }
    });
}

// 对从服务器获得文件列表使用表格进行展示
function showFileListUseTable(data) {
    for (let key in data.files) {
        if (data.files.hasOwnProperty(key)) {
            // console.log(key);  // file1
            let fileName = data.files[key]['fileName'];
            let fileSize = data.files[key]['fileSize'];  // 文件夹不设计大小
            if (fileSize === '') fileSize = '----';
            let fileType = data.files[key]['fileType'];
            let fileDir = data.files[key]['fileDir'];  // 文件（夹）上层路径
            let fileUploadDate = data.files[key]['fileUploadDate'];

            let fileTable = $('#fileTable');
            if (fileType === 'dir') {
                // 如果是文件夹
                // td中额外添加一个可点击属性
                // checkbox的value设为 路径+文件名， 如果是文件夹则需要在末尾额外添加一个 '/'
                // 当选中复选框时，可以读取复选框的value，然后与后台交互
                fileTable.append('<tr class="contextmenu-able"><td class="col-0 border-bottom-solid"><input class="hover-pointer sub-checkbox" type="checkbox" value="' + fileDir + fileName + '/"><span class="dir-click-able" onclick="getNextDir(this)"><i class="fa fa-folder p-l-5"></i>&nbsp;' + fileName + '</span></td><td class="col-1 border-bottom-solid">' + fileDir + '</td><td class="col-2 border-bottom-solid">' + fileSize + '</td><td class="col-3 border-bottom-solid">' + fileUploadDate + '</td></tr>')
            } else {
                // 如果是文件
                let fileIcon = getFontAwesomeIconFromMIME(fileType);  // 文件对应的icon图标
                //console.log(fileIcon);
                fileTable.append('<tr class="contextmenu-able"><td class="col-0 border-bottom-solid"><input class="hover-pointer sub-checkbox" type="checkbox" value="' + fileDir + fileName + '"><span><i class="fa ' + fileIcon + ' p-l-5"></i>&nbsp;' + fileName + '</span></td><td class="col-1 border-bottom-solid">' + fileDir + '</td><td class="col-2 border-bottom-solid">' + fileSize + '</td><td class="col-3 border-bottom-solid">' + fileUploadDate + '</td></tr>')
            }
        }
    }

    // 为当前页面上的列表元素添加右键事件
    // 避免局部刷新导致新的列表元素没有右键事件
    rightClickMenu();

    // 为当前页面上的所有复选框添加点击事件
    checkboxClick();
}

// 重新获取（刷新）时先清除表格已有内容
function clearTable() {
    $('#fileTable').empty();
}

/*----------------------------------------------------
[ 文件类型与图标的对应 ]
 */

function getFontAwesomeIconFromMIME(mimeType) {
    // List of official MIME Types: http://www.iana.org/assignments/media-types/media-types.xhtml
    const icon_classes = {
        // Media
        image: "fa-file-image-o",
        audio: "fa-file-audio-o",
        video: "fa-file-video-o",
        // Documents
        "application/pdf": "fa-file-pdf-o",
        "application/msword": "fa-file-word-o",
        "application/vnd.ms-word": "fa-file-word-o",
        "application/vnd.oasis.opendocument.text": "fa-file-word-o",
        "application/vnd.openxmlformats-officedocument.wordprocessingml":
            "fa-file-word-o",
        "application/vnd.ms-excel": "fa-file-excel-o",
        "application/vnd.openxmlformats-officedocument.spreadsheetml":
            "fa-file-excel-o",
        "application/vnd.oasis.opendocument.spreadsheet": "fa-file-excel-o",
        "application/vnd.ms-powerpoint": "fa-file-powerpoint-o",
        "application/vnd.openxmlformats-officedocument.presentationml":
            "fa-file-powerpoint-o",
        "application/vnd.oasis.opendocument.presentation": "fa-file-powerpoint-o",
        "text/plain": "fa-file-text-o",
        "text/html": "fa-file-code-o",
        "application/json": "fa-file-code-o",
        // Archives
        "application/gzip": "fa-file-archive-o",
        "application/zip": "fa-file-archive-o"
    };

    for (let key in icon_classes) {
        if (icon_classes.hasOwnProperty(key)) {
            if (mimeType.search(key) === 0) {
                // Found it
                return icon_classes[key];
            }
        }
    }
    return 'fa-file-o';
}

/*----------------------------------------------------
[ 复选框相关 ]
 */

// 主复选框对文件（夹）复选框的控制：全选与全不选
function mainCheckboxCtrl() {
    var mainCheckbox = $('#main-checkbox');
    var subCheckboxes = $('.sub-checkbox');

    // 文件(夹)复选框与主复选框保持一致
    // console.log(mainCheckbox.is(':checked'));
    subCheckboxes.each(function () {
        $(this).prop('checked', mainCheckbox.is(':checked'));
    });

    // 高亮的处理
    if (mainCheckbox.is(':checked')) {
        subCheckboxes.each(function () {
            let tr = $(this).closest('.contextmenu-able');
            tr.addClass('checkbox-checked');
        });
    } else {
        subCheckboxes.each(function () {
            let tr = $(this).closest('.contextmenu-able');
            tr.removeClass('checkbox-checked');
        });
    }

    // 是否显示功能区
    showOrHideFunctionWrapper();
}

// 复选框点击事件
function checkboxClick() {
    $('.sub-checkbox').on('click', function () {
        // 如果复选框选中，则该行高亮显示
        let tr = $(this).closest('.contextmenu-able');
        // console.log($(this).is(':checked'));
        if ($(this).is(':checked')) {
            tr.addClass('checkbox-checked');
        } else {
            tr.removeClass('checkbox-checked');
        }
        // 是否显示功能区
        showOrHideFunctionWrapper();
    });
}

// 获得选中的复选框的值，以进行下一步的右键菜单操作
// 复选框的值是 文件路径
function getCheckedFileInfo() {
    var fileList = [];
    $('.sub-checkbox').each(function () {
        if ($(this).is(':checked')) {
            var dir = $(this).val();
            // console.log(dir);
            fileList.push(dir);
        }
    });
    // console.log(fileList);
    return fileList;
}

// 至少有一个复选框被选中，则显示功能区
// 所有可以对复选框进行操作的方法中应调用此方法
// checkboxClick() mainCheckboxCtrl() rightClickMenu()
function showOrHideFunctionWrapper() {
    var counter = 0;  // 记录被选中的复选框的数量
    $('.sub-checkbox').each(function () {
        if ($(this).is(':checked')) {
            counter++;
        }
    });
    if (counter > 0) {
        $('#function-item-wrapper').removeClass('display-none');
    } else {
        $('#function-item-wrapper').addClass('display-none');
    }
}

/*----------------------------------------------------
[ 右键菜单/功能区 函数 ]
 */

// 返回上一级目录
// 在按类型获得文件的页面不显示此功能
// 后台维护当前路径
function goBackUpperDir() {
    $.ajax({
        url: 'url',
        data: 'go back',
        type: "POST",
        success: function (res) {
            console.log(res);
            getFilesByDir(res);
        },
        fail: function (res) {
            console.log(res);
        }
    });
}

// 新建文件夹
// 文件夹不设计大小
function newFolder() {
    var ft = $('#fileTable');
    var fileName = prompt("请输入文件夹名称", "新建文件夹");
    if (fileName != null && fileName.trim() !== '') {
        if (fileName.indexOf('/') !== -1) {
            alert('文件夹名称中不能包含/');
        } else {
            $.ajax({
                url: '',
                data: {"newFolder": fileName},
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    let path = JSON.parse(res);
                    getFilesByDir(path);
                }
            })
        }
    } else {
        alert('请正确输入文件夹名称!');
    }


}

// 下载
function downloadFile() {
    var downloadFileList = getCheckedFileInfo();
    $.ajax({
        url: '',
        data: downloadFileList,
        type: 'POST',
        success: function (res) {
            console.log(res);
        },
        fail: function (res) {
            console.log(res);
        }
    })
}

// 删除
function deleteFileOrFolder() {
    var deleteFileList = getCheckedFileInfo();

    // 服务器端删除
    $.ajax({
        url: '',
        data: {"delete": deleteFileList},
        type: 'POST',
        dataType: 'json',
        success: function (res) {
            // 删除成功后刷新页面
            var path = JSON.parse(res);
            getFilesByDir(path);
        }
    })
}

// 重命名
function rename() {
    var renameFile = getCheckedFileInfo();
    if (renameFile.length > 1) {
        alert('每次只能选择一个文件(夹)重命名哦QwQ');
        return;
    }
    var newFileName = prompt('请输入新的文件(夹)名字', '重命名名称');
    if (newFileName != null && newFileName.trim() !== '') {
        if (newFileName.indexOf('/') !== -1) {
            alert('文件(夹)名称中不能包含/');
        } else {
            $('.sub-checkbox').each(function () {
                if ($(this).is(':checked')) {
                    var file = $(this).val();
                    console.log(newFileName);
                    $.ajax({
                        url: '',
                        data: {"newFileName": newFileName, "file": file},
                        dataType: 'json',
                        type: 'POST',
                        success: function (res) {
                            var path = JSON.parse(res);
                            getFilesByDir(path);
                        }
                    })
                }
            })
        }
    }
}

/*----------------------------------------------------
[ 点击文件夹到下一层目录 ]
 */
function getNextDir(folder) {
    var checkbox = folder.previousSibling;
    // console.log(checkbox.value);
    getFilesByDir(checkbox.value);
}
