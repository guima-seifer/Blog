//Created by rafael on 15/01/2018

$(function () {
  $(document).ready(function () {
    $('#tableUsers').DataTable();
    $('#tableCategories').DataTable();
  });
  
  $("#searchBox").on('keypress', function () {
    let searchText = $(this).val();
    $(".post").find(".titulo")
  })
});
