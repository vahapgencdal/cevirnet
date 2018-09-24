function openCategoryMenuModal(categoryMenuId, categoryMenuName, categoryMenuStatus, categoryMenuOrderNumber, categories) {
    ClearCategoryMenuModal();

    $('#txtTitleCategoryMenu').val(categoryMenuName);
    $('#txtTitleCatDesc').val(categoryMenuStatus);
    $('#txtMenuOrder').val(categoryMenuOrderNumber);
    CategoryIdForUpdate = categoryMenuId;

    if (categoryMenuStatus == '1')
    {
        //$("#chckMenuCategoryActive").attr("checked", true);
        document.getElementById("chckMenuCategoryActive").checked = true;
    }

    else
    {
        //$("#chckMenuCategoryActive").attr("checked", true);
        document.getElementById("chckMenuCategoryActive").checked = false;
    }

    let categoryArray;
    categoryArray = JSON.parse(categories);

    for (let i=0; i < categoryArray.length; i++) {

        $('#categoriesMultipleSelect').multiselect('select', categoryArray[i].id);
    }

    //$("#categoriesMultipleSelect").val(categories[0].id);

    $('#newCategoryMenuModal').modal('show');
}

function ClearCategoryMenuModal() {
    $('#txtTitleCat').val("");
    $('#txtTitleCatDesc').val("");
    $('#txtunitName').val("");
    $('#txtunitCode').val("");
    $('#txtunitVal').val("");

    $('option', $('#categoriesMultipleSelect')).each(function(element) {
        $(this).removeAttr('selected').prop('selected', false);
    });
    $("#categoriesMultipleSelect").multiselect('refresh');

}

function OpenCategoryMenuModalForNewRecord () {
    CategoryIdForUpdate = 0;
    ClearCategoryMenuModal();
    $('#newCategoryMenuModal').modal('show');
}

var CategoryIdForUpdate=0;

function SaveCategoryMenuToDb() {

    let selectedCategoryIds = $("#categoriesMultipleSelect").val();
    let categoryMenuName = $("#txtTitleCategoryMenu").val();
    let orderNumberVal = $("#txtMenuOrder").val();
    let isActive = $("#chckMenuCategoryActive").is(':checked');

    if (categoryMenuName == '') {
        $('#txtTitleCategoryMenu').css('border-color', 'red');
        return false;
    }
    else {
        $('#txtTitleCategoryMenu').css('border-color', '');

    }

    if (selectedCategoryIds == '') {
        $('#categoriesMultipleSelect').css('border-color', 'red');
        return false;
    }
    else {
        $('#categoriesMultipleSelect').css('border-color', '');

    }



    let ac = (isActive) ? 1 : 0;
    let url = "";
    let postDataForCategoryMenu = {};

    if(CategoryIdForUpdate == 0 ||CategoryIdForUpdate=='0')
    {
        url = "/admin/menuCategory/add";
        postDataForCategoryMenu = {
            name: categoryMenuName,
            status: ac,
            orderNumber: orderNumberVal,
            categoryId: JSON.stringify(selectedCategoryIds)
        }
    }
    else {
        url = "/admin/menuCategory/update";
        postDataForCategoryMenu = {
            id: CategoryIdForUpdate,
            name: categoryMenuName,
            status: ac,
            orderNumber: orderNumberVal,
            categoryId: JSON.stringify(selectedCategoryIds)
        }
    }


    $.post(url, postDataForCategoryMenu,
        function (data, status) {

            if (status == "success") {

                //$("#loading").hide();

                $('#infoCategoryMenu').css('color', 'green');
                $('#infoCategoryMenu').text(data);

                location.reload();


            } else {

                $('#infoCategoryMenu').text("Mesaj iletilirken bir hata oluştu");
            }
        });
}
