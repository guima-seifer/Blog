//Created by rafael on 15/01/2018

$(function () {
  $(document).ready(function () {
    $('#tableUsers').DataTable();
    $('#tableCategories').DataTable();
  });

  $("#searchBox").on('keydown', function () {
    let searchText = $(this).val();
    console.log(searchText);
    if(searchText !== ''){
        $(".page").each(function () {
            if($(this).attr("class") === 'page'){
                $(this).addClass('page-active');
            }
        });
        searchText = searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        $(".post").find(".titulo").each(function () {
            if($(this)[0].innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(searchText) === -1){
                $(this).parent().parent().css("display","none");
            } else {
                $(this).parent().parent().css("display","block");
            }
        })
    } else {
        let numPages = $(".page").length;
        for(let i = 1; i < numPages; i++){
            if(i !== 1){
                $("#page"+i).removeClass('page-active');
            }
        }

        $(".post").find(".titulo").each(function () {
            $(this).parent().parent().css("display","block");
        })
    }
  });

    $("#saveSettings").on('click', function () {
        $("#settingsForm").submit();
    });

    $('#pagination-demo').twbsPagination({
        totalPages: $('.page').length,
        // the current page that show on start
        startPage: 1,
        // maximum visible pages
        visiblePages: $('.page').length,
        initiateStartPageClick: true,
        // template for pagination links
        href: false,
        // variable name in href template for page number
        hrefVariable: '{{number}}',
        first: 'Primeira',
        prev: 'Anterior',
        next: 'Próxima',
        last: 'Última',
        loop: false,
        onPageClick: function (event, page) {
            $('.page-active').removeClass('page-active');
            $('#page'+page).addClass('page-active');
        },
        paginationClass: 'pagination',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first',
        pageClass: 'page',
        activeClass: 'active',
        disabledClass: 'disabled'
    });
});
