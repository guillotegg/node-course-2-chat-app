//this function can remove a array element.
Array.remove = function(array, from, to) {
    var rest = array.slice((to || from) + 1 || array.length);
    array.length = from < 0 ? array.length + from : from;
    return array.push.apply(array, rest);
};

//this variable represents the total number of popups can be displayed according to the viewport width
var total_popups = 0;

//arrays of popups ids
var popups = [];

//this is used to close a popup
function close_popup(id, remove)
{
    for(var iii = 0; iii < popups.length; iii++)
    {
        if(id == popups[iii])
        {
            Array.remove(popups, iii);
            
            //document.getElementById(id).style.display = "none";
            jQuery(`#${id}`).hide( "bounce", { direction: "down" }, "slow", function() { remove && $(this).remove(); } );
            
            calculate_popups();
            
            return;
        }
    }   
}

//displays the popups. Displays based on the maximum number of popups that can be displayed on the current viewport width
function display_popups()
{
    var right = 220;
    
    var iii = 0;
    for(iii; iii < total_popups; iii++)
    {
        if(popups[iii] != undefined)
        {
            var element = document.getElementById(popups[iii]);
            element.style.right = right + "px";
            right = right + 320;
            //element.style.display = "block";
            jQuery(element).show( "bounce", { direction: "down" }, "slow" );
        }
    }
    
    for(var jjj = iii; jjj < popups.length; jjj++)
    {
        var element = document.getElementById(popups[jjj]);
        element.style.display = "none";
    }
}

//creates markup for a new popup. Adds the id to popups array.
function register_popup(toId, toName, fromName)
{
    
    for(var iii = 0; iii < popups.length; iii++)
    {   
        //already registered. Bring it to front.
        if(toId == popups[iii])
        {
            Array.remove(popups, iii);
        
            popups.unshift(toId);
            
            calculate_popups();
            
            
            return;
        }
    }               

    //console.log('register_popup', toId);
    
    var element = '<div class="popup-box chat-popup" id="'+ toId +'">';
    element +=  '<div class="popup-head">';
    element += '<div class="popup-head-left">'+ toName +'</div>';
    element += '<div class="popup-head-right"><a href="javascript:close_popup(\''+ toId +'\');">&#10005;</a></div>';
    element += `<div style="clear: both"></div></div><ul class="popup-messages" id="popup-messages_${toId}"></ul></div>`;
    
    //document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + element;
    $('body').append(element);

    popups.unshift(toId);
            
    calculate_popups();
    
}

//calculate the total number of popups suitable and then populate the toatal_popups variable.
function calculate_popups()
{
    var width = window.innerWidth;
    if(width < 540)
    {
        total_popups = 0;
    }
    else
    {
        width = width - 200;
        //320 is width of a single popup box
        total_popups = parseInt(width/320);
    }
    
    display_popups();
    
}

//recalculate when window is loaded and also when window is resized.
window.addEventListener("resize", calculate_popups);
window.addEventListener("load", calculate_popups);