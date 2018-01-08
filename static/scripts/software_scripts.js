function collapseSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // temporarily disable all css transitions
    var elementTransition = element.style.transition;
    element.style.transition = '';
    
    // on the next frame (as soon as the previous style change has taken effect),
    // explicitly set the element's height to its current pixel height, so we 
    // aren't transitioning out of 'auto'
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      
      // on the next frame (as soon as the previous style change has taken effect),
      // have the element transition to height: 0
      requestAnimationFrame(function() {
        element.style.height = 0 + 'px';
      });
    });
    
    // mark the section as "currently collapsed"
    element.setAttribute('data-collapsed', 'true');
}
  
function expandSection(element) {
    // get the height of the element's inner content, regardless of its actual size
    var sectionHeight = element.scrollHeight;
    
    // have the element transition to the height of its inner content
    element.style.height = sectionHeight + 'px';
  
    // when the next css transition finishes (which should be the one we just triggered)
    element.addEventListener('transitionend', function handler(e) {
      // remove this event listener so it only gets triggered once
      element.removeEventListener('transitionend', handler);
      
      // remove "height" from the element's inline styles, so it can return to its initial value
      element.style.height = null;
    });
    
    // mark the section as "currently not collapsed"
    element.setAttribute('data-collapsed', 'false');
}



document.addEventListener("DOMContentLoaded", function(event) {
    var moreContent = document.querySelector('.read-more_content');

    document.querySelector('.read-more_button').addEventListener('click', function() {
        var buttonText = this.querySelector('.button_text');
        
        this.classList.toggle('active');

        if ( moreContent.getAttribute('data-collapsed') === 'false') {
            collapseSection(moreContent);
            buttonText.textContent = 'Read more';
        } else {
            expandSection(moreContent);
            buttonText.textContent = 'Read less';
        }
    });
   

    document.querySelectorAll('.mention_button').forEach(function(elm) {
        elm.addEventListener('click', function(event) {
            this.classList.toggle('active');
            var sibling = elm.nextElementSibling;
            if ( sibling.getAttribute('data-collapsed') === 'false') {
                collapseSection(sibling);
            } else {
                expandSection(sibling);
            }
        });
    });

    document.getElementById('choose_citation_button').addEventListener('click', function(e) {
        document.querySelector('.citation_list').classList.toggle('active');
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    window.addEventListener('click', function() {
        document.querySelector('.citation_list').classList.remove('active');
    });

    function plot_commits(data) {
        var plotid = document.getElementById("commitsPlot");
        var layout = {
            autosize: true,
            margin: {l:35,r:20,b:40,t:20},
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

        // Resize graph on window resize
        // ----------------------------------------------------------
        window.addEventListener('resize', function(e) {
            Plotly.Plots.resize(plotid);
        });
    }

    var statid = document.getElementById("commitsStat");
    if ('error' in commitsData) {
        statid.innerHTML = commitsData['error'];
    } else {
        plot_commits(commitsData['plot']);
        statid.innerHTML = '<b>' + commitsData['total'] + '</b> commits | Last update: <b>' + commitsData['last'] + '</b>';
    }

});