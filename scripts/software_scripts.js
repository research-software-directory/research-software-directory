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
    
    if( document.querySelector('.dropdown') ){
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
                buttonText.textContent = 'Show less contributors';
            }
        });
    }

    if( document.querySelector('.citation-block') ){
        
        citeHiddenToggle =  document.querySelector('.citation-block_hidden-toggle');
        citeToggle =        document.querySelector('.citation-block_toggle');
        citeContent =       document.querySelector('.citation-block .content');

        dropDownPanel =     document.querySelector('.citation-block .dropdown_panel');
        dropDownButton =    document.querySelector('.citation-block .dropdown_button');
        dropDownOptions =   document.querySelectorAll('.citation-block .dropdown_panel li');
        downloadButton =    document.querySelector('.citation-block .button.download');

        // Toggle 
        citeHiddenToggle.addEventListener('click', function(event) {
            this.parentElement.classList.toggle('is-closed');
            if ( citeContent.getAttribute('data-collapsed') === 'false') {
                collapseSection( citeContent );
            } else {
                expandSection( citeContent );
            }
        });
        citeToggle.addEventListener('click', function(event) {
            this.parentElement.classList.toggle('is-closed');
            if ( citeContent.getAttribute('data-collapsed') === 'false') {
                collapseSection( citeContent );
            } else {
                expandSection( citeContent );
            }
        });
        
        // Download file selection
        for ( i = 0; i < dropDownOptions.length; i++ ) { 
            dropDownOptions[i].addEventListener('click', function() {
                dropDownPanel.querySelector('.is-active').classList.remove('is-active');
                
                this.classList.toggle('is-active');
                
                selectedText = this.querySelector('.text').textContent;
                selectedUrl = this.getAttribute('data-download-url');
                
                dropDownButton.querySelector('.text').textContent = selectedText;
                downloadButton.setAttribute('href', selectedUrl);
               
                dropDownPanel.parentElement.classList.toggle('is-active');
            });
        }
  
    }

    document.getElementById('btn-copy-clipboard').addEventListener('click', function(event) {
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
    });



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