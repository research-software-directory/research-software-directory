/**
 * Element.closest() polyfill
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }
    Element.prototype.closest = function (s) {
        var el = this;
        var ancestor = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (ancestor.matches(s)) return ancestor;
            ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
    };
}

function collapseSection(element) {
    var sectionHeight = element.scrollHeight;
    var elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      requestAnimationFrame(function() {
        element.style.height = 0 + 'px';
      });
    });
    element.setAttribute('data-collapsed', 'true');
}
  
function expandSection(element) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
    element.addEventListener('transitionend', function handler(e) {
      element.removeEventListener('transitionend', handler);
      element.style.height = null;
    });
    element.setAttribute('data-collapsed', 'false');
}

    
// Beamer Mode | Press 'Ctrl + b' to darken the grey backgrounds
// ---------------------------------------------------------------------
function KeyPress(e) {
    var bodyel = document.querySelector('body');
    var evtobj = window.event? event : e
    if (evtobj.keyCode == 66 && evtobj.ctrlKey){
        bodyel.classList.toggle('beamer-mode');
    }
}
document.onkeydown = KeyPress;


document.addEventListener("DOMContentLoaded", function(event) {


    if(document.querySelector('.dropdown')){
        var dropdowns = document.querySelectorAll('.dropdown');

        // Add click event listener to each dropdown (in case more dropdowns will be used in the future)
        for ( i = 0; i < dropdowns.length; i++ ) { 
            dropdowns[i].querySelector('.dropdown_button').addEventListener('click', function() {
                this.parentNode.classList.toggle('is-active');
            });
        }
        
        document.addEventListener('click', function(event) {
            // If the click happened inside the the container, bail
            if ( event.target.closest('.dropdown') ) return;

            // If document contains an active dropdown, remove is-active
            if ( document.querySelector('.dropdown.is-active') ) {
                document.querySelector('.dropdown.is-active').classList.remove('is-active');
            }

        }, false);
    }

    if(document.querySelector('.read-more_button')){
        document.querySelector('.read-more_button').addEventListener('click', function() {

            var moreContent = document.querySelector('.read-more_content');
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
    }

    if(document.querySelector('.mention_button')){
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
    }

    function plot_commits(data) {
        var plotid = document.getElementById("commitsPlot");
        var layout = {
            autosize: true,
            margin: {l:0,r:10,b:40,t:20},
            xaxis: {
                type: 'date',
                autotick: false,
                tick0: '2000-01-15',
                dtick: 'M12',
                tickformat: "%Y",
                showgrid: false
            },
            yaxis: {
                showgrid: false
            },
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            line: {
                color: "rgb(0,163,227)"
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