$(function () {
    loadGalleryIds();
});

const FormObjects = [];
FormObjects[0] = [];
FormObjects[1] = [];

function loadGalleryIds() {
    //call the API to get list of all gallery Ids
    $("#selectImageGallery").html("<option selected>Select Gallery ID</option>")
    $.ajax({
        type: 'GET',
        url: '/api/Gallery/',
        dataType: 'json',
        success: function (result) {
            loadGalleries(result);
        },
        error: function () {
            alert('could not load galleries');
        }
    });
}

function loadGalleries(result) {
    //loading galleries to Dropdown menu

    if (result !== null) {
        for (let i in result) {
            $("#selectImageGallery").append("<option value='" + result[i].galleryId + "'>" + result[i].title + "</option>");
        }
    }
}
function loadSlider(val) {
    $('.swiper-wrapper').empty();
    $.ajax
        ({
            type: 'GET',
            url: '../api/Gallery/' + val,
            dataType: 'json',
            success: function (data) {
                $(".swiper-wrapper").html("");
                $.each(data, function (key, value) {
                    value.image_Path = value.image_Path.replace(/\\/g, '/');
                    $('.swiper-wrapper').append("<div class='swiper-slide'><img width='100%' height='350px' src='.." + value.image_Path + "' />" + value.image_Caption + "</div>");

                });
                const swiper = new Swiper('.swiper-container', {
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'progressbar',
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });
            }
        });
}
function AjaxPost(formdata) {
    const form_Data = new FormData(formdata);
    for (var i = 0, file; file = FormObjects[0][i]; i++) {
        form_Data.append('Files[]', file);
        form_Data.delete('Files');
    }
    for (let j = 0, caption; caption = FormObjects[1][j]; j++) {
        form_Data.append('ImageCaption[]', caption);
        form_Data.delete('ImageCAption');
    }
    const ajaxOptions =
    {
        type: "POST",
        url: "api/Gallery/",
        data: form_Data,
        success: function (result) {
            alert(result);
            location.reload();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown)
        }
    }
    if ($(formdata).attr('enctype') === "multipart/form-data") {
        ajaxOptions['contentType'] = false;
        ajaxOptions['processData'] = false;
    }
    $.ajax(ajaxOptions);
    return false;
}
// function to Preview Files


function PreviewFiles(data) {
    const files = [...data];
    //function to read the selected  for upload

    function readAndPreview(file) {
        //make sure 'file.name' matches our extensions criteria
        //using some regular expression

        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                var image = new Image(200, 200);
                image.title = file.name;
                image.border = 2;
                image.src = this.result;
                addImageRow(image);//this method will create new row in table to preview each image

                countTableRow();//this method will count the total number uploaded files
                //append images to array

                FormObjects[0].push(file);
            }, false);
            reader.readAsDataURL(file);
        }

    }

    if (files && files[0]) {
        files.forEach(arg => readAndPreview(arg));
    }
    $('input[type="file"]').val(null);

}

//function to remove files from array

function removeFile(item) {
    const row = $(item).closest('tr');
    if ($("#ImageUploadTable tbody tr").length > 1) {
        FormObjects[0].splice(row.index(), 1);
        FormObjects[1].splice(row.index(), 1);
        row.remove();
        countTableRow();
    }
    else if ($("#ImageUploadTable tbody tr").length == 1) {
        $("#ImageUploadTable tbody").remove();
        FormObjects[0] = [];
        FormObjects[1] = [];
        countTableRow();
    }
}
//function to clear preview table

function clearPreview() {
    if ($("#ImageUploadTable tbody").length > 0) {
        $("#ImageUploadTable tbody tr").remove();
        $("#imgCount").html("<i class='fa fa-images'></i> " + 0);
    }
}

//function to count number of files in the table

function countTableRow() {
    $("#imgCount").html("<i class='fa fa-images'></i>" + $("#ImageUploadTable tbody tr").length);
}

//function to add rows to our table

function addImageRow(image) {
    //first check if <tbody> tag already exists, if not - adding one

    if ($("#ImageUploadTable tbody").length === 0) {
        $("#ImageUploadTable").append("<tbody></tbody>");
        //now lets append row to the table
    }
    $("#ImageUploadTable tbody").append(BuildImageTableRow(image));

}
//function to delete preview row

function delPreviewRow(item) {
    const filename = $(item).closest('[name="photo[]"]');
    alert(filename);
}
//function to create new row for each image selected to upload

function BuildImageTableRow(image) {
    const newRow = `<tr><td><div class=H"><img name="photo[]" style="border:1px solid" widht="100" height="50" class="image-tag" src="${image.src}" /> 
    </div></td><td><div class=""><input name="ImageCaption[]" class="form-control col-xs-3" value="" placeholder="Enter Image Caption" /> \
    </div></td><td><div class="btn-group" role="group" aria-label="Perform Actions"> 
    <button type="button" name="Edit" class="btn btn-primary btn-sm" onclick=""><span><i class="fa fa-edit"></i> 
    </span></button><button type="button" name="Delete" class="btn btn-danger btn-sm" onclick="removeFile(this)"><span> 
    <i class="fa fa-trash"></i></span></button></div></td></tr>`;
    return newRow;
}
function deletegallery() {
    const id = $("#selectImageGallery").val();
    $("#DeleteGalleryModal").modal('show');
    $("#DeleteGalleryModal .modal-title").html("Delete Confirmation");
    $("#DeleteGalleryModal .modal-body").html("Do You Want To Delete " + "<strong class='text-danger'><span id='toDeleteGL'>" + id + "</span></strong>" + " Gallery ? ");
}
function confirmDeleteGallery() {
    const id = $("#selectImageGallery").val();
    //handle deletion here
    $.ajax({
        type: 'DELETE',
        url: '/api/Gallery/' + id,
        dataType: 'json',
        success: function (data) {
            $("#DeleteGalleryModal").modal('hide');
            loadGalleryIds();
            loadSlider(-1);
            alert('Deleted Gallery');
        },
        error: function () {
            alert("could not Delete this Gallery");
        }
    });

}

function editgallery() {
    const id = $("#selectImageGallery").val();
    $("#EditGalleryModal").modal('show');
    $("#EditGalleryModal.modal-title").html("Edit Gallery" + id);
    $("#EditGalleryModal #galleryId").text(id);
    $.ajax({
        type: 'GET',
        url: '/api/Gallery' + id,
        dataType: 'json',
        success: function (data) {
            $("#GalleryTitleEdit").val(data[0].gallery_Title);
            $("#EditGalleryTable tbody").remove();
            $("#EditGalleryTable ").append("<tbody></tbody>");
            $.each(data, function (key, value) {
                $('#EditGalleryTable tbody').append(BuildEditRow(value));
            });
        }
    });
}
function BuildEditRow(value) {
    const newEditRow = `<tr><div> class=""><input name="Image_Id[]" hidden class="form-control col-xs-3" value="${value.image_Id}"/ > 
        <img name="photo[]" style="border:1px solid" width="100" height="50" class="image-tag" src="${value.image_Path}"/ > 
        <img name="photo[]" style="border:1px solid" width="100" height="50" class="image-tag" src="${value.image_Path}"/ > 
        </div></td><td><div class=""><input name="ImageCaption[]" class="form-control col-xs-3" value="${value.image_Caption}" placeholder="Enter Image Caption""/ >
        </div></td><td><div class="btn-group" role="group" aria-label="Perform Actions"><input type="file" name="File[]" style="display:none" onchange="previewImg(this)""/>
        <button type="button" name="Upload" class="btn btn-success btn-sm" onclick="openFileExplorer(this)""><span>
        <i class="fa fa-upload"></i></span></button></div></td></tr>`;
    return newEditRow;
}
// open the file explorer
function openFileExplorer(item) {
    $(item).closest("tr").find("input[type='file']").trigger('click')

}
// Function to Preview upload image
function previewImg(input) {
    const parent_element = $(input).closest("tr");
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $(parent_element).find('img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

const GalleryObjects = [];
GalleryObjects[0] = []; //contins image Id's
GalleryObjects[1] = []; //contains image captions
function ajaxUpdateGallery(formData) {
    const form_Data = new FormData(formData);
    const ids = form_Data.getAll('Image_Id[]');
    const captions = form_Data.getAll('ImageCaption[]');
    for (let counter = 0; counter < ids.length; counter++) {
        GalleryObjects[0].push(ids[counter]);
        GalleryObjects[1].push(captions[counter]);
    }
    for (let i = 0, imageCaption, imageId; imageCaption === GalleryObjects[1][i], imageId === GalleryObjects[0][i]; i++) {
        form_Data.append('image_Id[]', imageId);
        form_Data.delete('image_Id[]');
        form_Data.append('imageCaption[]', imageCaption);
        form_Data.delete('imageCaption[]');
    }
    const id = $("#EditGalleryModal #galleryId").text();
    const ajaxOptions =
    {
        type: 'PUT',
        url: "/api/Gallery/" + id,
        data: form_Data,
        success: function () {
            alert("gallery updated succesfully");
            location.reload();
        },
        error: function () {
            alert("couldn't update gallery");
        }
    }
    if ($(formData).attr('enctype') === "multipart/form-data") {
        ajaxOptions["contentType"] = false;
        ajaxOptions["processdata"] = false;
    }
    $.ajax(ajaxOptions);
    return false;
}