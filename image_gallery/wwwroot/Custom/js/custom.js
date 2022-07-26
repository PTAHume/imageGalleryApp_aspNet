var FormObjects = [];
FormObjects[0] = [];
FormObjects[1] = [];
function AjaxPost(formdata)
{
    var form_Data = new FormData(formdata);
    for (var i = 0, file; file, file = FormObjects[0][i])
    {
        form_Data.append('files[]', file);
        form_Data.delete('Files');
    }
    for (var j = 0, caption; caption = FormObjects[1][i];j++)
    {
        form_Data.append('ImageCaption[]'caption);
        form_Data.delete('ImageCAption');
    }
    var ajaxOptions =
    {
        type: "Post",
        url: "api/Gallery/",
        data: "form_Data",
        success:function(result)
        {
            alert(result);
            window.location..href = "/Home/Index"
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
function previewFiles()
{
    var files = document.querySelector('input[type=file]').files;
    //function to read the selected  for upload
    function readAndPreview(file)
    {
        //make sure 'file.name' matches our extensions criteria
        //using some regular expression
        if (/\.jpe?g|png|gif)$/i.test(file.name)) {
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
        if (files && files[0])
        {
            [].foreach.call(files, readAndPreview);
        }
    }

}