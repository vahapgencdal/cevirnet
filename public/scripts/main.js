$(document).ready(function() {

    
    $(".infoBtn").hover(function() {
            $(".voiceControl .popup").stop().fadeIn("slow");
        },
        function() {
            $(".voiceControl .popup").stop().fadeOut();
        });
    $('.focusInput').focus();

    $('.menuBars').click(function() {
        $('.topMenu').toggleClass('open');
        $('body').toggleClass('openMenu');
    });

    $('.selectBoxContainer .selectBox').click(function() {
        $(this).find('i').toggleClass('fa-chevron-down');
        $(this).next('.selectBoxMenu').addClass('open');
        $(this).next('.selectBoxMenu').stop().slideToggle();

    });

    $('.selectBoxMenu ul').mCustomScrollbar({
        axis:'y',
        theme:'light-3',
    });

    $('#categoriesSelectBoxMenu .title').click(function() {
        $(this).parents('.selectBoxMenu').removeClass('open');
        $('.selectBox').find('i').removeClass('fa-chevron-down');
    });

    $('#categoriesSelectBoxMenu a').click(function() {
        let categoryId=$(this).attr("id");
        $.post("/categories/subcategories", {
                id: $(this).attr('id')
         },
        function(data, status) {
            if (status == "success") {
                renderUnits("left",data.result);
                renderUnits("right",data.result);
            } else {
                console.log(data);
            }
        });
        $(this).parents('.selectBoxMenu').removeClass('open');
        $('.selectBox').find('i').removeClass('fa-chevron-down');
    });

    $('.miniMenu ul').mCustomScrollbar({
        axis: 'x',
        theme: 'light-3',
        advanced: { autoExpandHorizontalScroll: true }
    });

    $(".miniMenu").addClass('closed');

    $('.miniMenuClose').click(function() {
        if($('.miniMenu').hasClass("closed")){
            let numberOfCats = $("#categoriesMiniMenu .mCSB_container li").length;
            numberOfCats=Math.abs(numberOfCats*7.5);
            if(numberOfCats<20){
                $("#categoriesMiniMenu").css("width",(numberOfCats+5)+"%");
            }
            else if(numberOfCats<70){
                $("#categoriesMiniMenu").css("width",numberOfCats+"%");
            }else{
                $("#categoriesMiniMenu").css("width","70%");
            }

        }else{
            $('.miniMenu').css("width",'80px');
        }

        $('.miniMenu').toggleClass('closed',1000);
        $(this).find('i').toggleClass('fa-chevron-right',1);
        $(this).find('i').toggleClass('fa-chevron-left',1);
    });
    $('.manuCategory a').click(function() {
           let id= $(this).attr('id');
           $.post("/categories", {
                id: id
            },
            function(data, status) {
                if (status == "success") {
                    //if(id==0||id==1||id==2)
                    {
                        renderCategoriesMiniMenu(data.result);
                        renderCategoriesSelectBoxMenu(data.result);
                    }
                    /*
                    else{
                        renderUnits("left",data.result);
                        renderUnits("right",data.result);
                    }
                    */
                } else {
                    console.log(status);
                }
            });
        	 $('.manuCategory a').removeClass('selected');
        	 $(this).addClass('selected');
    });

    $("#categoriesMiniMenu a").click(function() {
            $.post("/categories/subcategories", {
                id: $(this).attr('id')
            },
            function(data, status) {
                if (status == "success") {
                     renderUnits("left",data.result);
                     renderUnits("right",data.result);
                } else {
                    console.log(data);
                }
            });
    });

    $("#selcateg_mini_menu").click(function() {
        $.post("/categories/subcategories", {
                id: $(this).attr('data-id')
            },
            function(data, status) {
                if (status == "success") {
                     renderUnits("left",data.result);
                     renderUnits("right",data.result);
                } else {
                    console.log(data);
                }
            });
    });

    $('#leftInput').click(function(){
    	let rightInputValue=$(this).val();
    });
   	
   	$('#rightInput').click(function(){
   		let rightInputValue=$(this).val();
    });

    $('.leftUnitLink').click(function(){
    	let leftInputValue=$(this).val();
        // alert($(this).attr('data-value'));
    	//alert($(this).html());
    });

     $('.rightUnitLink').click(function(){
    	alert($(this).html());
    });

});

(function($){
	$(window).on("load",function(){
    	$("#units_left").mCustomScrollbar();
        $("#units_right").mCustomScrollbar();
        /*let numberOfCats = $("#categoriesMiniMenu .mCSB_container li").length;   
        numberOfCats=numberOfCats*8;
        if(numberOfCats<70){
             $("#categoriesMiniMenu").css("width",numberOfCats+"%");   
        }else{
            $("#categoriesMiniMenu").css("width","70%");   
        }
        */
    });
})(jQuery);


function renderCategoriesMiniMenu(categories) {
    $('#selcateg_mini_menu').attr('data-id',categories[0]._id).attr('class','selected ' + categories[0].icon + ' iconArea');
    $('#selcateg_mini_menu .text').text(categories[0].name);

    $("#categoriesMiniMenu .mCSB_container").empty();
    let categoriesDomLi='';
    for (let i = 1; i < categories.length; i++) {
        categoriesDomLi += '<li>' +
            '<a href=\"#\" id="' + categories[i]._id +'"   class=\"' + categories[i].icon + ' iconArea\">' +
            '<span class=\"icon\"></span>' +
            '<span class=\"text\">' + categories[i].name + '</span>' +
            '</a>' +
            '</li>';
    }
     $("#categoriesMiniMenu .mCSB_container").append(categoriesDomLi);
        let numberOfCats = $("#categoriesMiniMenu .mCSB_container li").length;
        numberOfCats=Math.abs(numberOfCats*7.5);
        if(numberOfCats<20){
            $("#categoriesMiniMenu").css("width",(numberOfCats+5)+"%");
        }
        else if(numberOfCats<70){
             $("#categoriesMiniMenu").css("width",numberOfCats+"%");   
        }else{
            $("#categoriesMiniMenu").css("width","70%");   
        }
    $('.miniMenu').removeClass("closed");

    // renderUnits()
    renderUnits("left",categories[0].subcategory);
    renderUnits("right",categories[0].subcategory);
}

function renderCategoriesSelectBoxMenu(categories) {
    let categoriesDom = '<li id="choose_bx_menu" class="title"><i class="fa fa-long-arrow-left">&nbsp;</i> Birim Seçimi Yapın...</li>' +
        '<li id="ttt_bx_menu" class="title2">Sık Kullanılanlar</li>';

    for (let i = 0; i < 3; i++) {
        if(i == categories.length)
            break;

        categoriesDom += '<li>' +
            '<a href=\"#\" id="' + categories[i]._id + '_bx_menu">' + categories[i].name + '</a>' +
            '</li>';

    }

    if (categories.length > 3) {
        categoriesDom += '<li class="title2">Diğer</li>';
        for (let i = 3; i < categories.length; i++) {
            categoriesDom += '<li>' +
                '<a href=\"#\" id="' + categories[i]._id + '_bx_menu">' + categories[i].name + '</a>' +
                '</li>';
        }
    }
    $("#categoriesSelectBoxMenu .mCSB_container").empty();
    $("#categoriesSelectBoxMenu .mCSB_container").append(categoriesDom);
}
function renderUnits(direction, subcategories) {
    let numOfDirect=(direction === 'left') ? '1' : '2';
    let unitsDom = '<li onclick="'+direction+'SideTitleClicked()" class=\"title\"><i class=\"fa fa-long-arrow-'+ direction +'\">&nbsp;</i> Çeviri Seçimi Yapın... (' + numOfDirect  + '/2)</li>';
    let numberOfUnits=0;
    for (let i = 0; i < subcategories.length; i++) {
            for (let j = 0; j <subcategories[i].units.length; j++) {
                numberOfUnits++;
                unitsDom += '<li>' +
                    '<a href=\"#\" onclick="'+direction+'SideUnitClicked(\''+subcategories[i].units[j].name+'\',\''+subcategories[i].units[j].value+'\')" id="'+i+'_unit_'+j+'" class="'+direction+'UnitLink" data-value="'+subcategories[i].units[j].value+'" data-code="' + subcategories[i].units[j].scode + '_unit">' + subcategories[i].units[j].name + '</a>' +
                    '</li>';
            }
    }
    $("#units_"+direction).mCustomScrollbar();
    $("#units_"+direction+" .mCSB_container").empty();

    if(numberOfUnits<4){
    	let height=numberOfUnits*42;
    	$("#units_"+direction).css("height",height+"px");	
    }else{
    	$("#units_"+direction).css("height","140px")
    }

    $('#selectBoxSelectedItem'+direction).css('border-color', '#f7921e');
    $('#selectBoxSelectedItem'+direction+"Label").text("");
    $('#'+direction+'Input').attr('placeholder','');
    $('#'+direction+'Input').css('border-color', '#f7921e');
    $('#'+direction+'Input').val("");

    $("#units_"+direction+" .mCSB_container").append(unitsDom);

}