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
    if (c[0].mPageIsLoaded_Category)
        c[0].mPageIsLoaded_Category(c);
}



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

function showAnswer(data) {
    console.dir(data);
    if (data[0] == 'admin' && data[1] == 'admin') {
        localStorage.login = data[0];
        localStorage.password = data[1];
        $('#SignIn').text('admin');
        $(document).off("click");
        alertify.success('Welcome ' + data[0]);
    } else {
        alertify.error("Incorrect Password");
    }

}

function getFormInfo(Form) {
    console.dir(localStorage.product);
    let cFormInfo = {
        name: Form.find("input[name='text']").val(),
        password: Form.find("input[name='password']").val()
    };

    return cFormInfo;
}

var CallBackInfoDialog = $($('#CallBackInfo')[0]);

console.log(localStorage.category);


$(function() {

    CallBackInfoDialog.click(function(e) {
        if (e.target.type == "submit") {
            e.preventDefault();
            let szCallBackInfo = getFormInfo(CallBackInfoDialog);
            console.log(szCallBackInfo);
            $.post("php/send.php", szCallBackInfo, showAnswer, "JSON");
        }

    });

    if (localStorage.login) {
        $('#SignIn').text('admin');
        $('#AdminMenu').css('display','block');
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

let AdminAddProducts = $('#AdminAddProductsForm');

function GetFormInfo(form) {
    console.dir(form[0].children[0]);
    let formFild = form[0].children[0].elements.Fild;
    console.dir(formFild);
    let FildValueArr = [];

    for (let i = 0; i < formFild.length; i++) {
        FildValueArr[i] = $(formFild[i]).val();
    }

    return FildValueArr;

}


function addInBaze(data) {
    // console.dir(data);
    alertify.success(data);
}

AdminAddProducts.click(function(e) {

    if (e.target.type == "submit") {
        e.preventDefault();
        let aFormInputsVal = GetFormInfo(AdminAddProducts);

        let NewProduct = new Product(aFormInputsVal[0], aFormInputsVal[1], aFormInputsVal[2], aFormInputsVal[3], aFormInputsVal[4], aFormInputsVal[5]);
        for (let i = 0; i < p.length; i++) {
            if (NewProduct.compareV2(NewProduct, p[i])) {
                alertify.error("Duplicate id or name");
                return 0;
            }
        }

        p[p.length] = NewProduct;
     $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', Product: 'Product', 'Products': JSON.stringify(p) }, addInBaze, "JSON");

        // let szCallBackInfo = getFormInfo(CallBackInfoDialog);
        console.log("szCallBackInfo");
    }
});



let AdminAddCategoriesForm = $('#AdminAddCategoriesForm');



AdminAddCategoriesForm.click(function(e) {

    if (e.target.type == "submit") {
        e.preventDefault();
        let aFormInputsVal = GetFormInfo(AdminAddCategoriesForm);

        let NewCategory = new Category(aFormInputsVal[0], aFormInputsVal[1]);
        for (let i = 0; i < c.length; i++) {
            if (NewCategory.compare(NewCategory, c[i])) {
                alertify.error("Duplicate Category");
                return 0;
            }
        }

        c[c.length] = NewCategory;
        $.post("php/send.php", { name: localStorage.login, password: localStorage.password, 'SET': 'SET', 'Category': 'Category', 'Categories': JSON.stringify(c) }, addInBaze, "JSON");

      //  // let szCallBackInfo = getFormInfo(CallBackInfoDialog);
      //  console.log("szCallBackInfo");
    }
});



$('#AdminMenu').click(function(e) {
    if (localStorage.login && localStorage.password) {
        if (e.target.id == "AdminAddProducts") {

            alertify.genericDialog(AdminAddProducts[0]);
            AdminAddProducts.css('display', 'block');
            return;
        }
        if (e.target.id == "AdminAddCategories") {

            alertify.genericDialog(AdminAddCategoriesForm[0]);
            AdminAddCategoriesForm.css('display', 'block');
            return;
        }


    } else {
        alertify.genericDialog(CallBackInfoDialog[0]);
        CallBackInfoDialog.css('display', 'block');
        alertify.error("You Must Singn In");
    }

});