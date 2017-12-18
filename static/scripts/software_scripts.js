$(document).ready(function() {

    $(".mention_button").each(function() {
        $(this).on("click", function() {
            $(this).toggleClass('active');
            $(this).next().slideToggle();
        });
    });

    $(".readMore>a").on("click", function() {
        $(this).parent().toggleClass('active');
    });

    $("#choose_citation_button").on("click", function(e) {
        $('.citation_list').toggleClass('active');
        e.preventDefault();
        return false;
    });

    // Configure/customize these variables.
    // var showChar = 100;  // How many characters are shown by default
    // var ellipsestext = "...";
    // var moretext = "Show more >";
    // var lesstext = "Show less";


    // $('.readmore').each(function() {
    //     var content = $(this).text();
    //
    //     if(content.length > showChar) {
    //
    //         var c = content.substr(0, showChar);
    //         var h = content.substr(showChar, content.length - showChar);
    //
    //         var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
    //
    //         $(this).html(html);
    //     }
    //
    // });
    //
    // $(".morelink").click(function(){
    //     if($(this).hasClass("less")) {
    //         $(this).removeClass("less");
    //         $(this).html(moretext);
    //     } else {
    //         $(this).addClass("less");
    //         $(this).html(lesstext);
    //     }
    //     $(this).parent().prev().toggle();
    //     $(this).prev().toggle();
    //     return false;
    // });
});




$(document).ready(function() {

    function plot_commits(data) {
        var plotid = document.getElementById("commitsPlot");
        var layout = {
            autosize: true,
            margin: {l:20,r:50,b:40,t:20},
            xaxis: {
                type: 'date',
                autotick: false,
                ticks: 'outside',
                tick0: '2000-01-15',
                dtick: 'M12',
                tickformat: "%Y"
            },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            line: {
                color: "rgb(255,163,227)"
            }
        };
        data[0].marker = {
            color: "rgb(0,163,227)"
        };
        Plotly.newPlot(plotid, data, layout, {displayModeBar: false, staticPlot: true});
    }

    var statid = document.getElementById("commitsStat");
    if ('error' in commitsData) {
        statid.innerHTML = commitsData['error'];
    } else {
        plot_commits(commitsData['plot']);
        statid.innerHTML = '<b>' + commitsData['total'] + '</b> commits | Last update: <b>' + commitsData['last'] + '</b>';
    }

});