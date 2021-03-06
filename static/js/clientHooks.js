'use strict';

var _ = require('ep_etherpad-lite/static/js/underscore');

var image = {
    removeImage: function (lineNumber) {
        var documentAttributeManager = this.documentAttributeManager;
        documentAttributeManager.removeAttributeOnLine(lineNumber, 'img'); // make the line a task list
    },
    addImage: function (lineNumber, src) {
        console.log('addi');
        var documentAttributeManager = this.documentAttributeManager;
        src = '<img src="' + src + '">';
        console.log('bef');
        documentAttributeManager.setAttributeOnLine(lineNumber, 'img', src); // make the line a task list
        console.log('aft');
    }
};

var _handleNewLines = function (ace) {
    var rep = ace.ace_getRep();
    var lineNumber = rep.selStart[0];
    var curLine = rep.lines.atIndex(lineNumber);
    if (curLine.text) {
        ace.ace_doReturnKey();

        return lineNumber + 1;
    }

    return lineNumber;
};

exports.postToolbarInit = function (hook_name, context) {
    var editbar = context.toolbar; // toolbar is actually editbar - http://etherpad.org/doc/v1.5.7/#index_editbar
    $('#closeErrorModalButton').on('click', function () {
        $('#imageUploadModalError').hide();
    });



    context.ace.callWithAce(function (ace) {
    window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event) {
        context.ace.callWithAce(function (ace) {
            var imageLineNr = _handleNewLines(ace);
            console.log(imageLineNr)
            // ace.ace_addImage(imageLineNr, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
            ace.ace_addImage(imageLineNr, JSON.parse(event.data));
            ace.ace_doReturnKey();
        }, 'img', true);
    }

    




        console.log('ace')
        var doc = ace.ace_getDocument();
        var a = $(doc).find('#innerdocbody')
        console.log(a)
        a.on("paste", function (event) {
            
            console.log(event);
            // addIm();
            // setTimeout(function () {

            //     context.ace.callWithAce(function (ace) {
            //         var imageLineNr = _handleNewLines(ace);
            //         console.log(imageLineNr)
            //         ace.ace_addImage(imageLineNr, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
            //         ace.ace_doReturnKey();
            //     }, 'img', true);
            // }, 1);
            var items = (event.clipboardData || event.originalEvent.clipboardData).items;
            console.log(items);
            console.log(JSON.stringify(items)); // will give you the mime types
            for (var index in items) {
                var item = items[index];
                if (item.kind === 'file') {
                    var blob = item.getAsFile();
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var data = reader.result;
                        console.log(data)
                        setTimeout(function () {
                            window.postMessage(JSON.stringify(data), "*");
                        }, 500);
                        event.preventDefault();
                    }; // data url!
                    reader.readAsDataURL(blob);
                }
            }
        });
    }, 'img', true);

    editbar.registerCommand('addImage', function () {
context.ace.callWithAce(function (ace) {
    var imageLineNr = _handleNewLines(ace);
    console.log(imageLineNr)
    ace.ace_addImage(imageLineNr, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
    ace.ace_doReturnKey();
}, 'img', true);

        console.log('tomi timo');
        $(document).find('body').find('#imageInput').remove();
        var fileInputHtml = '<input style="width:1px;height:1px;z-index:-10000;" id="imageInput" type="file" />';
        $(document).find('body').append(fileInputHtml);

        $(document).find('body').find('#imageInput').on('change', function (e) {
            var files = e.target.files;
            if (!files.length) {
                return 'Please choose a file to upload first.';
            }
            var file = files[0];
            var mimedb = clientVars.ep_image_upload.mimeTypes;
            var mimeType = mimedb[file.type];
            var validMime = null;
            var validSize = true;
            if (clientVars.ep_image_upload && clientVars.ep_image_upload.fileTypes) {
                validMime = false;
                if (mimeType && mimeType.extensions) {
                    for (var x = 0; x < clientVars.ep_image_upload.fileTypes.length; x++) {
                        var exists = mimeType.extensions.indexOf(clientVars.ep_image_upload.fileTypes[x]);
                        if (exists > -1) {
                            validMime = true;
                            x = clientVars.ep_image_upload.fileTypes.length;
                        }
                    }
                }
                if (validMime === false) {
                    var errorMessage = window._('ep_image_upload.error.fileType');
                    $('#imageUploadModalError .error').html(errorMessage);
                    $('#imageUploadModalError').show();
                    
                    return;
                }
            }

            if (clientVars.ep_image_upload && file.size > clientVars.ep_image_upload.maxFileSize) {
                var errorMessage = window._('ep_image_upload.error.fileSize');
                $('#imageUploadModalError .error').html(errorMessage);
                $('#imageUploadModalError').show();
                validSize = false;

                return;    
            }
            if (clientVars.ep_image_upload.storageType === 'base64') {
                $('#imageUploadModalLoader').hide();
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function () {
                    var data = reader.result;
                    context.ace.callWithAce(function (ace) {
                        console.log(data)



                        var imageLineNr = _handleNewLines(ace);
                        console.log(imageLineNr)
                        // ace.ace_addImage(imageLineNr, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
                        ace.ace_addImage(imageLineNr, data);
                        ace.ace_doReturnKey();
                    }, 'img', true);
                };
            } else {
                var formData = new FormData();

                // add assoc key values, this will be posts values
                formData.append('file', file, file.name);
                $('#imageUploadModalLoader').show();
                $.ajax({
                    type: 'POST',
                    url: '/p/' + clientVars.padId + '/pluginfw/ep_image_upload/upload',
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();

                        return myXhr;
                    },
                    success: function (data) {
                        $('#imageUploadModalLoader').hide();
                        context.ace.callWithAce(function (ace) {
                            var imageLineNr = _handleNewLines(ace);
                            ace.ace_addImage(imageLineNr, data);
                            ace.ace_doReturnKey();
                        }, 'img', true);
                    },
                    error: function (error) {
                        var errorResponse;
                        try {
                            errorResponse = JSON.parse(error.responseText.trim());
                            if (errorResponse.type) {
                                errorResponse.message = window._('ep_image_upload.error.' + errorResponse.type);
                            }
                        } catch (err) {
                            errorResponse = {message: error.responseText};
                        }

                        $('#imageUploadModalLoader').hide();
                        $('#imageUploadModalError .error').html(errorResponse.message);
                        $('#imageUploadModalError').show();
                    },
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    timeout: 60000
                });
            }

        });
        $(document).find('body').find('#imageInput').trigger('click');
    });
};

exports.aceAttribsToClasses = function (name, context) {
    if (context.key === 'img') {
        return ['img:' + context.value];
    }
};

// Rewrite the DOM contents when an IMG attribute is discovered
exports.aceDomLineProcessLineAttributes = function (name, context) {
    var cls = context.cls;
    var exp = /(?:^| )img:([^>]*)/;
    var imgType = exp.exec(cls);

    if (!imgType) return [];

    var randomId = Math.floor((Math.random() * 100000) + 1); 
    var template = '<span id="' + randomId + '" class="image">';
    if (imgType[1]) {
        var preHtml = template + imgType[1] + ' >';
        var postHtml = '</span>';
        var modifier = {
            preHtml: preHtml,
            postHtml: postHtml,
            processedMarker: true
        };

        return [modifier];
    }
    
    return [];
};

exports.aceEditorCSS = function () {
    return ['/ep_image_upload/static/css/ace.css'];
};

exports.aceInitialized = function (hook, context) {
    var editorInfo = context.editorInfo;
    editorInfo.ace_addImage = _(image.addImage).bind(context);
    editorInfo.ace_removeImage = _(image.removeImage).bind(context);
};

exports.collectContentImage = function (name, context) {
    var tname = context.tname;
    var state = context.state;
    var lineAttributes = state.lineAttributes;
    if (tname === 'div' || tname === 'p') {
        delete lineAttributes.img;
    }
    if (tname === 'img') {
        lineAttributes.img = context.node.outerHTML;
    }
};

exports.aceRegisterBlockElements = function () {
    return ['img']; 
};
