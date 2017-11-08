'use strict'

function Category(id, name) {
    this.name = name;
    this.id = id;

    generalMethods.call(this);

    this.mCreateAndShowCategory = function(aCategories) {
        let cUl = $('<ul>');

        $.each(aCategories, function(index, value) {
            $('<li data-catid="' + this.id + '">' +
                '<a href="##">' +
                '<img src="img/main/ProductList/triangle.png" alt="triangle">' + this.name +
                '</a>' +
                '</li>').appendTo(cUl);
            });
        $('#categories ul').replaceWith(cUl);
      
    }

    this.mSetEvent = function() {
        $('#categories').click(
            function(e) {
                if (e.target.tagName == 'LI' || e.target.tagName == 'A') {
                    c[0].mClearSelection();
                    p[0].mFillProductSection($(e.target.parentNode).data().catid, p);

                    $('.SelectedCategory').removeClass('SelectedCategory');
                    $(e.target).addClass('SelectedCategory');

                }
            })
    }

    this.mPageIsLoaded_Category = function(aCategories) {
        this.mCreateAndShowCategory(aCategories);
        this.mSetEvent();

    }
        this.compare = function(CategoryA, CategoryB) {
        return CategoryA.name == CategoryB.name ||
            CategoryA.id == CategoryB.id;
    }
}