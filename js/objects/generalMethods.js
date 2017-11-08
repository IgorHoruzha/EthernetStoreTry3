'use strict'

function generalMethods() {
    this.mClearSelection=function () {
        if ($('#Products').length)
            $('#Products').remove();
        if ($('#ProductInfo').length)      
            $('#ProductInfo').remove();

        
    }

}