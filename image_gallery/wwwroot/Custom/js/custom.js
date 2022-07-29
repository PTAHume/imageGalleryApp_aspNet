var FormObjects = [];
FormObjects[0] = [];
FormObjects[1] = [];
function AjaxPost(formdata)
{
    var form_Data = new FormData(formdata);
    for (var i = 0, file; file = FormObjects[0][i];i++)
    {
        form_Data.append('Files[]', file);
        form_Data.delete('Files');
    }
    for (var j = 0, caption; caption = FormObjects[1][j]; j++)
    {
        form_Data.append('ImageCaption[]',caption);
        form_Data.delete('ImageCAption');
    }
    var ajaxOptions =
    {
        type: "POST",
        url: "api/Gallery/",
        data: form_Data,
        success:function(result)
        {
            alert(result);
            window.location.href = "/Home/Index"
        }
    }
    if ($(formdata).attr('enctype') == "multipart/form-data")
    {
        ajaxOptions['contentType'] = false;
        ajaxOptions['processData'] = false;
    }
    $.ajax(ajaxOptions);
    return false;
}
// function to Preview Files


function PreviewFiles(files) {
    var files = [...files];
    //function to read the selected  for upload

    function readAndPreview(file) {
        //make sure 'file.name' matches our extensions criteria
        //using some regular expression
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();
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
    $('input[type=file],').val(null);

}

//function to remove files from array

function removeFile(item)
{
    var row = $(item).closest('tr');
    if ($("#ImageUploadTable tbody tr").length > 1)
    {
        FormObjects[0].splice(row.index(), 1);
        FormObjects[1].splice(row.index(), 1);
        row.remove();
        countTableRow();
    }
    else if ($("#ImageUploadTable tbody").length == 1)
    {
        $("#ImageUploadTable tbody").remove();
        FormObjects[0]=[];
        FormObjects[1] = [];
        countTableRow();
    } 
}
//function to clear preview table

function clearPreview()
{
    if ($("#ImageUploadTable tbody").length > 0) {
        $("#ImageUploadTable tbody tr").remove();
        $("#imgCount").html("<i class='fa fa-images'></i>" + 0);
    }
}

//function to count number of files in the table
function countTableRow() 
{
    $("#imgCount").html("<i class='fa fa-images'></i>" + $("#ImageUploadTable tbody tr").length);
}

//function to add rows to our table

function addImageRow(image)
{
    //first check if <tbody> tag already exists, if not - adding one

    if ($("#ImageUploadTable tbody").length == 0)
    {
        $("#ImageUploadTable").append("<tbody></tbody>");
        //now lets append row to the table
    }
    $("#ImageUploadTable tbody").append(BuildImageTableRow(image));
    
}
//function to delete preview row

function delPreviewRow(item)
{
    var filename = $(item).closest('[name="photo[]"]');
    alert(filename);
}
//function to create new row for each image selected to upload

function BuildImageTableRow(image)
{
    var newRow = "<tr>" +
        "<td>" +
        "<div class=''>" +
        "<img name='photo[]' style='border:1px solid' width='100' height='50' class='image-tag' src='" + image.src + "' " +
        "</>" +
        "</div>" +
        "</td>" +
        "<td>" +
            "<div class=''>" +
            "<input name='ImageCaption[]' class='form-control col-xs-3' value='' placeholder='Enter Image Caption' " +
        "/>"+
        "</div>" +
            "</td>" +
            "<td>" +
            "<div class='btn-group' role='group' aria-label='Perform Actions'>" +
            "<button type='button' name='Edit' class='btn btn-primary btn-sm' onclick=''" +
            ">" +
            "<span>" +
            "<i class='fa fa-edit'>" +
            "</i>" +
            "</span" +
            "</button>" +
            "<button type='button' name='Delete' class='btn btn-danger btn-sm' onclick='removeFile(this)'" +
            ">" +
            "<span>" +
            "<i class='fa fa-trash'>" +
            "</i>" +
            "</span>" +
            "</button>" +
            "</div>" +
            "</td>"+
            "</tr>"
    return newRow;
}