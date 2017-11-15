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
                if (e.target.className == 'AdminDeleteCategoriesInWebSite') {

                    let currentId = $(e.target).parent().data("catid");

                    alertify.confirm('Delate categories comfirm', "Delete " + $(e.target).parent().find('a').text() + '?',
                        function() {
                            let CurrentElement = $.each(c, function(index, el) {
                                if (el.id == currentId) {
                                    $(e.target).parent().remove();
                                    c.splice(index, 1);
                                    $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', 'Category': 'Category', 'Categories': JSON.stringify(c) }, showAnswer, "JSON");

                                    this.mCreateAndShowCategory(c);
                                    if (!$('.AdminDeleteCategoriesInWebSite').length)
                                        $('#categories li').append('<div class="AdminDeleteCategoriesInWebSite">x</div>');
                                    return false;
                                }
                            });

                            alertify.success('Category deleted');
                        },
                        function() {
                            alertify.error('Cancel');
                        });
                }



                if ($(e.target).hasClass('EditCaegory')) {

                    let currentCategoryId = $(e.target).parent().parent().data('catid');

                    $('#AdminEditCategoryForm').data('ProdId', currentCategoryId);
                    let CurrentElement = $.each(c, function(index, el) {
                        if (el.id == currentCategoryId) {

                            $("#AdminCategoryIdInput").val(el.id);
                            $("#AdminCategoryNameInput").val(el.name);
                            return false;
                        }

                    });
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