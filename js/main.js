let elGilosWarpper = document.querySelector(".gilos__card-wrapper");
let elForm = document.querySelector(".input__form");
let elInputSearch = document.querySelector("#input__search");
let elInputForm = document.querySelector("#input__from");
let elinputTo = document.querySelector("#input__to");
let elSelectManufacture = document.querySelector(".select__manufacturer");
let elSelectSort = document.querySelector(".select__sort");
let elRenderResult = document.querySelector(".render__result");
let elProductAdd = document.querySelector(".product__add");
let elGilosEditForm = document.querySelector(".gilos__edit-form");
let elGilosModalTitle = document.querySelector("#gilosModalLabel");
let elEditBtn = document.querySelector("#editBtn")
let elLoadingWrapper = document.querySelector(".loading__wrapper")
let elModalBody = document.querySelector(".modal-body")
let elGilosCardTemplate = document.querySelector("#gilos__card-temp");
let elfilterBtn = document.querySelector(".filter__btn")
let elModal = new bootstrap.Modal(document.querySelector("#student-modal"))

let apiUrlProducts = "http://167.235.158.238/products";

let products = [];

function renderProducts(array, wrapper) {
    wrapper.innerHTML = null;
    elRenderResult.textContent = array.length
    let productsFragment = document.createDocumentFragment()
    
    for (const item of array) {
        let gilosCardTemplate = elGilosCardTemplate.cloneNode(true).content
        gilosCardTemplate.querySelector(".card__img").src = item.img;
        gilosCardTemplate.querySelector(".card__title").textContent = item.title;
        gilosCardTemplate.querySelector(".card__text-bg").textContent = item.price;
        gilosCardTemplate.querySelector(".card__text-line").textContent = item.price;
        gilosCardTemplate.querySelector(".card__xiomi-model").textContent = item.model;
        gilosCardTemplate.querySelector(".card__date").textContent = item.addedDate;
        gilosCardTemplate.querySelector(".gilos__edit").dataset.gilosEditId = item.id;
        gilosCardTemplate.querySelector(".gilos__delete").dataset.gilosDeleteId = item.id
        
        let benefits = gilosCardTemplate.querySelector(".ul__wrapper")
        item.benefits.forEach(item => {
            let elBenefit = document.createElement("li");
            elBenefit.className = "badge bg-primary me-1 mb-1";
            elBenefit.textContent  = item
            benefits.appendChild(elBenefit)
        });
        
        productsFragment.appendChild(gilosCardTemplate)
        
    }
    wrapper.appendChild(productsFragment)
}

let showErrorAlert = (alertWrapper, errMsg) => {
    let elAlertP = document.createElement("p")
    elAlertP.textContent = errMsg || "Xatolik yuz berdi"
    elAlertP.className = "alert alert-danger"
    alertWrapper.appendChild(elAlertP)
    
    return elAlertP
}

let elLoadingP = document.createElement("p")
elLoadingP.className = "loader"
elLoadingWrapper.prepend(elLoadingP)


// renderProducts(products, elGilosWarpper)

fetch(apiUrlProducts)
.then((res) => {
    if (res.status === 200) {
        return res.json()
    }
    return Promise.reject(res)
})
.then(data => {
    if (data) {
        products = data
        renderProducts(products, elGilosWarpper)   
    } 
})
.catch((err) => {
    if (err.status === 404) {
        return showErrorAlert(elLoadingWrapper, "Hech narsa topilmadi 404!")
    }
    showErrorAlert(elLoadingWrapper, "Menda xatolik ketti")
})
.finally(() => {
    elLoadingP.remove()
})



elForm.addEventListener("submit", function(evt) {
    evt.preventDefault()
    
    let inputSearch = elInputSearch.value.trim();
    let pattern = new RegExp(inputSearch, "gi")
    let inputForm = elInputForm.value.trim();
    let inputTo = elinputTo.value.trim();
    let selectManufacture = elSelectManufacture.value.trim();
    let selectSort = elSelectSort.value.trim();
    
    elfilterBtn.disabled = true
    let isOrderIncludes = selectSort.includes("&_order=")
    let splittedSortValue = selectSort.split("&_order=")
    
    
    fetch(`${apiUrlProducts}?${new URLSearchParams({
        title_like: inputSearch,
        price_gte: inputForm || 0,
        _sort: isOrderIncludes ? splittedSortValue[0] : selectSort,
        _order: isOrderIncludes ? splittedSortValue[1] : "asc"
        
    })}`
    )
    .then((res) => {
        if (res.status === 200) {
            return res.json()
        }
        return Response.reject(res)
    })
    .then((data) => {
        renderProducts(data, elGilosWarpper)
    })
    .catch(() => {
        return showErrorAlert(elLoadingWrapper, "Filterda xato yuz berdi")
    })
    .finally(() => {
        elfilterBtn.disabled = false
    })
    
    // let filteredArray = products.filter(function(item) {
    //     let isTrue = true
    //     if (isTrue == "Name") {
    //         isTrue = true
    //     }else{
    //         isTrue = item.title.includes(selectSort)
    //     }
    //     let searchByName = item.title.match(pattern)
    //     let validation = `${item.title}`.toLowerCase().includes(inputSearch) && `${item.price}`.includes(inputForm) && searchByName
    //     return validation
    // })
    
    // filteredArray.sort((a, b) => {
    //   switch (selectSort) {
    //       case "Title":
    //         if (a.title > b.title) {
    //             return 1
    //         }else if (a.title < b.title){
    //             return -1
    //         }
    //         return 0
    //       case "Price: to lowest":
    //         return a.price - b.price
    //       case "Price: to highest":
    //         return b.price - a.price
    //         case "Marked date":
    //             let aDate = new Date(a.addedDate)
    //             let bDate = new Date(b.addedDate)
    //             return aDate.getTime() - bDate.getTime()
    //       default:
    //         return 0
    //   }
    
    //     if (selectSort == "Title") {
    //         if (a.title > b.title) {
    //             return 1
    //         }else if (a.title < b.title){
    //             return -1
    //         }
    //         return 0
    //     }else if (selectSort == "Price: to lowest") {
    //         return a.price - b.price
    //     }else if (selectSort == "Price: to highest"){
    //         return b.price - a.price
    //     }else if(selectSort == "Marked date"){
    //         let aDate = new Date(a.addedDate)
    //         let bDate = new Date(b.addedDate)
    //         return aDate.getTime() - bDate.getTime()
    //     }
    // })
    // renderProducts(filteredArray, elGilosWarpper)
})


elGilosWarpper.addEventListener("click", function(evt) {
    if (evt.target.matches(".gilos__delete")) {
        let gilosIdD = +evt.target.dataset.gilosDeleteId
        evt.target.disabled = true
        fetch(`${apiUrlProducts}/${gilosIdD}`, {
            method: "DELETE",
        })
        .then((res) => {
            if (res.status === 200) {
                return res.json()
            }
            return Promise.reject(res)
        })
        .then(() => {
            let deleteIndexGilos = products.findIndex(function(item) {
                return item.id == gilosIdD
            })
            products.splice(deleteIndexGilos, 1)
            renderProducts(products, elGilosWarpper)
        })
        .catch(() => {
            evt.target.disabled = false
            showErrorAlert(elLoadingWrapper, "Ochirish mobaynida xatolik yuz berdi")
        })
    }
    
    if (evt.target.matches(".gilos__edit")) {
        let gilosIdE = +evt.target.dataset.gilosEditId
        let editGilosFind = products.find(function(item) {
            return item.id == gilosIdE
        })
        
        let {product__title: elProductTitle, price: elProductPrice, benefits: elBenefits} = elGilosEditForm.elements;
        
        elProductTitle.value = editGilosFind.title;
        elProductPrice.value = editGilosFind.price;
        elBenefits.value = editGilosFind.benefits;
        
        elGilosModalTitle.textContent = "Edit product";
        elEditBtn.textContent = "Edit product";
        elGilosEditForm.dataset.type = "edit"
        elGilosEditForm.dataset.gilosEditId = editGilosFind
    }
})

elProductAdd.addEventListener("click", () => {
    elGilosModalTitle.textContent = "Add product"
    elEditBtn.textContent = "Add product"
    elGilosEditForm.dataset.type = ""
})

elGilosEditForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    
    let {product__title: {value: valueProduct}, price: {value: valuePrice}, benefits: {value: valueBenefits}} = elGilosEditForm.elements;
    
    if (valueProduct.trim() && valuePrice.trim()  && valueBenefits.trim()) {
        let addNewProduct = {
            id: Math.floor(Math.random() * 1000),
            title: valueProduct,
            price: valuePrice,
            benefits: valueBenefits.split(" "),
            addedDate: new Date().toISOString(),
            img: "https://picsum.photos/300/200"
        }
        
        elEditBtn.disabled = true;
        elEditBtn.textContent = `Adding ${valueProduct} ...`
        
        let {gilosEditId} = elGilosEditForm.dataset
        if (!gilosEditId) {
            fetch(apiUrlProducts, {
                method: "POST",
                body: JSON.stringify({
                    title: valueProduct,
                    price: valuePrice,
                    benefits: valueBenefits.split(" "),
                    addedDate: new Date().toISOString(),
                    img: "https://picsum.photos/300/200"
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => {
                if (res.status === 201) {
                    return res.json()
                }
            })
            .then((data) => {
                products.push(data)
                renderProducts(products, elGilosWarpper)
            })
            .catch(() => {
                let elErrorShow = showErrorAlert(
                    elModalBody,
                    `${valueProduct} ni yozyotganda xatilok yuz berdi`)
                    elErrorShow.style = "margin-top: 10px";
                })
                .finally(() => {
                    elEditBtn.disabled = false
                    elEditBtn.textContent = "Add product"
                })
            }else{
                let productIdNum = +gilosEditId
                addNewProduct.id = productIdNum
                let productIndex = products.find(function(item) {
                    return item.id == productIdNum
                })
                
                products.splice(productIndex, 1, addNewProduct)
                fetch(`${apiUrlProducts}/${productIdNum}`, {
                    method: "PUT",
                    body: JSON.stringify(addNewProduct),
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                .then((res) => {
                    if (res.status === 201) {
                        return res.json()
                    }
                    console.log(res);
                    return Promise.reject(res)
                })
                .then((data) => {                                                                   
                    products.push(data)
                    renderProducts(products, elGilosWarpper)
                })
                .catch(() => {
                    let editShowError =  showErrorAlert(elModalBody, "Edit bolyotkanda xato yuz berdi" )
                    editShowError.style = "margin-top: 10px"
                })
            }
            product__title.value = "";
            price.value = "";
            benefits.value = "";
        }
    }) 