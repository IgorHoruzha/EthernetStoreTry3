'use strict'


function reviwerProducts(key, value) {
    if (value instanceof Array) return value;
    if (typeof value == 'object') return new Product(value.name, value.szProductImage, value.szProductInfo, value.price, value.id, value.catId);
    return value;
}

function reviwerCategories(key, value) {
    if (value instanceof Array) return value;
    if (typeof value == 'object') return new Category(value.id, value.name);
    return value;
}

let p;
let c;

if (localStorage.cart) {
    var aCart = JSON.parse(localStorage.cart);
}

function GetProductData(Data) {
    p = JSON.parse(Data, reviwerProducts);
    if (p[0].mPageIsLoaded_Product) {
        p[0].mPageIsLoaded_Product();
        p[0].mFillProductSection(-1, p);
    }
}

function GetCategorytData(Data) {
    c = JSON.parse(Data, reviwerCategories);
    if (c[0].mPageIsLoaded_Category)  c[0].mPageIsLoaded_Category(c);
}

// function Menu(elem) {
//     this.save = function() {
//       alert( 'сохраняю' );
//     };
//     this.load = function() {
//       alert( 'загружаю' );
//     };
//     this.search = function() {
//       alert( 'ищу' );
//     };

//     var self = this;

//     elem.onclick = function(e) {
//       var target = e.target;
//       var action = target.getAttribute('data-action');
//       if (action) {
//         self[action]();
//       }
//     };
//   }

//   new Menu(menu);


function GetFormInfo(form) {
        console.dir($(form).find(':input'));
    let formFild = $(form).find(':input');
    console.dir(formFild);
    let FildValueArr = [];

    for (let i = 0; i < formFild.length; i++)  FildValueArr[i] = $(formFild[i]).val();

    return FildValueArr;
}

//TODO : Redo this Method
function showAnswer(data) {
    if (data[2] == "Autorization")
        if (data[3]) {
            localStorage.login = data[0];
            localStorage.password = data[1];
            $('#SignIn').text('admin');
            $(document).off("click");
            alertify.success('Welcome ' + data[0]);
        } else {
            alertify.error("Incorrect Password");
        }
    else if (data[0] == "AddInBaze") {
        alertify.success(data[1]);
    }
}


var CallBackInfoDialog = $('#CallBackInfo');

$(function() {

    CallBackInfoDialog.click(function(e) {
        if (e.target.type == "submit") {
            e.preventDefault();
            let szCallBackInfo = GetFormInfo(CallBackInfoDialog);
            console.log(szCallBackInfo);
            $.post("php/send.php", { name: szCallBackInfo[0], password: [1] }, showAnswer, "JSON");
        }

    });

    if (localStorage.login) {
        $('#SignIn').text('admin');
        $('#AdminMenu').css('display', 'block');
    } else {
        $(document).click(function(e) {
            if (e.target.id == "SignIn") {
                alertify.genericDialog(CallBackInfoDialog[0]);
                CallBackInfoDialog.css('display', 'block');
                return;
            }

        });
    }

    $.post("php/send.php", { 'GET': 'GET', 'Products': 'Products' }, GetProductData);
    $.post("php/send.php", { 'GET': 'GET', 'Categories': 'Categories' }, GetCategorytData);

    cCart.mPageIsLoaded_Crat(aCart);
    $('#CartCountProduct').text(cCart.getProducts().length);
});

/*Admin Menu*/
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////

if (localStorage.login && localStorage.password) {
    function AdminMenu(elem) {
        this.AdminAddProductsForm = $("#AdminAddProductsForm");
        this.AdminAddCategoriesForm = $("#AdminAddCategoriesForm");
        this.AdminAddProducts = function() {
            alertify.genericDialog(this.AdminAddProductsForm[0]);
        };
        this.AdminAddCategories = function() {
            alertify.genericDialog(this.AdminAddCategoriesForm[0]);

        };
        this.AdminDeleteProducts = function() {
            if (!$('.AdminDeleteProductInWebSite').length)
                $('.Product').append('<div class="AdminDeleteProductInWebSite">x</div>');
        };

        let self = this;

        elem.on('click', function(e) {
            let action = $(e.target).attr('id');
            if (action)
                self[action]();
        });
    }

    new AdminMenu($('#AdminMenu'));

    /*Admin Forms*/

    function AdminForms(elem) {

        this.AdminAddProductsForm = function(e, aFormInputsVal) {
            let NewProduct = new Product(aFormInputsVal[0], aFormInputsVal[1], aFormInputsVal[2], aFormInputsVal[3], aFormInputsVal[4], aFormInputsVal[5]);
            for (let i = 0; i < p.length; i++) {
                if (NewProduct.compareV2(NewProduct, p[i])) {
                    alertify.error("Duplicate id or name");
                    return 0;
                }
            }

            p[p.length] = NewProduct;
            $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', Product: 'Product', 'Products': JSON.stringify(p) }, showAnswer, "JSON");

        };
        this.AdminAddCategoriesForm = function(e, aFormInputsVal) {
            let NewCategory = new Category(aFormInputsVal[0], aFormInputsVal[1]);
            for (let i = 0; i < c.length; i++) {
                if (NewCategory.compare(NewCategory, c[i])) {
                    alertify.error("Duplicate Category");
                    return 0;
                }
            }

            c[c.length] = NewCategory;
            $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', 'Category': 'Category', 'Categories': JSON.stringify(c) }, showAnswer, "JSON");
        };

        var self = this;

        elem.on('click', function(e) {

            if (e.target.type == "submit") {
                e.preventDefault();
                let aFormInputsVal = GetFormInfo(this);
          
                let action = $(this).parent().attr('id');
                if (action)
                    self[action](e, aFormInputsVal);
            }
        });
    }

    new AdminForms($('form'));

} else {
    alertify.genericDialog(CallBackInfoDialog[0]);
    CallBackInfoDialog.css('display', 'block');
    alertify.error("You Must Singn In");
}