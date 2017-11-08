'use strict'

function Cart() {

    //private
    var products = [];

    this.mLocalStorageCart = function() {
        localStorage.setItem("cart", JSON.stringify(products));
    }
    //public
    this.delProduct = function(product) {
        for (var i = 0; i < products.length; i++) {
            if (Product.compare(products[i].product, product)) {
                products.splice(i, 1);
                this.mLocalStorageCart();
                return 0;
            }
        }

    }

    this.addProduct = function(product, quantity) {
        quantity = quantity || 1;

        for (var i = 0; i < products.length; i++) {

            if (Product.compare(products[i].product, product)) {
                if (+quantity < 0) {
                    this.delProduct(product);
                    this.ShowCardProducts();

                } else
                if (quantity && arguments[2] == 'add') {
                    products[i].quantity++;
                } else
                if (quantity) {
                    products[i].quantity = +quantity;
                }
                this.mLocalStorageCart();
                return 0;
            }
        }
        products.push({ "product": product, "quantity": quantity });
        this.mLocalStorageCart();
    }

    this.getProducts = function() {
        return products;
    }

    Object.defineProperty(this, "sum", {
        get: function() {
            var temp = [];
            var total = 0;
            for (var i = 0; i < products.length; i++) {
                temp.push({ "product": products[i].product, "sum": products[i].product.price * products[i].quantity, "quantity": products[i].quantity });
                total += temp[i].sum;
            }

            return { "total": total, "products": temp };
        }
    });

    this.mSetEvent = function() {
        $("#basket").click(function() {
            cCart.ShowCardProducts();
            $("#CardProducts").css('display', 'block');
            $(document.body).css('overflow', 'hidden');
        });

        $("#cardbg").click(
            function() {
                $("#CardProducts").css('display', 'none');
                $(document.body).css('overflow', 'scroll');
            });


        $("#CardProducts").click(
            function(e) {
                if (e.target.className == 'deleteProductInCard') {
                    let cProductForDelete = $.grep(cCart.getProducts(), function(el, n) {
                        return el.product.id == $(e.target.parentNode).data('prodid');
                    })[0].product;

                    alertify.confirm('Delete Product In Card', "Remove from card <span class='DelProductNameColor'>" +
                        cProductForDelete.name + "</span> ?",
                        function() {
                            cCart.delProduct(cProductForDelete);
                            cCart.ShowCardProducts();
                            $('#CartCountProduct').text(cCart.getProducts().length);
                            alertify.success('Ok');
                        },
                        function() {
                            alertify.success('Cancel');
                        });

                }
            });


        $("#CardProducts").focusout(
            function(e) {
                if (e.target.tagName == 'INPUT') {
                    let a = +e.target.value ? +e.target.value : -1
                    cCart.addProduct($.grep(cCart.getProducts(), function(el, n) {
                        return el.product.id == $(e.target.parentNode).data('prodid');
                    })[0].product, a);

                    cCart.ShowCardProducts();
                }
            });
    }
    this.mPageIsLoaded_Crat = function(aCart) {

        $(aCart).each(function(index, el) {
            cCart.addProduct(el.product, el.quantity);
        });

        this.mSetEvent();
    }


    this.ShowCardProducts = function() {
        let card = $('<section>')
        let cCardProducts = this.sum.products;    
        for (let i = 0; i < cCardProducts.length; i++) {
            let cProduct = $('<div>', {
                'class': 'CartProduct',
                'data-prodid': cCardProducts[i].product.id
            }).appendTo(card);

            $('<div>', {
                'class': 'CartProductName',
                text: cCardProducts[i].product.name
            }).appendTo(cProduct);

            $('<img>', {
                'src': cCardProducts[i].product.szProductImage,
                'alt': 'Product-' + cCardProducts[i].product.id + '-Image'
            }).appendTo(cProduct);

            $('<input>', {
                'value': cCardProducts[i].quantity,
                'type': 'number',
                'class': 'CartCountProduct'
            }).appendTo(cProduct);

            $('<div>', {
                text: cCardProducts[i].product.price + '$',
                'class': 'CartProductPrice',
            }).appendTo(cProduct);

            $('<div>', {
                text: cCardProducts[i].sum,
                'class': 'CartTotalProductCost',
            }).appendTo(cProduct);

            $('<div>', {
                text: 'x',
                'class': 'deleteProductInCard'
            }).appendTo(cProduct);

        }
        $('<div>', {
            text: 'Sum:' + this.sum.total,
            'class': 'TotalProductsCost',
        }).appendTo(card);
        $('#CardProducts #card section').replaceWith(card);

        console.dir(cCardProducts);


    }
}
var cCart = new Cart;