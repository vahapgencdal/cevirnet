var globalcategory={
    name:"",
    desc:"",
    icon:"",
    _id :"",
    subcategory:[

    ]
};
function addUnit(unit,value) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===value){
            if(globalcategory.subcategory[i].units===undefined){
                globalcategory.subcategory[i].units=[unit];
            }else{
                globalcategory.subcategory[i].units.push(unit);
            }

        }
    }
}
$(document).ready(function () {
    $('#subCategoryAdd').click(function () {
        let categoryName=$("#subCategoryName").val();
        let categoryDesc=$("#subCategoryDesc").val();

        if(categoryName===undefined){
            alert("Kategori Giriniz");
            return;
        }
        if(!hasCategory(categoryName)){
            let spanOfCat='<span class="tag label label-info mar-2 float-left" style="font-size: medium">'+
                '<a class="update" onclick=\"subCategoriesTagUpdate(this,\''+categoryName+'\',\''+categoryDesc+'\')\" style=\"color: white\">'+categoryName+'</a>'+
                '<a class="fa fa-remove pad-l-6" onclick=\"subCategoriesTagRemove(this,\''+categoryName+'\')\" style="color: white"></a></span>';
            $('#subCategoriesTag').append(spanOfCat);
            let subcategory={};
            subcategory.name=categoryName;
            subcategory.desc=categoryDesc;
            subcategory.units=[];

            globalcategory.subcategory.push(subcategory);

            $('#subCategoriesDrop').append($("<option></option>")
                .attr("value",categoryName)
                .text(categoryName));
        }else{
            alert("Aynı Alt Categoriden bir daha ekleyemezsiniz");
        }
        $("#subCategoryName").val("");
        $("#subCategoryDesc").val("");
    });

    $('#subCategoriesDrop').on('change', function(e) {
        if($('option:selected', this).val()==="-1"){
            $('#selectedSubCategory').text("");
        }else{
            $('#selectedSubCategory').text($('option:selected', this).text());
        }

        $('#unitTags').empty();
        let units=getUnits(this.value);
        let cat=this.value;
        if(units.length>0){
            units.forEach(function(unit){
                let spanOfCat='<span class="tag label label-info mar-2 float-left" style="font-size: medium">'+
                    '<a class="update" onclick=\"subUnitsTagUpdate(this,\''+unit.name+'\',\''+unit.scode+'\',\''+unit.value+'\',\''+cat+'\')\" style=\"color: white\">'+unit.name+'</a>'+
                    '<a class="fa fa-remove pad-l-6" onclick=\"subUnitsTagRemove(this,\''+unit.name+'\',\''+cat+'\')\" style="color: white"></a></span>';
                $('#unitTags').append(spanOfCat);
            });
        }
    })

    $("#txtunitAdd").click(function () {
        let txtunitName = $('#txtunitName').val();
        let txtunitCode = $('#txtunitCode').val();
        let txtunitVal = $('#txtunitVal').val();
        let subcategory = $('#selectedSubCategory').text();

        if(subcategory===undefined||subcategory===""){
            alert("Lütfen Bir categori Seçiniz");
            return;
        }
        if(txtunitName===undefined||txtunitCode===undefined||txtunitVal===undefined){
            alert("Birim İsmi, Kodu veya Değeri bilgilerinden birisini Eksik Girdiniz");
            return;
        }
        let unit={};
        unit.name=txtunitName;
        unit.scode=txtunitCode;
        unit.value=txtunitVal;
        if(!hasUnits(txtunitName,subcategory)){
            let spanOfCat='<span class="tag label label-info mar-2 float-left" style="font-size: medium">'+
                '<a class="update" onclick=\"subUnitsTagUpdate(this,\''+txtunitName+'\',\''+txtunitCode+'\',\''+txtunitVal+'\',\''+subcategory+'\')\" style=\"color: white\">'+txtunitName+'</a>'+
                '<a class="fa fa-remove pad-l-6" onclick=\"subUnitsTagRemove(this,\''+txtunitName+'\',\''+subcategory+'\')\" style="color: white"></a></span>';
            $('#unitTags').append(spanOfCat);
            addUnit(unit,subcategory);
        }else{
            alert("Aynı Unitden bir daha ekleyemezsiniz");
        }
        $('#txtunitName').val("");
        $('#txtunitCode').val("");
        $('#txtunitVal').val("");
    });

    $('#newCategoryButton').click(function () {
        refreshModal();
        $('#newCategoryModal').modal('show');
    });


});
function addUnit(unit,value) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===value){
            if(globalcategory.subcategory[i].units===undefined){
                globalcategory.subcategory[i].units=[unit];
            }else{
                globalcategory.subcategory[i].units.push(unit);
            }

        }
    }
}
function subCategoriesTagUpdate(tag,name,desc) {
    $('#subCategoryName').val(name);
    $('#subCategoryDesc').val(desc);
    removeCategory(name);
    reRenderSubCategoriesDrop(name);
    $(tag).parent().remove();

}

function subCategoriesTagRemove(tag,value) {
    $('#subCategoryName').val("");
    $('#subCategoryDesc').val("");
    removeCategory(value);
    $(tag).parent().remove();
    reRenderSubCategoriesDrop(value);
}

function subUnitsTagUpdate(tag,unitName,unitCode,unitVal,subcatName){
    $('#txtunitName').val(unitName);
    $('#txtunitCode').val(unitCode);
    $('#txtunitVal').val(unitVal);
    removeUnits(unitName,subcatName);
    $(tag).parent().remove();
}

function subUnitsTagRemove(tag,value,subcategory) {
    $('#txtunitName').val("");
    $('#txtunitCode').val("");
    $('#txtunitVal').val("");
    removeUnits(value,subcategory);
    $(tag).parent().remove();
}

function removeCategory(value) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===value){
            delete globalcategory.subcategory[i];
        }
    }
}

function removeUnits(value,subcategory) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===subcategory){
            for(let j=0;j<globalcategory.subcategory[i].units.length;j++){
                if(globalcategory.subcategory[i].units[j]!==undefined&&globalcategory.subcategory[i].units[j].name===value){
                    delete globalcategory.subcategory[i].units[j];
                }
            }
        }
    }
}

function getUnits(subcategory) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===subcategory){
            return globalcategory.subcategory[i].units;
        }
    }
}

function hasCategory(value) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===value){
            return true;
        }
    }
    return false;
}

function hasUnits(value,subcategory) {
    for(let i=0;i<globalcategory.subcategory.length;i++){
        if(globalcategory.subcategory[i]!==undefined&&globalcategory.subcategory[i].name===subcategory){
            if(globalcategory.subcategory[i].units!==undefined){
                for(let j=0;j<globalcategory.subcategory[i].units.length;j++){
                    if(globalcategory.subcategory[i].units[j]!==undefined&&globalcategory.subcategory[i].units[j].name===value){
                        return true;
                    }
                }
            }

        }
    }
    return false;
}

function reRenderSubCategoriesDrop(valOfDel) {
    $('#subcategoriesDrop').empty();
    $('#subCategoriesDrop option').each(function () {
        if($(this).html()===valOfDel){
            $(this).remove();
        }
    });
}

function openCategoryModal(category){
    refreshModal();
    globalcategory=category;
    $('#txtTitleCat').val(category.name);
    $('#txtTitleCatDesc').val(category.desc);
    category.subcategory.forEach(function(subcategory) {
        let spanOfCat='<span class="tag label label-info mar-2 float-left" style="font-size: medium">'+
            '<a class="update" onclick=\"subCategoriesTagUpdate(this,\''+subcategory.name+'\',\''+subcategory.desc+'\')\" style=\"color: white\">'+subcategory.name+'</a>'+
            '<a class="fa fa-remove pad-l-6" onclick=\"subCategoriesTagRemove(this,\''+subcategory.name+'\')\" style="color: white"></a></span>';
        $('#subCategoriesTag').append(spanOfCat);
        $('#subCategoriesDrop').append($("<option></option>")
            .attr("value",subcategory.name)
            .text(subcategory.name))
    });
    $('#subCategoriesDrop').val(category.subcategory[0].units);
    $('#selectedSubCategory').text(category.subcategory[0].name);
    category.subcategory[0].units.forEach(function(unit){
        let spanOfCat='<span class="tag label label-info mar-2 float-left" style="font-size: medium">'+
            '<a class="update" onclick=\"subUnitsTagUpdate(this,\''+unit.name+'\',\''+unit.scode+'\',\''+unit.code+'\',\''+category.subcategory[0].name+'\')\" style=\"color: white\">'+unit.name+'</a>'+
            '<a class="fa fa-remove pad-l-6" onclick=\"subUnitsTagRemove(this,\''+unit.name+'\',\''+category.subcategory[0].name+'\')\" style="color: white"></a></span>';
        $('#unitTags').append(spanOfCat);
    });
    $('#newCategoryModal').modal('show');
}

function refreshModal(){
    $('#txtTitleCat').val("");
    $('#txtTitleCatDesc').val("");
    $('#txtunitName').val("");
    $('#txtunitCode').val("");
    $('#txtunitVal').val("");
    $('#subCategoriesTag').empty();
    $('#subCategoriesDrop').empty();
    $('#subCategoriesDrop').append($("<option></option>")
        .attr("value",-1)
        .text("Seçiniz"));
    $('#unitTags').empty();
    globalcategory.name="";
    globalcategory.desc="";
    globalcategory.subcategory=[];
}

function saveCategory() {
    if ($('#txtTitleCat').val() === null ||
        $('#txtTitleCat').val() === "" ||
        $('#txtTitleCatDesc').val() === null ||
        $('#txtTitleCatDesc').val() === "") {
        alert("Kategori Adını veya Açıklamasını boş bıraktınız");
        return;
    }
    if (globalcategory.subcategory.length <= 0) {
        alert("Lütfen En az Bir altkategori Ekleyiniz");
        return;
    }
    let returnUnit = false;
    for (let i = 0; i < globalcategory.subcategory.length; i++) {
        if(globalcategory.subcategory[i]!==undefined&&(globalcategory.subcategory[i].units===undefined||globalcategory.subcategory[i].units.length<=0)){
            returnUnit=true;
        }
    }
    if (returnUnit) {
        alert("Lütfen Eklediğiniz Alt Kategorilere Birim Ekleyiniz");
        return;
    }
    let subcategories=[];
    for (let i = 0; i < globalcategory.subcategory.length; i++) {
        if (globalcategory.subcategory[i] !== undefined) {
            subcategories.push(globalcategory.subcategory[i]);
        }
    }
    for (let i = 0; i < subcategories.length; i++) {
        let units=[];
        for (let j = 0; j < subcategories[i].units.length; j++) {
            if (subcategories[i].units[j] !== undefined) {

                //İlk harf Büyük diğerleri küçük harf yapar.
                subcategories[i].units[j].name = CapitalizeFirstLetter(subcategories[i].units[j].name);
                units.push(subcategories[i].units[j]);
            }
        }
        subcategories[i].units=units;
    }

    globalcategory.subcategory=subcategories;
    globalcategory.name = $('#txtTitleCat').val();
    globalcategory.desc = $('#txtTitleCatDesc').val();


    let file =$('#fileIconCategory')[0].files[0];
    if(file!==undefined){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            sendCategory(reader.result,file.name,globalcategory)
        };
    }else{
        sendCategory("","",globalcategory);
    }

}

function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function sendCategory(file,fileName,category) {
    $.ajax({
        url: '/admin/category/saveorupdate',
        type: 'POST',
        data: JSON.stringify({file:file,fileName:fileName,category:category}),
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function (data) {
            debugger
            if (data.result === "SUCCESS") {
                alert(data.errorMessage);
                $('#newCategoryModal').modal('hide');
                location.reload();
            } else {
                alert(data.errorMessage);
                $('#newCategoryModal').modal('hide');
            }
        },
        error:function (data) {
            debugger
            alert("errorr : " + data);
        }
    });
}