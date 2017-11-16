'use strict'


function generalMethods() {
    this.mClearSelection = function() {
        if ($('#Products').length)
            $('#Products').remove();
        if ($('#ProductInfo').length)
            $('#ProductInfo').remove();
        if ($('#searchResults_links').length)
               $("#searchResults_links").empty();


    }

}
/*
global default not per instance, applies to all dialogs
false - do not focus on  body after close dlertifi window
true - focus on  body after close dlertifi window
*/

alertify.defaults.maintainFocus = false;
alertify.defaults.preventBodyShift =  true;

alertify.genericDialog || alertify.dialog('genericDialog', function() {
    return {
        main: function(content) {
            this.setContent(content);
        },
        setup: function() {
            return {
                focus: {
                    element: function() {
                        return this.elements.body.querySelector(this.get('selector'));
                    },
                    select: true
                },
                options: {
                    basic: true,
                    maximizable: false,
                    resizable: false,
                    padding: false
                }
            };
        },
        settings: {
            selector: undefined
        }
    };
});

alertify.closeModalAlertyfiWindowCUSTOM = function() {
    $(".ajs-no-overflow").removeClass();
    $(".alertify").remove();
}