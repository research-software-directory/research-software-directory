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

function collapseSection(element, initHeight) {
    var sectionHeight = element.scrollHeight;
    var elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function() {
      element.style.height = sectionHeight + 'px';
      element.style.transition = elementTransition;
      requestAnimationFrame(function() {
          if(initHeight){
            element.style.height = initHeight + 'px';
          }
          else{
            element.style.height = 0 + 'px';
          }
      });
    });
    element.setAttribute('data-collapsed', 'true');
}
  
function expandSection(element, initHeight) {
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
    element.addEventListener('transitionend', function handler(e) {
        element.removeEventListener('transitionend', handler);
        if(initHeight){
            element.style.height = sectionHeight + 'px';
        }
        else{
            element.style.height = null;
        }
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
    if( document.querySelector('.read-more_button') ){
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

    if( document.querySelector('.mention_button') ){
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

    if( document.querySelector('.show-all-contributors') ){
        var originalHeight = document.querySelector('.show-all-contributors').previousElementSibling.clientHeight; 
        document.querySelector('.show-all-contributors').addEventListener('click', function() {
            var buttonText = this.querySelector('.button_text');
            var prevSibling = this.previousElementSibling;
            this.parentElement.classList.toggle('active');
            if ( prevSibling.getAttribute('data-collapsed') === 'false') {
                collapseSection( prevSibling, originalHeight );
                buttonText.textContent = 'Show all contributors';
            } else {
                expandSection( prevSibling, true );
                buttonText.textContent = 'Show fewer contributors';
            }
        });
    }

    if( document.querySelector('.citation-block') ){

        var citeContent =       document.querySelector('.citation-block .content');

        // Copy to clipboard
        var copyButton =        document.querySelector('.citation-block .button.copy');

        // Download file selection
        var dropDownPanel =     document.querySelector('.citation-block .dropdown_panel');
        var dropDownButton =    document.querySelector('.citation-block .dropdown_button');
        var dropDownOptions =   document.querySelectorAll('.citation-block .dropdown_panel li');
        var downloadButton =    document.querySelector('.citation-block .button.download');

        // Copy to clipboard click
        if (copyButton) copyButton.addEventListener('click', function(event) {

            button = this;
            icon = button.querySelector('.icon use');

            if ( !button.classList.contains('active') ){

                var range = document.createRange();
                range.selectNodeContents(document.getElementById("doi"));

                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);

                try {
                    document.execCommand('copy');
                } catch(err) {
                }
                window.getSelection().removeAllRanges();



                button.classList.add('active');

                icon.style.webkitTransform = "scale(0)";
                icon.style.msTransform = "scale(0)";
                icon.style.transform = "scale(0)";

                setTimeout(function(){
                    icon.setAttribute('xlink:href', "/static/icons/icons.svg#icon-check");
                    icon.style.webkitTransform = "scale(1)";
                    icon.style.msTransform = "scale(1)";
                    icon.style.transform = "scale(1)";
                }, 200);

                button.querySelector('.text').textContent = 'Copied to clipboard';

                setTimeout(function(){
                    button.querySelector('.text').textContent = 'Copy to clipboard';

                    icon.style.webkitTransform = "scale(0)";
                    icon.style.msTransform = "scale(0)";
                    icon.style.transform = "scale(0)";

                    setTimeout(function(){
                        icon.setAttribute('xlink:href', "/static/icons/icons.svg#icon-clipboard");
                        icon.style.webkitTransform = "scale(1)";
                        icon.style.msTransform = "scale(1)";
                        icon.style.transform = "scale(1)";
                    }, 200);

                    button.classList.remove('active');
                }, 1900);

            }

        });
    }
});

document.addEventListener("DOMContentLoaded", function(event) {
    var plotElm = document.getElementById("commitsPlot");

    var currentMonth = (new Date()).getMonth();
    var currentYear = (new Date()).getFullYear();
    var month = currentMonth;
    var year = currentYear - 5;
    var x = [];
    var y = [];
    while (month < currentMonth || year < currentYear) {
        var i = year + '-' + ('0' + month).substr(-2);
        x.push(i);
        y.push(commitsData[i] || 0);
        month += 1;
        if (month > 12) { month = 1; year += 1; }
    }
    var plotData = {
        fill: "none",
        line: { shape: "spline" },
        marker: {color: "rgb(0,163,227"},
        mode: "lines",
        x: x,
        y: y,
    }
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
    Plotly.newPlot(plotElm, [plotData], layout, {displayModeBar: false, staticPlot: true});

    // Resize graph on window resize
    // ----------------------------------------------------------
    window.addEventListener('resize', function(e) {
        Plotly.Plots.resize(plotElm);
    });
});