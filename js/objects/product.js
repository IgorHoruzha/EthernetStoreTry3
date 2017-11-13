'use strict'
let productsList = [];
let productsOnPage = 3;
let pages = 0;

function Product(name, szProductImage, szProductInfo, price, id, catId) {
    this.name = name;
    this.szProductImage = szProductImage;
    this.szProductInfo = szProductInfo;
    this.price = price;
    this.id = id;
    this.catId = catId;

    generalMethods.call(this);
    this.mCreateProduct = function(p) {
        let cProduct = $('<div>', {
            'class': 'Product',
            'id': p.id
        });

        /*Add product name in product*/
        $('<div>', {
            text: p.name,
            'class': 'ProductName',
        }).appendTo(cProduct);

        /*Add product image in product*/
        $('<img>', {
            'src': p.szProductImage,
            'alt': 'Product-' + p.id + '-Image',

        }).appendTo(cProduct);

        /*Add product price in product*/
        $('<div>', {
            text: p.price + '$',
            'class': 'ProductPrice',
        }).appendTo(cProduct);

        /*Add buy button in product*/
        $('<button>', {
            text: 'Buy'
        }).appendTo(cProduct);



        return cProduct;
    }
    this.mBuildProductSection = function(currentPage = 1) {
        this.mClearSelection();
        let cProducts = $('<div>', { 'id': 'Products' });
        for (var i = 0; i < productsOnPage; i++) {
            let prod = productsList[((currentPage - 1) * productsOnPage) + i];
            if (prod !== undefined) {
                let block = prod.mCreateProduct(prod);
                $(cProducts).append(block);
            }
        }
        cProducts.prependTo('#mainProducts');


        $("#searchResults_links").empty();
        for (let i = 1; i <= pages; i++) {
            $("<span></span>", {
                class: "page",
                text: i
            }).appendTo("#searchResults_links");
        }
        $($('.page')[currentPage - 1]).addClass('selectedPage');
        $('#paging_controls').css({ display: 'block' });;

    }

    this.mFillProductSection = function(catId = -1, aProducts = null) {
        productsList = [];
        $.each(aProducts, function(index, el) {
            if (this.catId == catId || catId == -1)
                productsList.push(this);
        });

        pages = Math.ceil(productsList.length / productsOnPage);
        console.dir(pages);
        this.mBuildProductSection();

    }

    this.mSetEvent = function() {
        $($('#mainProducts')).click(function(e) {
            if (e.target.tagName == 'IMG' || e.target.className == 'ProductName') {
                p[0].mClearSelection();

                p[0].mGetDescription($.grep(p, function(el, n) {
                    return el.id == e.target.parentElement.id;
                })[0]).appendTo(this)
            } else
            if (e.target.tagName == 'BUTTON') {
                cCart.addProduct($.grep(p, function(el, n) {
                    return el.id == e.target.parentElement.id;
                })[0], 1, 'add');
                $('#CartCountProduct').text(cCart.getProducts().length);
            } else
            if (e.target.className == 'page') {
                p[0].mBuildProductSection(e.target.textContent);

            }
            if (e.target.className == 'AdminDeleteProductInWebSite') {

                let currentProductId = $(e.target).parent().attr('id');

                alertify.confirm("Delete.",
                    function() {
                        let CurrentElement = $.each(p, function(index, el) {
                            if (el.id == currentProductId) {
                                $(e.target).parent().remove();
                                p.splice(index, 1);
                                $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', Product: 'Product', 'Products': JSON.stringify(p) }, null, "JSON");
                                this.mFillProductSection(-1, p);
                                if (!$('.AdminDeleteProductInWebSite').length)
                                    $('.Product').append('<div class="AdminDeleteProductInWebSite">x</div>');
                                return false;
                            }
                        });
                        alertify.success('Product deleted');
                    },
                    function() {
                        alertify.error('Cancel');
                    });
            }

            if ($(e.target).hasClass('EditProduct')) {

                let currentProductId = $(e.target).parent().attr('id');
                $('.AdminEditDishForm').data('ProdId', currentProductId);
                let CurrentElement = $.each(p, function(index, el) {
                    if (el.id == currentProductId) {
                        $("#AdminProductNameInput").val(el.name);
                        $("#AdminProductPriceInput").val(el.price);
                        $("#AdminProductImageInput").val(el.szProductImage);
                        $("#AdminProductIdInput").val(el.id);
                        $("#AdminProductCatIdInput").val(el.catId);
                        $("#ProductDescriptionTextaera").val(el.szProductInfo);

                        return false;
                    }
                });


            }

        });
    }

    this.mPageIsLoaded_Product = function() {
        this.mSetEvent();
    }

    this.mGetDescription = function lpfnGetDescription(cProduct) {
        let cProdInfo = $('<div>', { 'id': 'ProductInfo' });
        let cProducts = $('<div>', { 'id': 'Products' });
        this.mCreateProduct(cProduct).appendTo(cProducts);
        $('#paging_controls').css({ display: 'none' });;

        cProducts.appendTo(cProdInfo);
        $('<h1>', { text: 'Описание' }).appendTo(cProdInfo);
        $('<span>', { text: cProduct.szProductInfo }).appendTo(cProdInfo);

        return cProdInfo;
    }
    this.compareV2 = function(ProductA, ProductB) {
        return ProductA.name == ProductB.name ||
            ProductA.id == ProductB.id;
    }

}

Product.compare = function(ProductA, ProductB) {

    return ProductA.name == ProductB.name;
}