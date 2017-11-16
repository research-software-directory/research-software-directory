function search_algo(search_key, stype){
  search_key = search_key.toLowerCase();
  count = 0;
  search_key_split = search_key.trim().split(" ");
  console.log(search_key_split)
    for (var i = 0; i <ALL_DATA.length; i++){
      dict = ALL_DATA[i];
      hit = false;
      hit_count = 0
        for (var j =0; j < dict['discipline'].length; j++){
          term = dict['discipline'][j]
          for (var idx in search_key_split){
            if (term.toLowerCase().indexOf(search_key_split[idx]) !== -1){
                hit_count += 1
                break;
            }
         }
        }
        for (var j = 0; j < dict['expertise'].length; j++){
          term = dict['expertise'][j]
          for (var idx in search_key_split){
            if (term.toLowerCase().indexOf(search_key_split[idx]) !== -1){
                hit_count += 1
                break;
            }
          }
        }
        for (var j = 0; j < dict['tags'].length; j++){
          term = dict['tags'][j]
          for (var idx in search_key_split){
            if (term.toLowerCase().indexOf(search_key_split[idx]) !== -1){
                hit_count += 1
                break;
            }
          }
        }
        for (var idx in search_key_split){
          if (dict['tagLine'].toLowerCase().indexOf(search_key_split[idx])!==-1){
            hit=true
            hit_count += 1
          }
        }
        if(hit_count>0){
            $("#"+ALL_DATA[i]['id']+".product").css("display", "block")
          count += 1
        }else if(stype=="filter"){
          $("#"+ALL_DATA[i]['id']+".product").css("display", "none")
        }

  }
  results_list = "There are "+count+" search results for the keyword <b>"+search_key+"</b>"
  return results_list
}

 $("#input").on("focusin", function(){
    if($("#input").val()=="Search for software, people, technologies, etc."){
      $("#input").val("")
      $("#input").css('color', '#000000');
    }
 });
 $("#input").on("focusout", function(){
    if($("#input").val()==""){
      $("#input").val("Search for software, people, technologies, etc.")
      $("#input").css('color', '#676a70');
    }
 });


 $(document).ready(function(){
    // fill gems div
    default_number_all_projects = 200
    project_count = 0
    for (var i = 0; i < ALL_DATA.length; i++){
      var toolDate = new Date()
      toolDate.setSeconds(parseInt(ALL_DATA[i]['lastUpdate']))
      var formattedDate = toolDate.toDateString();
      var toolTipText = '<b>'+ALL_DATA[i]['name']+'</b><br><br>'+ALL_DATA[i]['tagLine']+'<br><br>Commits : '+ALL_DATA[i]['commits']+'<br> Mentions : '+ALL_DATA[i]['mentions'] +'<br><br>Last updated:'+formattedDate;
      var appendHtml = "<div class='product' id="+ALL_DATA[i]['id']+"><a href='/software/"+ALL_DATA[i]['id']+"'><b>"+ALL_DATA[i]['id']+"</b><img class='product_thumb' data-placement='left' data-toggle='tooltip' data-html='true' title='" + toolTipText + "' src='static/images/thumb_default.jpg'></img></a></div>";
      if (ALL_DATA[i]['highlighted']) {
        $("#data_gems").append(appendHtml) // name, tagline, mentions, commits
      }
      if(project_count<default_number_all_projects){
        $("#data_display").append(appendHtml) // name, tagline, mentions, commits
      project_count += 1
      }
    }
    // a
    // activate Bootstrap4 on the tooltips
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });
 });

  $("form input[type=submit]").click(function() {
      $("input[type=submit]", $(this).parents("form")).removeAttr("clicked");
      $(this).attr("clicked", "true");
  });

 $("#search").on("submit", function (event){
    event.preventDefault();
    console.log($("#reset").attr("clicked"))
    if( $("input[type=submit][clicked=true]").val()=='search'){
      $("*.product").css("display", "none")
      $("#search_results.layout").empty()
      results_list = search_algo(search.input.value, "search")

      $("#box_1").css("display", "none")
      /*$("#box_0").css("display", "block")*/
      $('input:checkbox:checked').prop('checked', false);
      $("#search_results.layout").append(results_list)
      $("#search_results.layout").css("display", "block")
    }else if( $("input[type=submit][clicked=true]").val()==='reset'){
      $("#box_1").css("display", "block")
      $("#search_results.layout").empty()
      $("#search_results.layout").css("display", "none")
      $("*.product").css("display", "block")
    }
  });

$("#filter").click(function (event){
  //event.preventDefault(); 
  $("#box_1").css("display", "none")
  console.log("Filter selection:")
  var search_key = ""
  var highlights_selected = false
  $('input[type=checkbox').each(function(){
      //console.log($(this).val()+" checked:"+$(this).prop('checked'))
      if ($(this).prop('checked')){              
        if($(this).val()=='highlights'){
          $("*.product").css("display", "block")
          $('#box_0').css("display", "none")
          $('#box_1').css("display", "block")
          highlights_selected = true
        }
      search_key += $(this).val()+" "
      }
  })
  $("#search_results.layout").empty()
  $("#search_results.layout").css("display", "none")
  console.log(search_key)
  if (highlights_selected==false){
    $("#box_1").css("display", "none")
  }
  $("#search_results.layout").empty()
  results_list = search_algo(search_key, "filter")
  $("#search_results.layout").append(results_list)
  $("#search_results.layout").css("display", "block")
});

