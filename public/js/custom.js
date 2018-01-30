//Created by rafael on 15/01/2018

$(function () {
  $(document).ready(function () {
    $('#tableUsers').DataTable();
    $('#tableCategories').DataTable();
  });

  $("#searchBox").on('keydown', function () {
    let searchText = $(this).val();
    searchText = searchText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    console.log(searchText);
    $(".post").find(".titulo").each(function () {
        if($(this)[0].innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(searchText) === -1){
          $(this).parent().parent().css("display","none");
        } else {
            $(this).parent().parent().css("display","block");
        }
    })
  });

    $("#saveSettings").on('click', function () {
        $("#settingsForm").submit();
    });
});
