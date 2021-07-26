$(document).ready(function(){

    $('.center').slick({
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        arrows: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 3
            }
          },
          {
            breakpoint: 480,
            settings: {
              arrows: false,
              centerMode: true,
              centerPadding: '40px',
              slidesToShow: 1
            }
          }
        ]
    });

    $.get("https://5d76bf96515d1a0014085cf9.mockapi.io/product", function(responseProductList){
        for(var i=0; i<responseProductList.length; i++){
            if(!responseProductList[i].isAccessory){
                var clothCardSection = $("#cloth-card-section");
                productList(responseProductList[i], clothCardSection);
            }
            else{
                var accessCardSection = $("#access-card-section");
                productList(responseProductList[i], accessCardSection);
            }
        }        
    });

    $(".menu-option").click(function(){
        $(location).attr("href", "./index.html");
    });

    $.get("https://5d76bf96515d1a0014085cf9.mockapi.io/product/"+JSON.parse(localStorage.getItem("productId")), function(responseProductDetails){
        // left section product detail page
        var productLeftSection = $("<div>").addClass("product-left-section");
        var productLeftSectionImg = $("<img>").attr("id", "main-img").attr("src", responseProductDetails.preview);
        productLeftSection.append(productLeftSectionImg);

        // right section product details
        var productRightSection = $("<div>").addClass("product-right-section");
        var nameHeading = $("<h1>").html(responseProductDetails.name);
        var brandHeading = $("<h4>").html(responseProductDetails.brand);
        var priceHeading = $("<h3>").html("Price : RS "+"<span class=\"pricecolour\">"+responseProductDetails.price+"</span>");
        var details = $("<div>").addClass("details");
        var headingDetails = $("<h3>").html("Description");
        var paraDetails = $("<p>").html(responseProductDetails.description);
        details.append(headingDetails, paraDetails);
        var imgPreviewSection = $("<div>").addClass("img-preview-division");
        var headingPreviewSection = $("<h3>").html("Product Preview");
        var previewSection = $("<div>").addClass("preview-section");
        for(var i=0; i<responseProductDetails.photos.length; i++){
            var image = $("<img>").attr("id", "img"+(i+1)).attr("src", responseProductDetails.photos[i]);
            if(i==0){
                image.addClass("active")
            }
            previewSection.append(image);
            image.click(function(){
                $(".preview-section img").removeClass("active");
                $(this).addClass("active");
                $("#main-img").attr("src", $(this).attr("src"));
            });
        }
        imgPreviewSection.append(headingPreviewSection, previewSection);
        var addCartBtnSection = $("<div>").addClass("btn-add-cart");
        var addCartBtn = $("<button>").addClass("addcart").html( "ADD TO CART");
        addCartBtnSection.append(addCartBtn);
        productRightSection.append(nameHeading, brandHeading, priceHeading, details, imgPreviewSection, addCartBtnSection);

        $("#product-section").append(productLeftSection ,productRightSection); 
            
        $(".addcart").click(function(){
            var localProductCart = localStorage.getItem("cart-items") === null ? [] : JSON.parse(localStorage.getItem("cart-items"));
            var checkingVar = 0;
            if(localProductCart === null){
                localProductCart.push({
                    id : JSON.parse(localStorage.getItem("productId")),
                    name : responseProductDetails.name,
                    price : responseProductDetails.price,
                    quantity : 1,
                    preview: responseProductDetails.preview
                    });
                    localStorage.setItem("cart-items", JSON.stringify(localProductCart));
                }
            else{
                for(var i = 0; i < localProductCart.length; i++){
                    if(localProductCart[i].id === JSON.parse(localStorage.getItem("productId"))){
                        localProductCart[i].price += responseProductDetails.price;
                        localProductCart[i].quantity = ++localProductCart[i].quantity; 
                        localStorage.setItem("cart-items", JSON.stringify(localProductCart));
                        checkingVar++;
                        break;
                    }
                }
                if(checkingVar === 0){
                    localProductCart.push({
                        id : JSON.parse(localStorage.getItem("productId")),
                        name : responseProductDetails.name,
                        price : responseProductDetails.price,
                        quantity : 1,
                        preview: responseProductDetails.preview
                    });
                    localStorage.setItem("cart-items", JSON.stringify(localProductCart));
                }
            }

            cartCountNum();
        });
    });

    var cartListData = JSON.parse(localStorage.getItem("cart-items"));
    var cartListDataArticle = $("<article>").addClass("cart-card");
    if(cartListData === null){
        cartListDataArticle.html("Cart is empty")
        $(".cart-left-division").append(cartListDataArticle);
    }else{
        for(var i=0; i<cartListData.length; i++){
            var cartListDataImgDiv = $("<article>").addClass("cart-card");
            var cartProductImageDivision = $("<div>").addClass("cart-product-image");
            var cartProductImage = $("<img>").attr("src", cartListData[i].preview);
            cartProductImageDivision.append(cartProductImage);
            var cartDetailDivision = $("<div>");
            var cartListDataName = $("<h3>").html(cartListData[i].name);
            var cartListDataQua = $("<p>").html("x" + cartListData[i].quantity);
            var cartListDataPrice = $("<p>").html(cartListData[i].price);
            cartDetailDivision.append(cartListDataName, cartListDataQua, cartListDataPrice);
            cartListDataArticle.append(cartProductImageDivision, cartDetailDivision);
            $(".cart-left-division").append(cartListDataArticle);
        }
    }
    

    $(".cart-rel").click(function(){
        $(location).attr("href", "./cart.html");
    });

    $("#place-order-btn").click(function(){
        localStorage.removeItem("cart-items");
        $(location).attr("href", "./orderdone.html");
        
    });   

    function cartCountNum(){
        var cartCount = 0;
        var amountCount = 0;
        var productCartArr = localStorage.getItem("cart-items") === null ? [] : JSON.parse(localStorage.getItem("cart-items"));
        if(productCartArr === null){
            $("#cart-count").html(cartCount);
            $("#items-count").html(0);
            $("#total-amount-count").html(amountCount);
        } else{
            for(var i = 0; i < productCartArr.length; i++){
                cartCount += productCartArr[i].quantity; 
                amountCount+= productCartArr[i].price;
            }
            $("#cart-count").html(cartCount);
            $("#items-count").html(productCartArr.length);
            $("#total-amount-count").html(amountCount);
        }
    }

        
    function productList(data, sectionForAppend){
        cartCountNum();
        
        // product details
        var cardHeading = $("<div>").addClass(cardHeading).html(data.name);
        var cardBrand = $("<p>").addClass("card-para").html(data.brand);
        var cardPrice = $("<p>").addClass("card-para-price").html("Rs "+ data.price);
        
        // Description append
        var cardDiscription = $("<div>").addClass("card-discription");
        cardDiscription.append(cardHeading, cardBrand, cardPrice);

        //  img of product
        var cardImage = $("<img>").addClass("card-image").attr("src", data.preview);
        var cardImageSection = $("<figure>").addClass("card-image-section");
        cardImageSection.append(cardImage);
        
        // create card section and append
        var cardSection = $("<article>").addClass("card").attr("id", data.id);
        cardSection.append(cardImageSection, cardDiscription);

        // select card and append
        sectionForAppend.append(cardSection);

        cardSection.click(function(){
            localStorage.setItem("productId", JSON.stringify($(this).attr("id")));
            console.log(localStorage.getItem("productId"));
            $(location).attr("href", "./product.html");
        });
    }


});
