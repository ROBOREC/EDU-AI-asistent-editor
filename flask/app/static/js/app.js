!(function (e) {
    (jQuery.browser = jQuery.browser || {}).mobile =
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            e
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            e.substr(0, 4)
        );
})(navigator.userAgent || navigator.vendor || window.opera),
    $(function () {
        var t = {
            Started: {
                pageLoadingClose: function () {
                    $(".page-loading").fadeOut(300, function () {
                        $(this).remove();
                    });
                },
                scrolllRun: function (e) {
                    var o = $(".layout .content .chat .chat-body");
                    // if (0 < o.length)
                    //     if (1200 <= $(window).width()) {
                    //         var t = { cursorcolor: "rgba(66, 66, 66, 0.20)", cursorwidth: "4px", cursorborder: "0px" };
                    //         o.scrollTop(o.get(0).scrollHeight, -1).niceScroll(t),
                    //             $(".layout .content .sidebar .sidebar-body").niceScroll(t),
                    //             e && (o.scrollTop(o.get(0).scrollHeight, -1).getNiceScroll().resize(), $(".layout .content .sidebar .sidebar-body").getNiceScroll().resize());
                    //     } else o.scrollTop(o.get(0).scrollHeight, -1);
                },
                mobileBrowserVhProblemFixed: function () {
                    var e = 0.01 * window.innerHeight;
                    document.documentElement.style.setProperty("--vh", e + "px");
                },
                init: function () {
                    this.pageLoadingClose(),
                        this.scrolllRun(),
                        this.mobileBrowserVhProblemFixed(),
                        $("body").hasClass("rtl") && $(".dropdown-menu.dropdown-menu-right").removeClass("dropdown-menu-right"),
                        feather.replace(),
                        $(window).width() < 768 && ($("body").addClass("no-blur-effect"), $(".layout .content .sidebar-group .sidebar .list-group-item .users-list-body .users-list-action").removeClass("action-toggle"));
                },
            },
        };
        $('[data-toggle="tooltip"]').tooltip(),
            $(document).ready(function () {
                t.Started.init();
            }),
            $(document).on("click", ".dark-light-switcher", function () {
                return $(this).tooltip("dispose"), $("body").hasClass("dark") ? ($("body").removeClass("dark"), $(this).attr("title", "Noční režim")) : ($("body").addClass("dark"), $(this).attr("title", "Denní režim")), $(this).tooltip(), !1;
            }),
            $(document).on("click", ".mobile-navigation-button", function () {
                return $("body").addClass("navigation-open"), !1;
            }),
            $(document).on("click", "body.navigation-open a", function (event) {
                window.location = $(event.target).closest("a").attr("href");
            }),
            $(document).on("click", "body.navigation-open", function (event) {
                return $("body").removeClass("navigation-open"), !1;
            }),

            $(window).on("resize", function () {
                t.Started.mobileBrowserVhProblemFixed();
            }),
            // $(document).on("click", '[data-toggle="tooltip"]', function () {
            //     $(this).tooltip("hide");
            // }),
            $(document).on("click", "[data-navigation-target]", function () {
                var e = $(this).attr("data-navigation-target"),
                    o = $(".sidebar-group .sidebar#" + e);
                o.closest(".sidebar-group").find(".sidebar").removeClass("active"),
                    o.addClass("active"),
                    o.find("form input:first").focus(),
                    $("[data-navigation-target]").removeClass("active"),
                    $('[data-navigation-target="' + e + '"]').addClass("active"),
                    $(".sidebar-group").removeClass("mobile-open"),
                    o.closest(".sidebar-group").addClass("mobile-open"),
                    t.Started.scrolllRun(!0);
            }),
            $(document).on("click", ".sidebar-close", function (e) {
                $(window).width() < 1200 ? $(".sidebar-group").removeClass("mobile-open") : $(this).closest(".sidebar.active").removeClass("active"), t.Started.scrolllRun(!0);
            }),
            $(document).on("click", "#pageTour button.start-tour", function () {
                return (
                    $("#pageTour")
                        .modal("hide")
                        .on("hidden.bs.modal", function (e) {
                            var o = new EnjoyHint({});
                            o.set([
                                { 'next .sidebar>header>ul>li>[data-navigation-target="friends"]': "You can create a new chat here." },
                                { 'next .sidebar>header>ul>li>[data-target="#newGroup"]': "You can start a new group to chat with all your friends." },
                                { 'next [data-navigation-target="favorites"]': "Chats and messages you've added to your favorites appear here." },
                                { 'next [data-navigation-target="archived"]': "Chats and messages you've archived appear here." },
                                { 'next [data-target="#call"]': "Start voice call from here" },
                                { 'next [data-target="#videoCall"]': "Start a video call from here" },
                                { "next .navigation>.nav-group>ul>li.brackets+li+li": "Here you can manage your personal information and settings." },
                            ]),
                                o.run();
                        }),
                    !1
                );
            });
    });


function generate_uuid4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function type2text(type) {
    texts = {
        "information": "INFORMACE",
        "pause": "ČASOVAČ",
        "question": "OTÁZKA",
        "again": "Znovu tato otázka",
        "next": "Další krok lekce",
        "lecture": "Spustit jinou lekci",
        "code": "Odeslat kód",
        "step": "Jiný krok této lekce",
        "course": "Jiný kurz",
        "text": "TEXT",
        "image": "OBRÁZEK",
        "video": "VIDEO",
        "link": "ODKAZ",
        "now": "ihned",
        "seconds": "vteřin",
        "minutes": "minut",
        "hours": "hodin",
        "days": "dnů",
        "still": "stále",
    }
    return ((texts[type]) ? texts[type] : "");
}

function pause2text(type) {
    texts = {
        "pause": "Pauza",
        "after_lection_before": "po předchozí lekci",
        "after_lection_start": "po zahájení kurzu",
        "run_at": "spustit",
    }
    return ((texts[type]) ? texts[type] : "");
}

function type2class(type) {
    texts = {
        "information": "success",
        "pause": "info",
        "question": "warning",
    }
    return ((texts[type]) ? texts[type] : "");
}

function fixSortable() {
    $('.lecture-step-wrapper').sortable({
        items: '.lecture-step-answer:not(.answer-plus)',
        axis: 'y',
        update: function (e, ui) {
            var step_id = $(ui.item).closest(".lecture-step-wrapper").find(".edit-step").first().attr("data-step_id");
            var sort = [];
            $(".edit-answer").each(function () {
                if ($(this).attr("data-answer_id")) {
                    sort.push($(this).attr("data-answer_id"));
                }
            });
            $.ajax({
                type: 'POST',
                url: '/admin/ajax/answers/reorder',
                contentType: 'application/json',
                data: JSON.stringify({ "step_id": step_id, "sort": sort }),
                success: function (data) {
                    if (data.status) {
                        updateLastEditedDates();
                    }
                }
            });
        },
        stop: function (event, ui) {
            ui.item.css("left", "");
        },
    });

    $('.chat-body').sortable({
        items: '.lecture-step-wrapper',
        axis: 'y',
        update: function (e, ui) {
            var sort = [];
            $(".edit-step").each(function () {
                sort.push($(this).attr("data-step_id"));
            });
            $.ajax({
                type: 'POST',
                url: '/admin/ajax/steps/reorder',
                contentType: 'application/json',
                data: JSON.stringify({ "sort": sort }),
                success: function (data) {
                    if (data.status) {
                        updateLastEditedDates();
                    }
                }
            });
        },
        stop: function (event, ui) {
            ui.item.css("left", "");
        },
    });
}

function htmlEncode(html) {
    return document.createElement('a').appendChild(document.createTextNode(html)).parentNode.innerHTML;
}

function htmlDecode(html) {
    var a = document.createElement('a');
    a.innerHTML = html;
    return a.textContent;
}

function refreshView() {
    $("#loader li.list-group-item").removeClass("open-chat");
    $(".chat").first().html(`
	<div class="chat-body">
		<div class="no-message-container">
			<div class="row my-5">
				<div class="col-md-4 offset-4">
					<img src="${PROJECT_URL}/static/media/svg/undraw_empty_xct9.svg" class="img-fluid" alt="image">
				</div>
			</div>
			<div class="row my-5">
				<div class="col-md-4 offset-md-4">
					<p class="lead">Vyberte si z bočního menu</p>
				</div>
			</div>
		</div>
	</div>`);
}


function refreshDropzones() {
    $('.dropzone').each(function () {
        if (!$(this)[0].dropzone) {
            $(this).dropzone({
                url: "/admin/upload-images",
                maxFiles: 1,
                uploadMultiple: false,
                parallelUploads: 1,
                //resizeWidth: 1250,
                //resizeQuality: 0.95,
                addRemoveLinks: true,
                thumbnailWidth: 250,
                thumbnailHeight: 250,
                maxFilesize: 2,
                acceptedFiles: "image/*",
                maxThumbnailFilesize: 300,
                autoProcessQueue: true,
                accept: function (file, done) {
                    if (file.type != 'image/gif') {
                        this.options.resizeWidth = 1250;
                        this.options.resizeMimeType = 'image/jpeg';
                        this.options.resizeQuality = 0.95;
                        done();
                        return;
                    }
                    done();
                },
                dictDefaultMessage: "<b style='font-size:18px;display: flex;align-items: center;justify-content: center;padding: 15px;'>Obrázek vložte ze stránky (Ctrl+V), přetáhněte myší nebo klikněte a vyberte soubor.</b></br>",
                init: function () {
                    var element2search = $(this)[0].element;

                    var what2find;
                    switch ($(element2search).closest(".modal").attr("id")) {
                        case "newInformationModal":
                            what2find = "step_text";
                            break;
                        case "newAnswerModal":
                            what2find = "answer_text2";
                            break;
                        case "newQuestionModal":
                            what2find = "question_text2";
                            break;
                    }

                    var what2find_type = ((($(element2search).closest(".modal").attr("id") == "newInformationModal")) ? "step_type" : "answer_type");

                    this.on("addedfile", function (file) {

                        if (this.files.length > 1 || $(element2search).closest(".dropzone").find(".dz-image-preview").length > 0) {
                            this.removeAllFiles(true);
                            this.addFile(file);
                        } else {
                            var reader = new FileReader();
                            reader.onload = function (event) {
                                $(element2search).closest(".row").find("." + what2find).first().val(event.target.result);
                            };
                            reader.readAsDataURL(file);
                        }
                    });

                    this.on("success", function (file, response) {
                        if (response.status) {
                            var dropzone2search = this.element;
                            $(dropzone2search).find(".dz-preview").removeClass("dz-processing dz-complete");
                            $(dropzone2search).find(".dz-preview img").last().attr("src", PROJECT_URL + "/static/uploads/" + response.filename);
                            $(element2search).closest(".row").find("." + what2find).first().val(response.filename);
                        }
                    });

                    this.on("maxfilesexceeded", function (file) {
                        this.removeFile(file);
                    });

                    this.on("removedfile", function (file) {
                        $(element2search).closest(".row").find("." + what2find).first().val("");
                    });

                    if ($(element2search).closest(".row").find("." + what2find).val() != "" && ($(element2search).closest(".row").find("." + what2find_type).val() == "image" || what2find == "question_type2")) {
                        $(element2search).closest(".row").find(".dz-default.dz-message").hide();
                        $(element2search).closest(".row").find(".dropzone").append(`
						<div class="dz-preview dz-image-preview">
							<div class="dz-image">
								<img data-dz-thumbnail="" src="${PROJECT_URL}/static/uploads/` + $(element2search).closest(".row").find("." + what2find).val() + `">
							</div>
							<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">✘</a>
						</div>
						`);
                    }
                }
            });
        }
    });

    // window.addEventListener('paste', ... or
    document.onpaste = function (event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (index in items) {
            var item = items[index];
            if (item.kind === 'file') {
                var blob = item.getAsFile();
                var reader = new FileReader();
                reader.onload = function (event) {
                    if ($(".dropzone.allowedpasting .dz-preview").length > 0) {
                        $(".dropzone.allowedpasting .dz-remove").each(function () {
                            $(this).click();
                        });
                    }

                    var base64 = event.target.result.split(";base64,")[1];
                    var content_type = event.target.result.split(";base64,")[0].replace("data:", "");

                    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
                        const byteCharacters = atob(b64Data);
                        const byteArrays = [];
                        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                            const slice = byteCharacters.slice(offset, offset + sliceSize);
                            const byteNumbers = new Array(slice.length);
                            for (let i = 0; i < slice.length; i++) {
                                byteNumbers[i] = slice.charCodeAt(i);
                            }
                            const byteArray = new Uint8Array(byteNumbers);
                            byteArrays.push(byteArray);
                        }
                        const blob = new Blob(byteArrays, { type: contentType });
                        return blob;
                    }

                    if ($(".dropzone.allowedpasting").length > 0) {
                        $(".dropzone.allowedpasting")[0].dropzone.addFile(b64toBlob(base64, content_type));
                    }
                }; // data url!
                reader.readAsDataURL(blob);
            }
        }
    }
}

$(document).on("click", ".dz-remove", function () {
    var target2remove = $(this);
    var target2set = target_type = target_id = "";

    var target_id = $(target2remove).closest("." + ((target_type == "step") ? "info" : "answer") + "item").attr("data-" + target_type + "_id");

    switch ($(target2remove).closest(".modal").attr("id")) {
        case "newInformationModal":
            target2set = "step_text";
            target_type = "step";
            target_id = $(target2remove).closest(".infoitem").attr("data-step_id");
            break;
        case "newAnswerModal":
            target2set = "answer_text2";
            target_type = "answer";
            target_id = $(target2remove).closest(".answeritem").attr("data-answer_id");
            break;
        case "newQuestionModal":
            target2set = "question_text2";
            target_type = "question";
            break;
    }

    var image_src = $(target2remove).closest(".row").find("." + target2set).val();

    $.ajax({
        dataType: "json",
        type: "POST",
        url: "/admin/remove-image",
        contentType: "application/json",
        data: JSON.stringify({ "filename": image_src, "target_id": target_id, "target_type": target_type }),
        success: function (result) {
            $(target2remove).closest(".row").find("." + target2set).val("");
            $(target2remove).closest(".row").find(".dz-default.dz-message").show();
            $(target2remove).closest(".row").find(".dz-preview").remove();
            $(".modal .dropzone").removeClass("dz-started");
        }
    });
});

function renderInformation(data) {
    $("#newInformationModal .modal-body form").first().empty();
    for (var i = 0; i < data.length; i++) {
        let uuid4 = generate_uuid4();

        $("#newInformationModal .modal-body form").append(`
		<div class="infoitem" data-step_id="">
			`+ ((i > 0) ? `<hr class="hrseparator">` : ``) + `
			`+ ((i == 0) ? `` : `
			<div class="form-group" style="display:none">
				<label for="step_description`+ uuid4 + `" class="col-form-label">Popis</label>
				<input type="text" class="form-control step_description" id="step_description`+ uuid4 + `" value="">
			</div>`) + `
			<div class="row">
				<div class="form-group col-md-9">
					<label for="step_type`+ uuid4 + `" class="col-form-label">Typ kroku</label>
					<div class="input-group">
						<select id="step_type`+ uuid4 + `" class="form-control step_type">
							<option value="text">Text</option>
							<option value="image">Obrázek</option>
							<option value="video">Video</option>
							<option value="link">Odkaz</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-3" style="display:flex;justify-content: `+ ((i > 0) ? `end` : `start`) + `;">
					<button class="btn btn-light mr-2 duplicate-infoitem" style="border-color: #e6e6e6;align-self: flex-end;`+ ((i > 0) ? `margin-left: -5px;` : ``) + `" data-step_id="` + data[i].id + `"><i class="fa fa-clone"></i></button>
					`+ ((i > 0) ? `<button class="btn btn-danger remove-infoitem" data-step_id="` + data[i].id + `" style="opacity: 0.7;align-self: flex-end;" type="button" data-original-title="Delete"><i class="fa fa-trash"></i></button>` : ``) + `
				</div>
				<div class="form-group col-md-12">
					<label for="step_text`+ uuid4 + `" class="col-form-label">Zobrazit</label>
					<input type="text" class="form-control step_text" id="step_text`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12 dropzonewrapper" style="display:flex;justify-content: end;`+ ((data[i].step_type != "image") ? `display:none` : ``) + `">
					<span id="dropzoneodd`+ uuid4 + `">
						<div class="dropzone">
							<div class="fallback">
								<input name="souborp[]" type="file" multiple>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>`);

        $("#newInformationModal .infoitem").last().attr("data-step_id", data[i].id);

        if (i == 0) {
            $("#newInformationModal #step_description").first().val(data[i].description);
        } else {
            $("#newInformationModal .infoitem").last().find(".step_description").first().val(data[i].description);
        }

        $("#newInformationModal .infoitem").last().find(".step_type").first().val(data[i].step_type);
        $("#newInformationModal .infoitem").last().find(".step_type").trigger("change");
        $("#newInformationModal .infoitem").last().find(".step_text").first().val(data[i].text);
    }

    if ($("#newInformationModal").find("div.modal-body div.infoitem").length > 3) {
        $(".add-infoitems").hide();
        $("#newInformationModal div.modal-footer").css("justify-content", "end");
    }
}

function renderAnswer(data) {
    $("#newAnswerModal .modal-body .answeritems").empty();
    $("#answer_following_action_id option").remove();

    for (var i = 0; i < data.length; i++) {
        let uuid4 = generate_uuid4();

        $("#newAnswerModal .modal-body .answeritems").append(`
		<div class="answeritem" data-answer_id="">
			`+ ((i > 0) ? `<hr class="hrseparator">` : ``) + `
			<div class="row">
				<div class="form-group col-md-9">
					<label for="step_type`+ uuid4 + `" class="col-form-label">Typ kroku</label>
					<div class="input-group">
						<select id="answer_type`+ uuid4 + `" class="form-control answer_type">
							<option value="text">Text</option>
							<option value="image">Obrázek</option>
							<option value="video">Video</option>
							<option value="link">Odkaz</option>
							<option value="pause">Pauza</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-3" style="display:flex;justify-content: start;">
					<button class="btn btn-light mr-2 duplicate-answeritem" style="border-color: #e6e6e6;align-self: flex-end;margin-left: -5px;"><i class="fa fa-clone"></i></button>
					`+ ((i > 0) ? `<button class="btn btn-danger remove-answeritem" type="button" data-answer_id="` + data[i].id + `" style="opacity: 0.7;align-self: flex-end;" data-original-title="Delete"><i class="fa fa-trash"></i></button>` : ``) + `
				</div>
				<div class="form-row pausepicking" style="display:none">
					<div class="form-group col-md-6">
						<label for="pause_text`+ uuid4 + `" class="col-form-label">Čekej</label>
						<input type="number" class="form-control pause_text" id="pause_text`+ uuid4 + `">
					</div>
					<div class="form-group col-md-6">
						<label for="pause_text2`+ uuid4 + `" class="col-form-label">Jednotka</label>
						<select class="form-control pause_text2" id="pause_`+ uuid4 + `">
							<option value="now">ihned</option>
							<option value="seconds">vteřin</option>
							<option value="minutes">minut</option>
							<option value="hours">hodin</option>
							<option value="days">dnů</option>
							<option value="still">stále</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-12" style="display:none">
					<label for="answer_description`+ uuid4 + `" class="col-form-label">Popis</label>
					<input type="text" class="form-control answer_description" id="answer_description`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12">
					<label for="answer_text2`+ uuid4 + `" class="col-form-label">Zobrazit</label>
					<input type="text" class="form-control answer_text2" id="answer_text2`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12 dropzonewrapper" style="display:flex;justify-content: end;`+ ((data[i].answer_type != "image") ? `display:none` : ``) + `">
					<span id="dropzoneodd`+ uuid4 + `">
						<div class="dropzone">
							<div class="fallback">
								<input name="souborp[]" type="file" multiple>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>`);

        if (i == 0) {
            $("#newAnswerModal #answer_text2match").first().val(data[i].text2match)
            $("#newAnswerModal #answer_text").first().val(data[i].text);
            $("#newAnswerModal #answer_following_action").val(data[i].following_action);

            $("#newAnswerModal .modal-title").first().css("visibility", "hidden");
            $("#newAnswerModal .modal-title").first().text(data[i].text);

            if (data[i].question_free_input) {
                $("#newAnswerModal .modal-title").first().css("visibility", "visible");
            }

            if (data[i].correct_answer) {
                $("#newAnswerModal #answer_correct").prop("checked", true);
            } else {
                $("#newAnswerModal #answer_correct").prop("checked", false);
            }

            if (["course", "lecture", "step", "gdpr", "code"].includes(data[i].following_action)) {
                $("#answer_following_action_id").closest(".form-group").show();
                var lecture_id = $(".list-group-item.open-chat").first().attr("data-lecture_id");
                var course_id = $("#back2courses").first().attr("data-course_id");
                var following_action_id = data[i].following_action_id;
                var url2use = "";
                if ($("#answer_following_action").val() == "lecture") {
                    url2use = "/admin/ajax/lectures/dropdown?course_id=" + course_id;
                } else if ($("#answer_following_action").val() == "step") {
                    url2use = "/admin/ajax/lecture2steps/" + lecture_id + "/dropdown";

                } else if ($("#answer_following_action").val() == "gdpr") {
                    // todo: getting some data via ajax
                    url2use = "";
                    $("label[for='answer_following_action_id']").first().text("Spustit akci");
                    $("#answer_following_action_id").empty();
                    $("#answer_following_action_id").append($('<option>', { value: 1, text: "GDPR1" }));
                    $("#answer_following_action_id").append($('<option>', { value: 2, text: "GDPR2" }));
                    $("#answer_following_action_id option[value='" + following_action_id + "']").prop("selected", true);
                } else if ($("#answer_following_action").val() == "gdpr") {
                    url2use = "";
                    $("#answer_following_action_id").replaceWith('<input class="form-control" id="answer_following_action_id">');
                    $("#answer_following_action_id").val(following_action_id);
                } else {
                    url2use = "/admin/ajax/courses/dropdown";
                }
                if (url2use != "") {
                    $.ajax({
                        dataType: "json",
                        url: url2use,
                        contentType: "application/json",
                        success: function (result) {
                            if (result.status) {
                                $("#answer_following_action_id").empty();
                                for (var j = 0; j < result.data.length; j++) {
                                    $("#answer_following_action_id").append($('<option>', { value: result.data[j].id, text: result.data[j].title }));
                                }
                                $("#answer_following_action_id option[value='" + following_action_id + "']").prop("selected", true);
                            }
                        }
                    });
                }

            } else {
                $("#answer_following_action_id").closest(".form-group").hide();
            }
        }

        $("#newAnswerModal .answeritem").last().attr("data-answer_id", data[i].id);
        $("#newAnswerModal .answeritem").last().find(".answer_description").first().val(data[i].description);
        $("#newAnswerModal .answeritem").last().find(".answer_type").first().val(data[i].answer_type);
        $("#newAnswerModal .answeritem").last().find(".answer_type").first().trigger("change");
        $("#newAnswerModal .answeritem").last().find(".answer_text2").first().val(data[i].text2);

        if (data[i].answer_type == "pause") {
            $("#newAnswerModal .answeritem").last().find(".pause_text").first().val(data[i].description);
            $("#newAnswerModal .answeritem").last().find(".pause_text2").first().val(data[i].text2);
        }
    }

    if ($("#newAnswerModal").find("div.modal-body div.answeritem").length > 3) {
        $(".add-answeritems").hide();
        $("#newAnswerModal div.modal-footer").css("justify-content", "end");
    } else {
        $(".add-answeritems").show();
        $("#newAnswerModal div.modal-footer").css("justify-content", "space-between");
    }
}

// lectures

$(document).on("click", "#lecture-save", function () {
    var lecture_name = $("#lecture_name").val();
    var lecture_description = $("#lecture_description").val();
    var lecture_id = $("#lecture-save").first().attr("data-lecture_id");
    var course_id = $("#lecture-save").first().attr("data-course_id");

    if ($("#newLectureModal .nav-tabs a.active").first().attr("href") == "#importlecture") {
        let files = new FormData();
        files.append('export', $('#json_export_lecture')[0].files[0]);
        $.ajax({
            type: 'post',
            url: '/admin/courses/' + course_id + '/import-lecture',
            processData: false,
            contentType: false,
            data: files,
            success: function (response) {
                console.log(response);
                if (response.status) {
                    $("#newLectureModal").modal('hide');
                    window.location.reload();
                } else {
                    if (response.msg) {
                        alert("Došlo k chybě během importu dat: " + response.msg);
                    } else {
                        alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                    }

                }
            },
            error: function (err) {
                console.log(err);
                alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            url: '/admin/lectures/new',
            contentType: 'application/json',
            data: JSON.stringify({ "lecture_name": lecture_name, "lecture_description": lecture_description, "lecture_id": lecture_id, "course_id": course_id }),
            success: function (result) {
                if (result.status) {
                    $("#lecture_name").val("");
                    $("#lecture_description").val("");
                    $("#newLectureModal").modal('hide');
                    if (lecture_id != "") {
                        $("#loader").find("li.list-group-item[data-lecture_id='" + lecture_id + "'] div.users-list-body h5").text(lecture_name);
                        $("#loader").find("li.list-group-item[data-lecture_id='" + lecture_id + "'] div.users-list-body p").text(lecture_description);
                        $("#loader").find("li.list-group-item[data-lecture_id='" + lecture_id + "'] .users-list-action small.text-muted").text(result.data.last_edited);
                        $(".chat-header-user").find("div h5").first().text(lecture_name);
                        $(".chat-header-user").find("div p").first().text(lecture_description);
                    } else {
                        $("#loader").append(`
						<li data-lecture_id="`+ result.data.id + `" class="list-group-item">
							<div class="users-list-body">
								<div>
									<h5></h5>
									<p></p>
								</div>
								<div class="users-list-action">
									<div class="new-message-count"></div>
									<small class="text-muted"></small>
									<div class="action-toggle">
										<div class="dropdown">
											<a data-toggle="dropdown">
												<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
											</a>
											<div class="dropdown-menu dropdown-menu-right">
												<a class="dropdown-item">Otevřít</a>
												<a href="javascript:void(0);" class="dropdown-item edit-lecture" data-lecture_id="`+ result.data.id + `" data-toggle="modal" data-target="#newLectureModal">Upravit</a>
												<a href="javascript:void(0);" class="dropdown-item move-lecture-up" data-lecture_id="`+ result.data.id + `">Posunout ↑</a>
												<a href="javascript:void(0);" class="dropdown-item move-lecture-down" data-lecture_id="`+ result.data.id + `">Posunout ↓</a>
												<a href="javascript:void(0);" class="dropdown-item duplicate-lecture" data-lecture_id="`+ result.data.id + `">Duplikovat</a>
												<a href="javascript:void(0);" class="dropdown-item export-lecture" data-lecture_id="`+ result.data.id + `">Exportovat</a>
												<a href="javascript:void(0);" class="dropdown-item visualize-lecture" data-lecture_id="`+ result.data.id + `">Vizualizace</a>
												<div class="dropdown-divider"></div>
												<a href="javascript:void(0);" class="dropdown-item text-danger" data-lecture_id="`+ result.data.id + `" data-toggle="modal" data-target="#deleteLectureModal">Smazat</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</li>
						`);
                        $("#loader li.list-group-item").last().find(".users-list-body h5").text(result.data.name);
                        $("#loader li.list-group-item").last().find(".users-list-body p").text(result.data.description);
                        $("#loader li.list-group-item").last().find(".users-list-action small.text-muted").text(result.data.last_edited);
                        $("#loader li.list-group-item").last().find(".users-list-action div.new-message-count").text("1");

                        $.ajax({
                            type: 'POST',
                            url: '/admin/steps/new',
                            contentType: 'application/json',
                            data: JSON.stringify({ "steps": [{ "step_description": "", "step_type": "text", "step_text": "Úvod" }], "response_type": "information", "lecture_id": result.data.id }),
                            success: function (data) {
                                if (data.status) {
                                    $(".open-chat").click();
                                }
                            }
                        });
                    }
                    updateLastEditedDates();
                }
            }
        });
    }
});

$("#newCourseModal").on("show.bs.modal", function (e) {
    var related_target = $(e.relatedTarget);
    var course_id = related_target.attr("data-course_id");
    $("#course-save").first().attr("data-duplicate_course_id", "");
    $("#json_export").val("");
    if (related_target.hasClass("edit-course")) {
        $("#newCourseModal .nav-tabs").hide();
        $("#course-save").first().attr("data-course_id", course_id);
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/courses/' + course_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    $("#course_name").val(result.data.name);
                    $("#course_description").val(result.data.description);
                }
            }
        });
    } else if (related_target.hasClass("duplicate-course")) {
        $("#newCourseModal .nav-tabs").hide();
        $("#course-save").first().attr("data-course_id", "");
        $("#course-save").first().attr("data-duplicate_course_id", course_id);
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/courses/' + course_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    $("#course_name").val(result.data.name);
                    $("#course_description").val(result.data.description);
                }
            }
        });

    } else {
        $("#newCourseModal .nav-tabs").show();
        $("#course_name").val("");
        $("#course_description").val("");
        $("#course-save").first().attr("data-course_id", "");
    }
});

$(document).on("click", "#course-save", function () {
    var course_name = $("#course_name").val();
    var course_description = $("#course_description").val();
    var course_id = $("#course-save").first().attr("data-course_id");
    var duplicate_course_id = $("#course-save").first().attr("data-duplicate_course_id");

    if ($("#newCourseModal .nav-tabs a.active").first().attr("href") == "#import") {
        let files = new FormData();
        files.append('export', $('#json_export')[0].files[0]);
        $.ajax({
            type: 'post',
            url: '/admin/courses/import',
            processData: false,
            contentType: false,
            data: files,
            success: function (response) {
                console.log(response);
                if (response.status) {
                    $("#newCourseModal").modal('hide');
                    window.location.reload();
                } else {
                    if (response.msg) {
                        alert("Došlo k chybě během importu dat: " + response.msg);
                    } else {
                        alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                    }
                }
            },
            error: function (err) {
                console.log(err);
                alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
            }
        });
    } else {
        if (course_name.length > 0) {
            $.ajax({
                type: 'POST',
                url: '/admin/courses/new',
                contentType: 'application/json',
                data: JSON.stringify({ "course_name": course_name, "course_description": course_description, "course_id": course_id, "duplicate_course_id": duplicate_course_id }),
                success: function (result) {
                    if (result.status) {
                        $("#course_name").val("");
                        $("#lecture_name").val("");
                        $("#newCourseModal").modal('hide');
                        if (course_id != "") {
                            $("#courses").find("li.list-group-item[data-course_id='" + course_id + "'] div.users-list-body h5").text(course_name);
                            $("#courses").find("li.list-group-item[data-course_id='" + course_id + "'] div.users-list-body p").text(course_description);
                        } else {
                            window.location.reload();
                        }
                    }
                }
            });
        }
    }
});

$(document).on("click", "a.dropdown-item[data-target='#deleteCourseModal']", function (e) {
    var course_id = $(e.target).attr("data-course_id");
    $("#course-delete").first().attr("data-course_id", course_id);
});
$("#course-delete").on("click", function (e) {
    var related_target = $(e.target);
    var course_id = related_target.attr("data-course_id");
    $.ajax({
        type: 'POST',
        url: '/admin/courses/' + course_id + '/delete',
        contentType: 'application/json',
        success: function (data) {
            if (data.status) {
                var item = $("#loader").find("li.list-group-item[data-c='" + course_id + "']").first();
                item.remove();
            } else {
                alert(data.msg);
            }
            $("#search").trigger("input");
            $("#deleteCourseModal").modal("hide");
        }
    });
});

$('#newLectureModal').on('show.bs.modal', function (e) {
    var related_target = $(e.relatedTarget);
    var lecture_id = related_target.attr("data-lecture_id");
    var course_id = $("#back2courses").attr("data-course_id");
    $("#json_export_lecture").val("");
    if (related_target.hasClass("edit-lecture")) {
        //$("#newLectureModal h5 span").first().text("Editace lekce");
        $("#newLectureModal .nav-tabs").hide();
        $("#lecture-save").first().attr("data-lecture_id", lecture_id);
        $("#lecture-save").first().attr("data-course_id", course_id);
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/lecture/' + lecture_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    $("#lecture_name").val(result.data.name);
                    $("#lecture_description").val(result.data.description);
                }
            }
        });
    } else {
        //$("#newLectureModal h5 span").first().text("Nová lekce");
        $("#newLectureModal .nav-tabs").show();
        $("#lecture_name").val("");
        $("#lecture_description").val("");
        $("#lecture-save").first().attr("data-lecture_id", "");
        $("#lecture-save").first().attr("data-course_id", course_id);
    }
});

$(document).on("click", ".move-lecture-down", function () {
    var lecture_id = $(this).attr("data-lecture_id");
    $.ajax({
        type: 'POST',
        url: '/admin/lectures/' + lecture_id + '/move-down',
        contentType: 'application/json',
        success: function (result) {
            if (result.status) {
                $(".list-group-item[data-lecture_id='" + lecture_id + "']").first().insertAfter($(".list-group-item[data-lecture_id='" + lecture_id + "']").next());
                $(".dropdown").removeClass("show");
                $(".dropdown-menu").removeClass("show");
                updateLastEditedDates();
            }
        }
    });
});

$(document).on("click", ".move-lecture-up", function () {
    var lecture_id = $(this).attr("data-lecture_id");
    $.ajax({
        type: 'POST',
        url: '/admin/lectures/' + lecture_id + '/move-up',
        contentType: 'application/json',
        success: function (result) {
            if (result.status) {
                $(".list-group-item[data-lecture_id='" + lecture_id + "']").first().insertBefore($(".list-group-item[data-lecture_id='" + lecture_id + "']").prev());
                $(".dropdown").removeClass("show");
                $(".dropdown-menu").removeClass("show");
                updateLastEditedDates();
            }
        }
    });
});

$(document).on("change", ".step_type", function () {
    var selected_step_type = $(this).val();
    var parent_row = $(this).closest(".row");
    var step_item = $(parent_row).find(".step_text").first();

    if (selected_step_type == "text") {
        var textarea_item = $(document.createElement('textarea'));
        textarea_item.text("");
        $(textarea_item).addClass($(step_item).attr('class'));
        $(textarea_item).attr("id", $(step_item).attr("id"));
        $(step_item).after(textarea_item).remove();
        var form_group = $(textarea_item).closest(".row").find(".step_text").closest(".form-group");
        parent_row.find(".dropzonewrapper").first().hide();
        parent_row.find(".dropzonewrapper .dz-image-preview").first().remove();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    } else if (["video", "link"].includes(selected_step_type)) {
        var input_item = $(document.createElement('input'));
        $(input_item).attr("type", "text");
        $(input_item).val("");
        $(input_item).addClass($(step_item).attr('class'));
        $(input_item).attr("id", $(step_item).attr("id"));
        $(step_item).after(input_item).remove();
        var form_group = $(input_item).closest(".row").find(".step_text").closest(".form-group");
        parent_row.find(".dropzonewrapper").first().hide();
        parent_row.find(".dropzonewrapper .dz-image-preview").first().remove();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    } else if (selected_step_type == "image") {
        var input_item = $(document.createElement('input'));
        $(input_item).attr("type", "hidden");
        $(input_item).val("");
        $(input_item).addClass($(step_item).attr('class'));
        $(input_item).attr("id", $(step_item).attr("id"));
        $(step_item).after(input_item).remove();
        var form_group = $(input_item).closest(".row").find(".step_text").closest(".form-group");
        form_group.find("label").hide();
        parent_row.find(".dropzonewrapper").first().show();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    }
});

$(document).on("change", ".answer_type", function () {
    var selected_answer_type = $(this).val();
    var parent_row = $(this).closest(".row");
    var answer_item = $(parent_row).find(".answer_text2").first();
    $(answer_item).closest(".form-group").show();
    $(parent_row).find(".pausepicking").hide();
    if (selected_answer_type == "text") {
        var textarea_item = $(document.createElement('textarea'));
        $(textarea_item).text("");
        $(textarea_item).addClass($(answer_item).attr('class'));
        $(textarea_item).attr("id", $(answer_item).attr("id"));
        $(answer_item).after(textarea_item).remove();
        var form_group = $(textarea_item).closest(".row").find(".answer_text2").closest(".form-group");
        parent_row.find(".dropzonewrapper").first().hide();
        parent_row.find(".dropzonewrapper .dz-image-preview").first().remove();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    } else if (["video", "link"].includes(selected_answer_type)) {
        var input_item = $(document.createElement('input'));
        $(input_item).attr("type", "text");
        $(input_item).val("");
        $(input_item).addClass($(answer_item).attr('class'));
        $(input_item).attr("id", $(answer_item).attr("id"));
        $(answer_item).after(input_item).remove();
        var form_group = $(input_item).closest(".row").find(".answer_text2").closest(".form-group");
        parent_row.find(".dropzonewrapper").first().hide();
        parent_row.find(".dropzonewrapper .dz-image-preview").first().remove();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    } else if (selected_answer_type == "image") {
        var input_item = $(document.createElement('input'));
        $(input_item).attr("type", "hidden");
        $(input_item).val("");
        $(input_item).addClass($(answer_item).attr('class'));
        $(input_item).attr("id", $(answer_item).attr("id"));
        $(answer_item).after(input_item).remove();
        var form_group = $(input_item).closest(".row").find(".answer_text2").closest(".form-group");
        form_group.find("label").hide();
        parent_row.find(".dropzonewrapper").first().show();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    } else if (selected_answer_type == "pause") {
        $(answer_item).closest(".form-group").hide();
        $(parent_row).find(".pausepicking").css("display", "flex");
        parent_row.find(".dropzonewrapper").first().hide();
        parent_row.find(".dropzonewrapper .dz-image-preview").first().remove();
        parent_row.find(".dropzonewrapper .dz-default.dz-message").first().show();
    }
});

$(document).on("click", ".collapse-step", function () {
    if ($(this).hasClass("collapsed-step")) {
        $(this).closest(".lecture-step-wrapper").find(".lecture-step-answer").css("display", "flex");
        $(this).removeClass("collapsed-step");
    } else {
        $(this).closest(".lecture-step-wrapper").find(".lecture-step-answer").hide();
        $(this).addClass("collapsed-step");
    }
});

$("#pause_type").on("change", function () {
    if ($(this).val() == "run_at") {
        $(".intervalpicking").hide();
        $(".datepicking").css("display", "block");
    } else {
        $(".intervalpicking").css("display", "flex");
        $(".datepicking").hide();
    }

    if ($(this).val() == "pause" && $("#pause_text").val() == "") {
        $("#pause_text").val(1);
        $("#pause_text2").find("option[value='seconds']").first().prop("selected", true);
    }
});

$("#newStepModal").on("show.bs.modal", function (e) {
    var related_target = $(e.relatedTarget);
    var lecture_id = related_target.attr("data-lecture_id");
    $("#newStepModal .step").attr("data-lecture_id", lecture_id);
});

function renderLecture(data) {
    $(".chat").first().html(`
		<div class="chat-header">
			<div class="chat-header-user">
				<div>
					<h5></h5>
					<p></p>
				</div>
			</div>
			<div class="chat-header-action">
				<ul class="list-inline">
					<a class="btn btn-outline-light" href="javascript:void(0);" id="back2lectures" data-course_id="">
						<i class="fas fa-arrow-left"></i>
					</a>
					<li class="list-inline-item d-xl-none d-inline">
						<a href="#" class="btn btn-outline-light mobile-navigation-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
						</a>
					</li>
					<li class="list-inline-item">
						<a class="btn btn-outline-light new-step" data-lecture_id="" data-toggle="modal" data-target="#newStepModal">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
						</a>
					</li>
					<li class="list-inline-item">
						<a class="btn btn-outline-light" data-toggle="dropdown">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
						</a>
						<div class="dropdown-menu dropdown-menu-right">
							<a href="javascript:void(0);" class="dropdown-item new-step" data-lecture_id="" data-toggle="modal" data-target="#newStepModal">Přidat krok</a>
							<a href="javascript:void(0);" class="dropdown-item edit-lecture" data-lecture_id="" data-toggle="modal" data-target="#newLectureModal">Upravit</a>
							<a href="javascript:void(0);" class="dropdown-item duplicate-lecture" data-lecture_id="">Duplikovat</a>
							<a href="javascript:void(0);" class="dropdown-item export-lecture" data-lecture_id="">Exportovat</a>
							<a href="javascript:void(0);" class="dropdown-item visualize-lecture" data-lecture_id="">Vizualizace</a>
							<div class="dropdown-divider"></div>
							<a href="javascript:void(0);" class="dropdown-item text-danger" data-lecture_id="" data-toggle="modal" data-target="#deleteLectureModal">Smazat</a>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div class="chat-body">
		</div>
	`);

    $(".chat").first().find("#back2lectures").first().attr("data-course_id", data.course_id);
    $(".chat").first().find(".avatar-title.rounded-circle").first().text(data.id);
    $(".chat").first().find("div.chat-header-user div h5").first().text(data.name);
    $(".chat").first().find("div.chat-header-user div p").first().text(data.description);
    $(".chat").first().find(".chat-header-action a.new-step").attr("data-lecture_id", data.id);
    $(".chat").first().find(".chat-header-action a.edit-lecture").first().attr("data-lecture_id", data.id);
    $(".chat").first().find(".chat-header-action a.duplicate-lecture").first().attr("data-lecture_id", data.id);
    $(".chat").first().find(".chat-header-action a.visualize-lecture").first().attr("data-lecture_id", data.id);
    $(".chat").first().find(".chat-header-action a.text-danger").first().attr("data-lecture_id", data.id);

    for (var i = 0; i < data.steps.length; i++) {
        let modal_name = "";
        if (["information", "pause", "question"].includes(data.steps[i].response_type)) {
            modal_name = data.steps[i].response_type.charAt(0).toUpperCase() + data.steps[i].response_type.slice(1).toLowerCase();
        }
        $(".chat").first().find("div.chat-body").append(`
		<div class='lecture-step-wrapper'>
			<div class='lecture-step'>
				<h5 class='lecture-step-title'></h5>
				<div class='lecture-step-filler'></div>
				`+ ((data.steps[i].response_type == "question" && !data.steps[i].free_input) ? `<button class="btn btn-light mr-2 collapse-step collapsed-step"><i class="fa fa-chevron-up"></i></button>` : ``) + `
				<button class='btn btn-warning mr-2 edit-step' type='button' data-toggle='modal' data-target='#new`+ modal_name + `Modal' title='' data-original-title='Edit'><i class='fa fa-edit'></i></button>
				<button class='btn btn-light mr-2 duplicate-step'><i class='fa fa-clone'></i></button>
				<button class='btn btn-danger delete-step' type='button' data-toggle='modal' data-target='#delete`+ modal_name + `Modal' title='' data-original-title='Delete'><i class='fa fa-trash'></i></button>
			</div>`);


        if (data.steps[i].response_type == "question") {
            for (var j = 0; j < data.steps[i].answers.length; j++) {
                if (data.steps[i].answers[j].parent_id < 1 || !data.steps[i].answers[j].parent_id) {
                    $(".chat").first().find("div.lecture-step-wrapper").last().append(`
					<div class="lecture-step-answer">
						<h5 class="lecture-step-title"></h5>
						<div class="lecture-step-filler"></div>
						<button class="btn btn-warning mr-2 edit-answer" data-answer_id="" data-step_id="" type="button" data-toggle="modal" data-target="#newAnswerModal" title="" data-original-title="Edit"><i class="fa fa-edit"></i></button>
						<button class="btn btn-danger delete-answer" data-answer_id="" type="button" data-toggle="modal" data-target="#deleteAnswerModal" title="" data-original-title="Delete"><i class="fa fa-trash"></i></button>
					</div>
					`);

                    $(".chat div.chat-body").find(".lecture-step-answer").last().find("h5.lecture-step-title").text(((data.steps[i].answers[j].text != "" && data.steps[i].free_input) ? data.steps[i].answers[j].text : data.steps[i].answers[j].text2match));

                    $(".chat div.chat-body").find(".lecture-step-answer").last().find("h5.lecture-step-title").append(`
					<span class="badge badge-danger">1+`+ data.steps[i].answers.filter(function (element) { return element.parent_id == data.steps[i].answers[j].id; }).length + ` kroků</span><span class="badge badge-primary">` + type2text(data.steps[i].answers[j].following_action) + `</span>`);

                    $(".chat div.chat-body").find(".lecture-step-answer").last().find("button.edit-answer").first().attr("data-answer_id", data.steps[i].answers[j].id);
                    $(".chat div.chat-body").find(".lecture-step-answer").last().find("button.edit-answer").first().attr("data-step_id", data.steps[i].id);
                    $(".chat div.chat-body").find(".lecture-step-answer").last().find("button.delete-answer").first().attr("data-answer_id", data.steps[i].answers[j].id);
                }
            }

            $(".chat").first().find("div.lecture-step-wrapper").last().append(`
			<div class="lecture-step-answer answer-plus">
				<a class="btn btn-outline-light edit-answer" data-toggle="modal" data-step_id="`+ data.steps[i].id + `" data-target="#newAnswerModal">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
				</a>
			</div>
			`);
        }

        $(".chat").first().find("div.chat-body").append(`
		</div>
		`);
        $(".chat").first().find("div.chat-body div.lecture-step").last().find("h5.lecture-step-title").text(((data.steps[i].description != "") ? data.steps[i].description : data.steps[i].text)).append(' <span class="badge badge-' + type2class(data.steps[i].response_type) + '">' + type2text(data.steps[i].response_type) + '</span>');
        $(".chat").first().find("div.chat-body div.lecture-step").last().find("button.duplicate-step").first().attr("data-step_id", data.steps[i].id);
        $(".chat").first().find("div.chat-body div.lecture-step").last().find("button.edit-step").first().attr("data-step_id", data.steps[i].id);
        $(".chat").first().find("div.chat-body div.lecture-step").last().find("button.edit-step").first().attr("data-lecture_id", data.id);
        $(".chat").first().find("div.chat-body div.lecture-step").last().find("button.delete-step").first().attr("data-step_id", data.steps[i].id);

        if (data.steps[i].response_type != "question") {
            $(".chat div.chat-body").find(".lecture-step").last().find("h5.lecture-step-title").append(`<span class="badge badge-` + type2class(data.steps[i].response_type) + `">` + type2text(data.steps[i].step_type) + `</span>`);
        }

        if (data.steps[i].response_type == "pause") {
            if (["pause", "run_at"].includes(data.steps[i].description)) {
                $(".chat").first().find("div.chat-body div.lecture-step").last().find("h5.lecture-step-title").text(pause2text(data.steps[i].description) + " " + data.steps[i].text + " " + type2text(data.steps[i].text2));
            } else {
                $(".chat").first().find("div.chat-body div.lecture-step").last().find("h5.lecture-step-title").text(data.steps[i].text + " " + type2text(data.steps[i].text2) + " " + pause2text(data.steps[i].description));
            }
            $(".chat").first().find("div.chat-body div.lecture-step").last().find("h5.lecture-step-title").append(' <span class="badge badge-' + type2class(data.steps[i].response_type) + '">' + type2text(data.steps[i].response_type) + '</span>');
        }

        if (data.steps[i].response_type == "question" && !data.steps[i].free_input) {
            var answers_count = 0;
            data.steps[i].answers.forEach((answer2use) => {
                if (!answer2use.parent_id) {
                    answers_count += 1;
                }
            });
            $(".chat").first().find("div.chat-body div.lecture-step").last().find("h5.lecture-step-title").append("<span class='badge badge-primary'>" + answers_count + " odpovědi</span>");
        }
    }
    //$('body').tooltip({selector:'[data-toggle="tooltip"]'});
    fixSortable();

    $(".lecture-step-title").each(function () {
        var contents2check = $(this).contents();
        $(this).contents().each(function () {
            if (this.nodeType === 3) {
                if ($(this).text().trim() != "" && $(this).text().trim().length > 50) {
                    this.nodeValue = $(this).text().trim().substr(0, 50) + "...";
                }
            }
        });
    });
    $(".chat").first().addClass("open");
}

$(document).on("click", ".list-group-item[data-lecture_id]", function (event) {

    if ($(event.target).hasClass("export-lecture") || $(event.target).hasClass("edit-lecture") || $(event.target).hasClass("move-lecture-up") || $(event.target).hasClass("move-lecture-down") || $(event.target).hasClass("duplicate-lecture")) {
        event.stopPropagation();
        return false;
    }

    var lecture_id = $(this).attr("data-lecture_id");
    var course_id = $("#back2courses").attr("data-course_id");
    $.ajax({
        type: 'POST',
        url: '/admin/ajax/lecture/' + lecture_id,
        contentType: 'application/json',
        success: function (result) {
            if (result.status) {
                $("#loader li.list-group-item").removeClass("open-chat");
                $("#loader li.list-group-item[data-lecture_id='" + result.data.id + "']").addClass("open-chat");
                history.replaceState(null, null, "/admin/courses/" + course_id + "?lecture_id=" + result.data.id);
                $("#lecture_name").val(htmlDecode(result.data.name));
                $("#lecture_description").val(htmlDecode(result.data.description));
                renderLecture(result.data);
                localStorage.clear();
                $("#rw-messages").empty();
                $("#rasaWebchatPro").remove();
                $("#search").val("");
                fixSortable();

                if ($(window).width() <= 1200) {
                    $(".sidebar-body.scroller").hide();
                }

                // WebChat.default({
                // 	title: "Test lekce",
                // 	inputTextFieldHint: "Zde můžete napsat zprávu",
                // 	customData: { language: "en", lecture_id: result.data.id },
                // 	socketUrl: "https://rasa.2px.cz",
                //   },
                //   null
                // );
            }
        }
    });
});

$(document).on("click", ".list-group-item[data-course_id]", function (event) {
    var course_id = $(this).attr("data-course_id");
    var course_name = $(this).find("h5").first().text();

    if ($(event.target).hasClass("share-course") || $(event.target).hasClass("export-course") || $(event.target).hasClass("edit-course") || $(event.target).hasClass("text-danger") || !course_id || $(event.target).hasClass("duplicate-course")) {
        event.stopPropagation();
        return false;
    }

    $("#search").trigger("input");
    $("#loader li.list-group-item").removeClass("open-chat");

    history.replaceState(null, null, "/admin/courses/" + course_id);

    if ($("#back2courses").length < 1) {
        $("#courses header div.d-flex.align-items-center a").first().remove();
        $("#courses header div.d-flex.align-items-center").first().prepend(`
		<a class="btn btn-outline-light" href="javascript:void(0);" id="back2courses" data-course_id="`+ course_id + `">
			<i class="fas fa-arrow-left"></i>
		</a>`);
    }

    $("#courses ul.list-inline a.btn.btn-outline-light").attr("data-target", "#newLectureModal");

    $("#courses header span").first().text(course_name);
    $("#search").attr("placeholder", "Hledat v lekcích kurzu");

    $("#loader li.list-group-item[data-course_id='" + course_id + "']").addClass("open-chat");
});

$(document).on("click", "#back2courses", function () {
    history.replaceState(null, null, "/admin/courses");
    $("#back2courses").first().remove();
    localStorage.removeItem("chat_session");
    $("#courses header span").first().text("Kurzy");
    $("#loader li.list-group-item").removeClass("open-chat");
    $("#courses ul.list-inline a.btn.btn-outline-light").attr("data-target", "#newCourseModal");
    $("#search").attr("placeholder", "Hledat v kurzech");
    $("#search").val("");
    $("#search").trigger("input");
    $(".chat-header").remove();
    $(".chat-body").first().empty();
    $(".chat-body").first().html(`
	<div class="chat-body">
		<div class="no-message-container">
			<div class="row my-5">
				<div class="col-md-4 offset-4">
					<img src="${PROJECT_URL}/static/media/svg/undraw_empty_xct9.svg" class="img-fluid" alt="image">
				</div>
			</div>
			<div class="row my-5">
				<div class="col-md-4 offset-md-4">
					<p class="lead">Vyberte si z bočního menu</p>
				</div>
			</div>
		</div>
	</div>`);
});

$(document).on("click", "#back2lectures", function () {
    var course_id = 1;
    history.replaceState(null, null, "/admin/courses/" + course_id);
    $("div.open").first().removeClass("open");
    $("#loader li.list-group-item").removeClass("open-chat");
    $("div.sidebar-body.scroller").show();
});

$("#lecture-delete").on("click", function () {
    var lecture_id = $("#loader li.list-group-item.open-chat").first().attr("data-lecture_id");
    $.ajax({
        type: 'POST',
        url: '/admin/lectures/' + lecture_id + '/delete',
        contentType: 'application/json',
        success: function (data) {
            if (data.status) {
                var item = $("#loader").find("li.list-group-item[data-lecture_id='" + lecture_id + "']").first();
                item.remove();
                refreshView();
                history.replaceState(null, null, "/admin/courses");
            } else {
                $("#search").trigger("input");
            }
            $("#deleteLectureModal").modal("hide");
        }
    });
    updateLastEditedDates();
});

$(document).on("click", ".duplicate-lecture", function () {
    var lecture_id = $(this).attr("data-lecture_id");
    $.ajax({
        type: 'POST',
        url: '/admin/lectures/' + lecture_id + '/duplicate',
        contentType: 'application/json',
        success: function (data) {
            if (data.status) {
                location.reload();
            }
        }
    });
    updateLastEditedDates();
});

$(document).on("click", ".duplicate-step", function () {
    var step_id = $(this).attr("data-step_id");
    $.ajax({
        type: 'POST',
        url: '/admin/ajax/steps/' + step_id + '/duplicate',
        contentType: 'application/json',
        success: function (data) {
            if (data.status) {
                $(".open-chat").click();
            }
        }
    });
    updateLastEditedDates();
});

$(document).on("click", ".visualize-lecture", function () {
    var lecture_id = $(this).attr("data-lecture_id");
    $.ajax({
        type: 'POST',
        url: '/admin/lectures/' + lecture_id + '/visualize',
        contentType: 'application/json',
        success: function (data) {
            if (data.status) {
                var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=500");
                win.document.body.innerHTML = data.html;
            }
        }
    });
});

// #############################################

$(document).on("click", ".add-infoitems", function () {
    var uuid4 = generate_uuid4();
    $("#newInformationModal").find("div.modal-body form").first().append(`
		<div class="infoitem">
			<hr class="hrseparator">
			<div class="form-group" style="display:none">
				<label for="step_description`+ uuid4 + `" class="col-form-label">Popis</label>
				<input type="text" class="form-control step_description" id="step_description`+ uuid4 + `" value="">
			</div>
			<div class="row">
				<div class="form-group col-md-9">
					<label for="step_type`+ uuid4 + `" class="col-form-label">Typ kroku</label>
					<div class="input-group">
						<select id="step_type`+ uuid4 + `" class="form-control step_type">
							<option value="text">Text</option>
							<option value="image">Obrázek</option>
							<option value="video">Video</option>
							<option value="link">Odkaz</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-3" style="display:flex;justify-content: end;">
					<button class="btn btn-light mr-2 duplicate-infoitem" style="border-color: #e6e6e6;align-self: flex-end;"><i class="fa fa-clone"></i></button>
					<button class="btn btn-danger remove-infoitem" style="opacity: 0.7;align-self: flex-end;" type="button" data-original-title="Delete"><i class="fa fa-trash"></i></button>
				</div>
				<div class="form-group col-md-12">
					<label for="step_text`+ uuid4 + `" class="col-form-label">Zobrazit</label>
					<input type="text" class="form-control step_text" id="step_text`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12 dropzonewrapper" style="display:flex;justify-content: end;display:none">
					<span id="dropzoneodd`+ uuid4 + `">
						<div id="dropzone`+ uuid4 + `" class="dropzone">
							<div class="fallback">
								<input name="souborp[]" type="file" multiple>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>
	`);

    $('#newInformationModal').animate({ scrollTop: $('#newInformationModal .modal-dialog').height() }, 500);

    if ($("#newInformationModal").find("div.modal-body div.infoitem").length < 4) {
        $(".add-infoitems").show();
        $("#newInformationModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-infoitems").hide();
        $("#newInformationModal div.modal-footer").css("justify-content", "end");
    }
    refreshDropzones();
});

$(document).on("click", ".duplicate-infoitem", function () {
    if ($("#newInformationModal").find("div.modal-body div.infoitem").length > 3) {
        alert("Další položky nejde vložit :-)");
    } else {
        var item2copy = $(this).closest(".infoitem");
        $("#newInformationModal").find(".add-infoitems").click();
        var item2set = $("#newInformationModal .infoitem").last();
        $(item2set).find(".step_type").first().val($(item2copy).find(".step_type").first().val());
        $(item2set).find(".step_type").first().trigger("change");
        $(item2set).find(".step_text").first().val($(item2copy).find(".step_text").first().val());
        $(item2set).find(".dz-default.dz-message").hide();

        if ($(item2set).find(".step_type").first().val() == "image") {
            if ($(item2set).find(".step_text").first().val() != "") {
                $(item2set).find(".dropzone").append(`
				<div class="dz-preview dz-image-preview">
					<div class="dz-image">
						<img data-dz-thumbnail="" src="${PROJECT_URL}/static/uploads/` + $(item2set).find(".step_text").first().val() + `">
					</div>
					<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">✘</a>
				</div>
				`);
            } else {
                $(item2set).find(".dropzone .dz-default.dz-message").show();
            }
        }
    }
    if ($("#newInformationModal").find("div.modal-body div.infoitem").length < 4) {
        $(".add-infoitems").show();
        $("#newInformationModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-infoitems").hide();
        $("#newInformationModal div.modal-footer").css("justify-content", "end");
    }
    event.preventDefault();
});

$(document).on("click", ".remove-infoitem", function () {
    var infoitem = $(this).closest(".infoitem");
    var step_id = $(this).attr("data-step_id");
    if (step_id) {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    infoitem.remove();
                }
            }
        });
    } else {
        infoitem.remove();
    }
    if ($("#newInformationModal").find("div.modal-body div.infoitem").length < 4) {
        $(".add-infoitems").show();
        $("#newInformationModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-infoitems").hide();
        $("#newInformationModal div.modal-footer").css("justify-content", "end");
    }
    updateLastEditedDates();
});

$(document).on("click", "#information-save", function () {
    var lecture_id = $(this).attr("data-lecture_id");
    var data2save = [];
    var infoitems = $("#newInformationModal").find(".infoitem");

    for (var i = 0; i < infoitems.length; i++) {
        data2save.push({
            "step_description": ((i == 0) ? $("#step_description").val() : $(infoitems[i]).find(".step_description").first().val()),
            "step_type": $(infoitems[i]).find(".step_type").first().val(),
            "step_text": $(infoitems[i]).find(".step_text").first().val(),
            "step_id": $(infoitems[i]).attr("data-step_id")
        });
    }

    $.ajax({
        type: 'POST',
        url: '/admin/steps/new',
        contentType: 'application/json',
        data: JSON.stringify({ "steps": data2save, "response_type": "information", "lecture_id": lecture_id }),
        success: function (data) {
            if (data.status) {
                $("#newInformationModal").modal("hide");
                $("#newStepModal").modal("hide");
                $(".open-chat").click();
            }
        }
    });
    updateLastEditedDates();
});

$("#newInformationModal").on("show.bs.modal", function (e) {
    $("#newInformationModal #information-save").first().attr("data-lecture_id", "");
    var related_target = $(e.relatedTarget);
    var lecture_id = related_target.attr("data-lecture_id");
    var step_id = related_target.attr("data-step_id");
    $("#newInformationModal #information-save").first().attr("data-lecture_id", lecture_id);

    if (step_id > 0) {
        //$("#newInformationModal").find("h5.modal-title span").text("Editovat informaci");
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    renderInformation(result.data);
                }
            }
        });
    } else {
        //$("#newInformationModal").find("h5.modal-title span").text("Nová informace");
        $("#newInformationModal .step_description").first().val("");
        $("#newInformationModal .step_text").first().val("");
        $(".infoitem").not(':first').remove();
        $("#newInformationModal .infoitem").first().attr("data-step_id", "");
        $("#newInformationModal .infoitem").first().find(".step_type").first().val("text");
        $("#newInformationModal .infoitem").first().find(".step_text").first().val("");
        $("#newInformationModal .infoitem").first().find(".step_type").first().trigger("change");
        $("#newInformationModal .dz-image-preview").remove();
        $("#newInformationModal .dz-default.dz-message").show();
    }
});

$("#newInformationModal").on("shown.bs.modal", function (e) {
    refreshDropzones();
});

$("#deleteInformationModal").on("show.bs.modal", function (e) {
    $("#deleteInformationModal #information-delete").first().attr("data-step_id", "");
    var related_target = $(e.relatedTarget);
    var step_id = related_target.attr("data-step_id");
    $("#deleteInformationModal #information-delete").first().attr("data-step_id", step_id);
});

$("#information-delete").on("click", function () {
    var step_id = $(this).attr("data-step_id");
    if (step_id > 0 && step_id != "") {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    $("#deleteInformationModal").modal("hide");
                    $(".edit-step[data-step_id='" + step_id + "']").first().closest(".lecture-step-wrapper").remove();
                }
            }
        });
    }
    updateLastEditedDates();
});

///////////////////////////////////////////////////////

$("#newQuestionModal").on("show.bs.modal", function (e) {
    $("#newQuestionModal #question-save").first().attr("data-lecture_id", "");
    var related_target = $(e.relatedTarget);
    var lecture_id = related_target.attr("data-lecture_id");
    var step_id = related_target.attr("data-step_id");
    $("#newQuestionModal #question-save").first().attr("data-lecture_id", lecture_id);
    $("#newQuestionModal #question_free_input").prop("checked", false);
    $("#newQuestionModal .dz-image-preview").remove();
    $("#newQuestionModal .dz-default.dz-message").show();
    if (step_id > 0) {
        $("#newQuestionModal").find("h5.modal-title span").text("Editovat otázku");
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    let data = result.data.shift();
                    $("#newQuestionModal #question_description").val(data.description);
                    $("#newQuestionModal #question_text").val(data.text);
                    $("#newQuestionModal #question_text3").val(data.text3);
                    $("#newQuestionModal #question_free_input").prop("checked", data.free_input);
                    $("#newQuestionModal #question-save").attr("data-step_id", data.id);

                    if (data.text2 != "") {
                        $("#newQuestionModal").find(".dropzone").first().append(`
						<div class="dz-preview dz-image-preview">
							<div class="dz-image">
								<img data-dz-thumbnail="" src="${PROJECT_URL}/static/uploads/` + data.text2 + `">
							</div>
							<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">✘</a>
						</div>
						`);
                        $("#newQuestionModal #question_text2").val(data.text2);
                        $("#newQuestionModal .dz-default.dz-message").hide();
                    }
                }
            }
        });
    } else {
        $("#newQuestionModal").find("h5.modal-title span").text("Nová otázka");
        $("#newQuestionModal #question_description").val("");
        $("#newQuestionModal #question_text").val("");
        $("#newQuestionModal #question_text2").val("");
        $("#newQuestionModal #question_text3").val("");
        $("#newQuestionModal #question-save").attr("data-step_id", "");
    }
    refreshDropzones();
});

$("#question-save").on("click", function () {
    let step_id = $(this).attr("data-step_id");
    let lecture_id = $(this).attr("data-lecture_id");

    let data2save = [{
        "step_description": $("#newQuestionModal #question_description").first().val(),
        "step_text": $("#newQuestionModal #question_text").first().val(),
        "step_text2": $("#newQuestionModal #question_text2").first().val(),
        "step_text3": $("#newQuestionModal #question_text3").first().val(),
        "step_id": step_id
    }];

    var free_input = $("#question_free_input").first().prop("checked");

    $.ajax({
        type: 'POST',
        url: '/admin/steps/new',
        contentType: 'application/json',
        data: JSON.stringify({ "steps": data2save, "response_type": "question", "lecture_id": lecture_id, "free_input": free_input }),
        success: function (data) {
            if (data.status) {
                $("#newQuestionModal").modal("hide");
                $("#newStepModal").modal("hide");

                if (!step_id || step_id == "") {

                    if (free_input) {
                        var answers2save = [
                            { "answer_text2": "", "answer_type": "text", "text2match": "", "text": "Správná odpověď" },
                            { "answer_text2": "", "answer_type": "text", "text2match": "", "text": "Cokoliv jiného" },
                            { "answer_text2": "", "answer_type": "text", "text2match": "", "text": "2x špatně" },
                        ]

                        for (var i = 0; i < answers2save.length; i++) {
                            $.ajax({
                                type: 'POST',
                                url: '/admin/ajax/answers/new',
                                contentType: 'application/json',
                                data: JSON.stringify(Object.assign({}, { "step_id": data.step_id }, answers2save[i])),
                                success: function (data) {
                                    if (data.status) {

                                    }
                                }
                            });
                        }
                        $(".open-chat").click();

                    } else {
                        $.ajax({
                            type: 'POST',
                            url: '/admin/ajax/answers/new',
                            contentType: 'application/json',
                            data: JSON.stringify({ "step_id": data.step_id, "text2match": "První dočasná odpověď" }),
                            success: function (data) {
                                if (data.status) {
                                    $(".open-chat").click();
                                }
                            }
                        });
                    }

                } else {
                    $(".open-chat").click();
                }
            }
        }
    });
    updateLastEditedDates();
});

$("#deleteQuestionModal").on("show.bs.modal", function (e) {
    $("#deleteQuestionModal #question-delete").first().attr("data-step_id", "");
    var related_target = $(e.relatedTarget);
    var step_id = related_target.attr("data-step_id");
    $("#deleteQuestionModal #question-delete").first().attr("data-step_id", step_id);
});

$("#question-delete").on("click", function () {
    var step_id = $(this).attr("data-step_id");
    if (step_id > 0 && step_id != "") {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    $("#deleteQuestionModal").modal("hide");
                    $(".edit-step[data-step_id='" + step_id + "']").first().closest(".lecture-step-wrapper").remove();
                }
            }
        });
    }
    updateLastEditedDates();
});

$("#newAnswerModal").on("show.bs.modal", function (e) {
    $("#newAnswerModal #answer-save").first().attr("data-step_id", "");
    $("#newAnswerModal #answer-save").first().attr("data-answer_id", "");
    var related_target = $(e.relatedTarget);
    var step_id = related_target.attr("data-step_id");
    var answer_id = related_target.attr("data-answer_id");
    $("#newAnswerModal #answer-save").first().attr("data-answer_id", answer_id);
    $("#newAnswerModal #answer-save").first().attr("data-step_id", step_id);

    if (answer_id > 0) {
        $("#newAnswerModal").find("h5.modal-title span").text("Editovat odpověď");
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/answers/' + answer_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    renderAnswer(result.data);
                }
            }
        });
    } else {
        $("#newAnswerModal").find("h5.modal-title span").text("Nová odpověď");
        $("#newAnswerModal #answer_text2match").val("");
        $("#newAnswerModal #answer_description").val("");
        $("#newAnswerModal #answer_text").val("");
        $("#newAnswerModal #answer_text2").val("");
        $("#newAnswerModal #answer_following_action").val("");
        $("#newAnswerModal #answer_following_action_id").val("");
        $("#newAnswerModal #answer_correct").prop("checked", false);
        $("#newAnswerModal #answer-save").attr("data-answer_id", "");
        $("#newAnswerModal").find(".answeritems").empty();
        let uuid4 = generate_uuid4();
        $("#newAnswerModal .modal-body .answeritems").append(`
		<div class="answeritem" data-answer_id="">
			<div class="row">
				<div class="form-group col-md-9">
					<label for="step_type`+ uuid4 + `" class="col-form-label">Typ kroku</label>
					<div class="input-group">
						<select id="answer_type`+ uuid4 + `" class="form-control answer_type">
							<option value="text">Text</option>
							<option value="image">Obrázek</option>
							<option value="video">Video</option>
							<option value="link">Odkaz</option>
							<option value="pause">Pauza</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-3" style="display:flex;justify-content: start;">
					<button class="btn btn-light mr-2 duplicate-answeritem" style="border-color: #e6e6e6;align-self: flex-end;margin-left: -5px;"><i class="fa fa-clone"></i></button>
				</div>
				<div class="form-row pausepicking" style="display:none">
					<div class="form-group col-md-6">
						<label for="pause_text`+ uuid4 + `" class="col-form-label">Čekej</label>
						<input type="number" class="form-control pause_text" id="pause_text`+ uuid4 + `">
					</div>
					<div class="form-group col-md-6">
						<label for="pause_text2`+ uuid4 + `" class="col-form-label">Jednotka</label>
						<select class="form-control pause_text2" id="pause_`+ uuid4 + `">
							<option value="now">ihned</option>
							<option value="seconds">vteřin</option>
							<option value="minutes">minut</option>
							<option value="hours">hodin</option>
							<option value="days">dnů</option>
							<option value="still">stále</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-12" style="display:none">
					<label for="answer_description`+ uuid4 + `" class="col-form-label">Popis</label>
					<input type="text" class="form-control answer_description" id="answer_description`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12">
					<label for="answer_text2`+ uuid4 + `" class="col-form-label">Zobrazit</label>
					<input type="text" class="form-control answer_text2" id="answer_text2`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12 dropzonewrapper" style="display:flex;justify-content: end;display:none;">
					<span id="dropzoneodd`+ uuid4 + `">
						<div class="dropzone">
							<div class="fallback">
								<input name="souborp[]" type="file" multiple>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>`);
    }
});

$("#newAnswerModal").on("shown.bs.modal", function (e) {
    refreshDropzones();
});

$(document).on("click", ".add-answeritems", function () {
    var uuid4 = generate_uuid4();
    $("#newAnswerModal").find("div.modal-body .answeritem").last().after(`
		<div class="answeritem">
			<hr class="hrseparator">
			<div class="row">
				<div class="form-group col-md-9">
					<label for="answer_type`+ uuid4 + `" class="col-form-label">Typ odpovědi</label>
					<div class="input-group">
						<select id="answer_type`+ uuid4 + `" class="form-control answer_type">
							<option value="text">Text</option>
							<option value="image">Obrázek</option>
							<option value="video">Video</option>
							<option value="link">Odkaz</option>
							<option value="pause">Pauza</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-3" style="display:flex;justify-content: start;">
					<button class="btn btn-light mr-2 duplicate-answeritem" style="border-color: #e6e6e6;align-self: flex-end;margin-left: -5px;"><i class="fa fa-clone"></i></button>
					<button class="btn btn-danger remove-answeritem" style="opacity: 0.7;align-self: flex-end;" type="button" data-original-title="Delete"><i class="fa fa-trash"></i></button>
				</div>
				<div class="form-row pausepicking" style="display:none">
					<div class="form-group col-md-6">
						<label for="pause_text`+ uuid4 + `" class="col-form-label">Čekej</label>
						<input type="number" class="form-control pause_text" id="pause_text`+ uuid4 + `">
					</div>
					<div class="form-group col-md-6">
						<label for="pause_text2`+ uuid4 + `" class="col-form-label">Jednotka</label>
						<select class="form-control pause_text2" id="pause_`+ uuid4 + `">
							<option value="now">ihned</option>
							<option value="seconds">vteřin</option>
							<option value="minutes">minut</option>
							<option value="hours">hodin</option>
							<option value="days">dnů</option>
							<option value="still">stále</option>
						</select>
					</div>
				</div>
				<div class="form-group col-md-12" style="display:none">
					<label for="step_description`+ uuid4 + `" class="col-form-label">Popis</label>
					<input type="text" class="form-control answer_description" id="answer_description`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12">
					<label for="answer_text2`+ uuid4 + `" class="col-form-label">Zobrazit</label>
					<input type="text2" class="form-control answer_text2" id="answer_text2`+ uuid4 + `" value="">
				</div>
				<div class="form-group col-md-12 dropzonewrapper" style="display:flex;justify-content: end;display:none">
					<span id="dropzoneodd`+ uuid4 + `">
						<div class="dropzone">
							<div class="fallback">
								<input name="souborp[]" type="file" multiple>
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>
	`);
    $('#newAnswerModal').animate({ scrollTop: $('#newAnswerModal .modal-dialog').height() }, 500);

    if ($("#newAnswerModal").find("div.modal-body div.answeritem").length < 4) {
        $(".add-answeritems").show();
        $("#newAnswerModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-answeritems").hide();
        $("#newAnswerModal div.modal-footer").css("justify-content", "end");
    }
    refreshDropzones();
});

$(document).on("click", ".duplicate-answeritem", function () {
    if ($("#newAnswerModal").find("div.modal-body div.answeritem").length > 3) {
        alert("Další položky nejde vložit :-)");
    } else {
        var item2copy = $(this).closest(".answeritem");
        $("#newAnswerModal").find(".add-answeritems").click();
        var item2set = $("#newAnswerModal .answeritem").last();

        $(item2set).find(".answer_type").first().val($(item2copy).find(".answer_type").first().val());
        $(item2set).find(".answer_type").first().trigger("change");
        $(item2set).find(".answer_description").first().val($(item2copy).find(".answer_description").first().val());
        $(item2set).find(".answer_text2").first().val($(item2copy).find(".answer_text2").first().val());

        $(item2set).find(".dz-default.dz-message").hide();

        if ($(item2set).find(".answer_type").first().val() == "image") {
            if ($(item2set).find(".answer_text2").first().val() != "") {
                $(item2set).find(".dropzone").append(`
				<div class="dz-preview dz-image-preview">
					<div class="dz-image">
						<img data-dz-thumbnail="" src="${PROJECT_URL}/static/uploads/` + $(item2set).find(".answer_text2").first().val() + `">
					</div>
					<a class="dz-remove" href="javascript:undefined;" data-dz-remove="">✘</a>
				</div>
				`);
            } else {
                $(item2set).find(".dropzone .dz-default.dz-message").show();
            }
        } else if ($(item2set).find(".answer_type").first().val() == "pause") {
            $(item2set).find(".pause_text").first().val($(item2copy).find(".pause_text").first().val());
            $(item2set).find(".pause_text2").first().val($(item2copy).find(".pause_text2").first().val());
        }
    }
    if ($("#newAnswerModal").find("div.modal-body div.answeritem").length < 4) {
        $(".add-answeritems").show();
        $("#newAnswerModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-answeritems").hide();
        $("#newAnswerModal div.modal-footer").css("justify-content", "end");
    }
    event.preventDefault();
});

$(document).on("click", ".remove-answeritem", function () {
    var answeritem = $(this).closest(".answeritem");
    var answer_id = $(this).attr("data-answer_id");
    if (answer_id) {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/answers/' + answer_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    answeritem.remove();
                }
            }
        });
    } else {
        answeritem.remove();
    }

    if ($("#newAnswerModal").find("div.modal-body div.answeritem").length < 4) {
        $(".add-answeritems").show();
        $("#newAnswerModal div.modal-footer").css("justify-content", "space-between");
    } else {
        $(".add-answeritems").hide();
        $("#newAnswerModal div.modal-footer").css("justify-content", "end");
    }
    updateLastEditedDates();
});

$("#answer-save").on("click", function (event) {

    if ($("#answer_text2match").val().length > 50) {
        alert("Text 'Pokud student odpoví' je příliš dlouhý! Maximum je 50 znaků");
        return false;
    }
    var step_id = $(this).attr("data-step_id");
    var data2save = [];
    var answeritems = $("#newAnswerModal").find(".answeritem");

    for (var i = 0; i < answeritems.length; i++) {
        data2save.push({
            "answer_description": (($(answeritems[i]).find(".answer_type").first().val() == "pause") ? $(answeritems[i]).find(".pause_text").val() : $(answeritems[i]).find(".answer_description").first().val()),
            "answer_type": $(answeritems[i]).find(".answer_type").first().val(),
            "answer_text2": (($(answeritems[i]).find(".answer_type").first().val() == "pause") ? $(answeritems[i]).find(".pause_text2").val() : $(answeritems[i]).find(".answer_text2").first().val()),
            "answer_id": $(answeritems[i]).attr("data-answer_id"),
        });
    }

    $.ajax({
        type: 'POST',
        url: '/admin/ajax/answers/new',
        contentType: 'application/json',
        data: JSON.stringify({ "answers": data2save, "text2match": $("#answer_text2match").val(), "text": $("#answer_text").val(), "step_id": step_id, "following_action": $("#answer_following_action").val(), "following_action_id": $("#answer_following_action_id").val(), "correct_answer": $("#answer_correct").prop("checked") }),
        success: function (data) {
            if (data.status) {
                $("#newAnswerModal").modal("hide");

                var lecture_id = $("#loader li.list-group-item.open-chat").attr("data-lecture_id");
                $.ajax({
                    type: 'POST',
                    url: '/admin/ajax/lecture/' + lecture_id,
                    contentType: 'application/json',
                    success: function (result) {
                        if (result.status) {
                            $("#loader li.list-group-item").removeClass("open-chat");
                            $("#loader li.list-group-item[data-lecture_id='" + result.data.id + "']").addClass("open-chat");
                            $("#lecture_name").val(htmlDecode(result.data.name));
                            $("#lecture_description").val(htmlDecode(result.data.description));
                            renderLecture(result.data);
                            $(".delete-step[data-step_id='" + step_id + "']").closest(".lecture-step-wrapper").find("button.collapse-step").click();
                        }
                    }
                });
            }
        }
    });
    updateLastEditedDates();
});

$("#deleteAnswerModal").on("show.bs.modal", function (e) {
    $("#deleteAnswerModal #answer-delete").first().attr("data-answer_id", "");
    var related_target = $(e.relatedTarget);
    var answer_id = related_target.attr("data-answer_id");
    $("#deleteAnswerModal #answer-delete").first().attr("data-answer_id", answer_id);
});

$("#answer-delete").on("click", function () {
    var answer_id = $(this).attr("data-answer_id");
    if (answer_id > 0 && answer_id != "") {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/answers/' + answer_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    $("#deleteAnswerModal").modal("hide");
                    $(".edit-answer[data-answer_id='" + answer_id + "']").first().closest(".lecture-step-answer").remove();
                }
            }
        });
    }
    updateLastEditedDates();
});

$("#newPauseModal").on("show.bs.modal", function (e) {
    $("#newPauseModal #pause-save").first().attr("data-lecture_id", "");
    $("#newPauseModal #pause-save").first().attr("data-step_id", "");
    var related_target = $(e.relatedTarget);
    var lecture_id = related_target.attr("data-lecture_id");
    var step_id = related_target.attr("data-step_id");
    $("#newPauseModal #pause-save").first().attr("data-lecture_id", lecture_id);
    $("#newPauseModal #pause-save").first().attr("data-step_id", step_id);

    if (step_id > 0) {
        $("#newPauseModal").find("h5.modal-title span").text("Editovat časovač");
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id,
            contentType: 'application/json',
            success: function (result) {
                if (result.status) {
                    $("#newPauseModal #pause_date").val(result.data[0].text);
                    $("#newPauseModal #pause_text").val(result.data[0].text);
                    $("#newPauseModal #pause_text2").val(result.data[0].text2);
                    $("#newPauseModal #pause_type").val(result.data[0].description);
                    $("#pause_type").trigger("change");
                }
            }
        });
    } else {
        $("#newPauseModal").find("h5.modal-title span").text("Nový časovač");
        $("#newPauseModal #pause_date").val("");
        $("#newPauseModal #pause_text").val("");
        $("#newPauseModal #pause_text2").val("");
        $("#newPauseModal #pause_type").val("");
    }
});

$("#pause-save").on("click", function () {
    var step_id = $(this).attr("data-step_id");
    var lecture_id = $(this).attr("data-lecture_id");
    var pause_text = $("#pause_text").val();
    var pause_text2 = $("#pause_text2").val();

    if ($("#pause_type").val() == "run_at") {
        pause_text = $("#pause_date").val();
        pause_text2 = "";
    }

    $.ajax({
        type: 'POST',
        url: '/admin/ajax/pause/new',
        contentType: 'application/json',
        data: JSON.stringify({ "lecture_id": lecture_id, "step_id": step_id, "text": pause_text, "text2": pause_text2, "description": $("#pause_type").val() }),
        success: function (data) {
            if (data.status) {
                $("#newStepModal").modal("hide");
                $("#newPauseModal").modal("hide");
                $(".open-chat").click();
            }
        }
    });
    updateLastEditedDates();
});

$("#deletePauseModal").on("show.bs.modal", function (e) {
    $("#deletePauseModal #pause-delete").first().attr("data-step_id", "");
    var related_target = $(e.relatedTarget);
    var step_id = related_target.attr("data-step_id");
    $("#deletePauseModal #pause-delete").first().attr("data-step_id", step_id);
});

$("#pause-delete").on("click", function () {
    var step_id = $(this).attr("data-step_id");
    if (step_id > 0 && step_id != "") {
        $.ajax({
            type: 'POST',
            url: '/admin/ajax/steps/' + step_id + '/delete',
            contentType: 'application/json',
            success: function (data) {
                if (data.status) {
                    $("#deletePauseModal").modal("hide");
                    $(".edit-step[data-step_id='" + step_id + "']").first().closest(".lecture-step-wrapper").remove();
                }
            }
        });
    }
    updateLastEditedDates();
});

$("#answer_following_action").on("change", function () {
    if (["lecture", "step", "course", "gdpr", "code"].includes($("#answer_following_action").val())) {
        $("#answer_following_action_id").replaceWith('<select class="form-control" id="answer_following_action_id"></select>');
        $("#answer_following_action_id").closest(".form-group").show();
        var lecture_id = $(".list-group-item.open-chat").first().attr("data-lecture_id");
        var course_id = $("#back2courses").first().attr("data-course_id");
        var action_value = $("#answer_following_action_id").val();
        $("label[for='answer_following_action_id']").first().text("Upřesnění");
        var url2use = "";
        if ($("#answer_following_action").val() == "lecture") {
            url2use = "/admin/ajax/lectures/dropdown?course_id=" + course_id;
        } else if ($("#answer_following_action").val() == "step") {
            url2use = "/admin/ajax/lecture2steps/" + lecture_id + "/dropdown";
        } else if ($("#answer_following_action").val() == "gdpr") {
            url2use = "";
            // todo: getting some data via ajax
            $("label[for='answer_following_action_id']").first().text("Spustit akci");
            $("#answer_following_action_id").empty();
            $("#answer_following_action_id").append($('<option>', { value: 1, text: "GDPR1" }));
            $("#answer_following_action_id").append($('<option>', { value: 2, text: "GDPR2" }));
        } else if ($("#answer_following_action").val() == "code") {
            url2use = "";
            $("#answer_following_action_id").replaceWith('<input class="form-control" id="answer_following_action_id">');
            $("#answer_following_action_id").val(following_action_id);
        } else {
            url2use = "/admin/ajax/courses/dropdown";
        }

        if (url2use != "") {
            $.ajax({
                dataType: "json",
                url: url2use,
                contentType: "application/json",
                success: function (result) {
                    if (result.status) {
                        $("#answer_following_action_id").empty();
                        for (var j = 0; j < result.data.length; j++) {
                            $("#answer_following_action_id").append($('<option>', { value: result.data[j].id, text: result.data[j].title }));
                        }
                        $("#answer_following_action_id option[value='" + $("#answer_following_action_id").val() + "']").prop("selected", true);
                    }
                }
            });
        }

    } else {
        $("#answer_following_action_id").closest(".form-group").hide();
    }
});

$("#pause_text2").on("change", function () {
    if (["now", "still"].includes($("#pause_text2").val())) {
        $("#pause_text").val("");
    } else {
        $("#pause_text").val("1");
    }
});

function updateLastEditedDates() {
    var course_id = $("#back2courses").first().attr("data-course_id");
    $.ajax({
        dataType: "json",
        url: "/admin/ajax/lectures/last-edited?course_id=" + course_id,
        contentType: "application/json",
        success: function (result) {
            if (result.status) {
                for (var i = 0; i < result.data.length; i++) {
                    var item2find = $(".list-group-item[data-lecture_id='" + result.data[i].id + "']");
                    if (item2find.length > 0) {
                        $(item2find).find(".users-list-action .text-muted").text(result.data[i].last_edited);
                    }
                }
            }
        }
    });
}

$(document).on("mouseover", ".dropzone", function () {
    $(this).addClass("allowedpasting");
});

$(document).on("mouseout", ".dropzone", function () {
    $(this).removeClass("allowedpasting");
});


function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

$(document).on("click", ".sidebar-close", function () {
    $("a.btn.btn-outline-light.active[data-navigation-target]").removeClass("active");
});

$(window).on("resize", function () {
    if ($(".chat").first().hasClass("open")) {
        if ($(window).width() <= 1200) {
            $(".sidebar-body.scroller").hide();
        } else {
            $(".sidebar-body.scroller").show();
        }
    }
});

$(document).on("click", ".export-lecture", function () {
    var lecture_id = $(this).attr("data-lecture_id");

    if (lecture_id > 0) {
        window.open("/admin/lectures/" + lecture_id + "/export");
    }
});

$(document).on("click", ".export-course", function () {
    var course_id = $(this).attr("data-course_id");

    if (course_id > 0) {
        window.open("/admin/courses/" + course_id + "/export");
    }
});

$(document).on("click", ".share-course", function () {
    var course_id = $(this).attr("data-course_id");

    $.ajax({
        dataType: "json",
        url: "/admin/courses/" + course_id + "/share",
        contentType: "application/json",
        success: function (result) {
            if (result?.hash) {
                window.open("/course/" + result.hash);
            } else {
                alert("unallowed course");
            }
        }
    });
});

$(document).on("click", "#chatswithnlu .list-group-item[data-sender_id]", function (event) {
    var sender_id = $(this).attr("data-sender_id");

    if ($(event.target).hasClass("text-danger") || !sender_id) {
        event.stopPropagation();
        return false;
    }

    $("#loader li.list-group-item").removeClass("open-chat");

    getJSONconversation(sender_id);
    history.replaceState(null, null, "/admin/chats-with-nlu/" + sender_id);
    $("#loader li.list-group-item[data-sender_id='" + sender_id + "']").addClass("open-chat");
    $(".chat").first().addClass("open");
});

$(document).on("click", "a[href='#importcoursefromlibrary']", function () {
    $(".courses2import").first().empty();
    $.getJSON(LIBRARY_URL, function (data) {
        $(".courses2import").first()
        for (var i = 0; i < data.length; i++) {
            $(".courses2import").first().append(`
			<div class="loadremote" data-course_id="`+ encodeHTML(data[i].id.toString()) + `">
				<span style="display: inline-flex;align-items: center;">`+ encodeHTML(data[i].name) + `</span>
				<button class="btn btn-primary loadremotecourse">Importovat</button>
			</div>
			`);
        }
    });
});

$(document).on("click", "a[href='#importlecturefromlibrary']", function () {
    $(".lectures2import").first().empty();
    $.getJSON(LIBRARY_URL, function (data) {
        $(".lectures2import").first()
        for (var i = 0; i < data.length; i++) {

            let html2append = ``;
            html2append = `
			<div class="loadremote" style="display:inline-block">
				<span style="display: inline-flex;align-items: center;">`+ encodeHTML(data[i].name) + `</span>`;

            for (var j = 0; j < data[i].lectures.length; j++) {
                html2append += `
				<div class="remotelecturewrapper loadremote" data-lecture_id="`+ encodeHTML(data[i].lectures[j].id.toString()) + `">
					<span style="display: inline-flex;align-items: center;">`+ encodeHTML(data[i].lectures[j].name) + `</span>
					<button class="btn btn-primary loadremotelecture">Importovat</button>
				</div>`;
            }

            html2append += `
			</div>
			`;
            $(".lectures2import").first().append(html2append);

        }
    });
});

$(document).on("click", ".loadremotecourse", function () {
    let course_id = $(this).closest(".loadremote").attr("data-course_id");

    if (course_id) {
        $.getJSON("https://roborec.chat/courses/" + course_id + "/export", function (data) {
            $.ajax({
                type: 'post',
                url: '/admin/courses/import',
                processData: false,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    console.log(response);
                    if (response.status) {
                        $("#newCourseModal").modal('hide');
                        window.location.reload();
                    } else {
                        if (response.msg) {
                            alert("Došlo k chybě během importu dat: " + response.msg);
                        } else {
                            alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                        }
                    }
                },
                error: function (err) {
                    console.log(err);
                    alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                }
            });
        });
    }

});

$(document).on("click", ".loadremotelecture", function () {
    let lecture_id = $(this).closest(".loadremote").attr("data-lecture_id");
    var course_id = $("#lecture-save").first().attr("data-course_id");
    if (lecture_id) {
        $.getJSON("https://roborec.chat/lectures/" + lecture_id + "/export", function (data) {
            $.ajax({
                type: 'post',
                url: '/admin/courses/' + course_id + '/import-lecture',
                processData: false,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (response) {
                    console.log(response);
                    if (response.status) {
                        $("#newLectureModal").modal('hide');
                        window.location.reload();
                    } else {
                        if (response.msg) {
                            alert("Došlo k chybě během importu dat: " + response.msg);
                        } else {
                            alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                        }

                    }
                },
                error: function (err) {
                    console.log(err);
                    alert("Došlo k chybě během importu dat - zkontrolujte JSON soubor!");
                }
            });
        });
    }
});

function open_all_steps() {
    $(".collapse-step").each(function () {
        $(this).closest(".lecture-step-wrapper").find(".lecture-step-answer").css("display", "flex");
        $(this).removeClass("collapsed-step");
    });
}
$(document).ready(function () {
    open_all_steps();
});
