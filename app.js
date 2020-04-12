// Storage Controller

const StorageCtrl = (function () {



    return {
        // public methods
        storeItem: function (newItem) {

            let items;

            //check if any items ls

            if (localStorage.getItem("items") === null) {

                // no items in storage

                items = [];
                items.push(newItem);

                // set it at storage


                localStorage.setItem("items", JSON.stringify(items));


            }
            else {

                // get existing data
                items = JSON.parse(localStorage.getItem("items"));

                // add new item

                items.push(newItem);

                // update storage

                localStorage.setItem("items", JSON.stringify(items));

                console.log(JSON.parse(localStorage.getItem("items")))

            }

        },
        getItemsFromStorage: function () {

            let items;

            if (localStorage.getItem("items") === null) {

                items = [];
            }
            else {

                items = JSON.parse(localStorage.getItem("items"));

            }


            return items;
        },
        updateItemStorage: function (updatedItem) {


            let items = JSON.parse(localStorage.getItem("items"));

            // comparing items id

            items.forEach((item, index) => {

                if (updatedItem.id === item.id) {

                    items.splice(index, 1, updatedItem);

                }



            })

            localStorage.setItem("items", JSON.stringify(items));



        },

        deleteItemFromStorage: function (id) {


            let items = JSON.parse(localStorage.getItem("items"));

            // comparing items id

            items.forEach((item, index) => {

                if (id === item.id) {


                    // removing it from the array
                    items.splice(index, 1);

                }



            })

            localStorage.setItem("items", JSON.stringify(items));

        },
        clearLocalStorage: function () {



            localStorage.removeItem("items");

        }


    }

})();



//Item Controller
const ItemCtrl = (function () {

    // private Section

    //Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
        // assiging values
    }
    // DataStructures/State

    const data = {
        // items: [
        // {id:0,name:"Steak Dinner",calories:1200},
        // {id:1,name:"Cookie",calories:400},
        // {id:2,name:"Eggs",calories:300}
        // ],

        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        previousItem: null,
        totalCalories: 0
    }


    return {
        // public methods

        logData: function () {
            //  i am going to be using function to return a private thing
            return data;
            // data has became public now
        },
        getItems: function () {

            return data.items;
        },

        addItem: function (name, calories) {

            // updating datastructure

            let ID;
            // create ID
            if (data.items.length > 0) {

                // data.items.length-1 will get us the last 
                // item within that list
                ID = data.items[data.items.length - 1].id + 1;
                // this is getting the id of the last item in the
                // list

            }
            else {

                ID = 0;


            }
            //   we are converting to a number since capture value gets in 
            //   as a String
            calories = parseInt(calories);

            //   this is 1 way of doing it
            //   const item={
            //       id:ID,
            //       name:name,
            //       calories:calories
            //   }


            // the better way of doing it  is using the exisiting construcotr
            const newItem = new Item(ID, name, calories)

            // pushing the new item to the items array
            data.items.push(newItem);


            // returning back the new list of items after being updated to the UI Ctrl
            // and updating it on the UI to the user
            // UICtrl.populateItemList(data.items);
            // this was ok to do but its not good for code oraganization

            return newItem;


        },
        getItemById: function (id) {

            let found = null;
            data.items.forEach((item) => {

                if (item.id === id) {

                    found = item;
                    // assigin the item to a variable
                }
            })
            // passing it back to the app controller
            return found;
        },

        setPreviousItem: function (item) {

            data.previousItem = item;

        },
        getPreviousItem: function () {

            return data.previousItem
        },
        setCurrentItem: function (currentItem) {

            // assiging the current item to the item which 
            // the edit event occured at
            data.currentItem = currentItem;


        },
        updateItem: function (name, calories) {

            calories = parseInt(calories);

            let found = null;

            data.items.forEach((item) => {

                if (item.id === data.currentItem.id) {

                    // looping to find the item that matches the curret item

                    item.name = name;
                    item.calories = calories;

                    found = item;
                }



            })


            // retruning it to use it at the ui ctrl
            return found;

        },

        deleteItem: function (id) {

            // Gets ids

            // instead of each to get a value and store it in ids
            // it will be stored as array
            ids = data.items.map((item) => item.id);

            const index = ids.indexOf(id);

            // getting the index of deleted item

            // remove from array

            data.items.splice(index, 1);



        },
        clearAllItems: function () {

            data.items = [];
        },

        getTotalCalories: function () {

            let totalCalories = 0;

            data.items.forEach((item) => {

                totalCalories += item.calories;

            })

            return totalCalories;


        },
        getCurrentItem: function () {

            return data.currentItem;
        }


    }

})();





//UI Controller

const UICtrl = (function () {

    // private Section

    const UISelectors = {

        // storing the HTML elements that are going to be used

        itemList: "#item-list",
        addBtn: ".add-btn",
        ItemNameInput: "#item-name",
        ItemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        listItems: "#item-list li",
        clearBtn: ".clear-btn"



    }

    return {

        // public methods

        populateItemList: function (items) {
            let html = ``;

            items.forEach((item) => {

                html += ` <li class="collection-item" id="item-${item.id}">
                <strong class="item-name">  ${item.name} </strong>  <em class="item-calories"> ${item.calories} Calories </em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`
            });
            // insert into ul
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getUISelectors: function () {
            return UISelectors;
            // passing it to the appCtrl since they are private
        },
        getItemInput: function () {

            return {

                name: document.querySelector(UISelectors.ItemNameInput).value,
                calories: document.querySelector(UISelectors.ItemCaloriesInput).value

                //    returning the values of the html elements to capture


            }

        },

        addListItem: function (item) {


            // show the list if it was hidden before
            document.querySelector(UISelectors.itemList).style.display = "block";

            // creating the li 

            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML =
                `<strong class="item-name">  ${item.name} </strong>  <em class="item-calories"> ${item.calories} Calories </em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`
            // then appending it to the ul

            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);

        },
        clearInputs: function () {
            // clearing out input fields
            document.querySelector(UISelectors.ItemNameInput).value = "";
            document.querySelector(UISelectors.ItemCaloriesInput).value = "";
        },

        clearEditState: function (e) {
            UICtrl.clearInputs();
            // hiding buttons other than add button
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline";
        },
        showEditState: function () {

            document.querySelector(UISelectors.deleteBtn).style.display = "inline";
            document.querySelector(UISelectors.updateBtn).style.display = "inline";
            document.querySelector(UISelectors.backBtn).style.display = "inline";
            document.querySelector(UISelectors.addBtn).style.display = "none";

        },
        addItemToForm: function () {

            const currentItem = ItemCtrl.getCurrentItem();
            document.querySelector(UISelectors.ItemNameInput).value = currentItem.name;
            document.querySelector(UISelectors.ItemCaloriesInput).value = currentItem.calories;

            UICtrl.showEditState();

        },
        hideList: function () {


            // undisplaying the ul of no items were there
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        updateListItem: function (item) {

            let listItems = document.querySelectorAll(UISelectors.listItems);
            // convert nodelist into array to use foreach

            listItems = Array.from(listItems);

            listItems.forEach((listItem) => {


                const itemId = listItem.getAttribute("id");


                if (itemId === `item-${item.id}`) {

                    // to get the one that needs to be updated

                    document.getElementById(`${itemId}`).innerHTML = `<strong class="item-name">  ${item.name} </strong>  <em class="item-calories"> ${item.calories} Calories </em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`

                }

            })

        },

        deleteListItem: function (id) {
            // item id
            const itemID = `#item-${id}`;

            // selecting the list which has the same id
            const item = document.querySelector(itemID);

            // removing the li
            item.remove();

            // // hiding the ul as well
            // this.hideList();

        },

        removeItems: function () {


            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn node list to array
            listItems = Array.from(listItems);

            listItems.forEach((item) => {

                // removing all lis

                item.remove();



            })

            // hiding the ul

            this.hideList();



        },

        populateTotalCalories: function (totalCalories) {

            // updating total calores
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;


        }



    }

})();



//App Controller
const AppCtrl = (function (ItemCtrl, UICtrl, StorageCtrl) {
    // so here i am passing the two controllers to the app controller

    // private Section

    //  EventListners

    const loadEventListners = function () {

        // getting UISelectors
        const UISelectors = UICtrl.getUISelectors();

        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);

        // Disable submit on enter

        document.addEventListener("keypress", function (e) {

            if (e.keyCode === 13 || e.which === 13) {

                // this is us disabling the enter key to avoid bugs

                e.preventDefault();
                return false;
            }

        });

        // edit icon click evenetk

        document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);

        // update button

        document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);

        // backbtn
        document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState);

        // deletebtn

        document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);


        // clearAll btnk
        document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemClick);

        document.addEventListener("DOMContentLoaded", updateApp)


    }

    const updateApp = function () {

        UICtrl.populateTotalCalories(ItemCtrl.getTotalCalories());
        UICtrl.populateItemList(ItemCtrl.getItems());

    }


    // AddItemSubmit    

    const itemAddSubmit = function (e) {

        // getForm Input From Ui controller

        // getting an object of input results from UI controller
        const input = UICtrl.getItemInput();

        // Check for name and calories input

        // making sure all inputs are fine
        if (input.name !== "" & input.calories !== "") {

            // AddItems

            // const add=ItemCtrl.addItem({id:3,name:input.name,calories:input.calories});


            const newItem = ItemCtrl.addItem(input.name, input.calories);



            // store in local storaeg
            StorageCtrl.storeItem(newItem);


            // addItem to ui
            UICtrl.addListItem(newItem);

            //Get Total Calorie

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.populateTotalCalories(totalCalories);






            // clearing out the values in the ui
            UICtrl.clearInputs();


            // additems to UI   
            // this is bad bcs we are going to have to loop through all the items which
            // is gonna take more time for it to load
            // const items=ItemCtrl.getItems();
            // so here i am getting the latest version of items after being updated

            // then passing that updates list to the populateItemList function
            // in order to display on the UI
            // that also stupid way of doing it 
            // UICtrl.populateItemList(items);
            // add({id:3,name:input.name,calories:input.calories});
        }

        e.preventDefault()
    }
    const itemEditClick = function (e) {

        // making sure that the target is the edit button itself
        if (e.target.classList.contains("edit-item")) {

            // Get list item id 
            const listId = e.target.parentNode.parentNode.id;

            // i am splitting it into two index of an array
            // splitting occurs at the -
            // getting the number of id using indexes
            const listIdArr = listId.split("-");

            // getting the number of i and converting it to int
            const id = parseInt(listIdArr[1]);

            // getITem

            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);

            // add item to Form
            // display ui buttons
            UICtrl.addItemToForm();

        }

        e.preventDefault();
    }
    itemUpdateSubmit = function (e) {



        // getItemINput

        const input = UICtrl.getItemInput();

        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        StorageCtrl.updateItemStorage(updatedItem);

        // updating totalCalories
        UICtrl.populateTotalCalories(ItemCtrl.getTotalCalories());

        // simple way of updating the ui
        // show new items
        // UICtrl.populateItemList(ItemCtrl.getItems());

        // uiclear input field

        UICtrl.clearEditState();


        e.preventDefault();
    }

    const itemDeleteSubmit = function (e) {


        //Get current item 

        const currentItem = ItemCtrl.getCurrentItem();

        //delete from datastructure

        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);


        // delete from local stoarge

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        // clearing edit state

        UICtrl.clearEditState();

        // upadate totalCalories

        UICtrl.populateTotalCalories(ItemCtrl.getTotalCalories());


        e.preventDefault();
    }

    const clearAllItemClick = function (e) {


        // Delete all items from data structure

        ItemCtrl.clearAllItems();

        // remove from Storage

        StorageCtrl.clearLocalStorage();

        // remove From ui

        UICtrl.removeItems();

        UICtrl.populateTotalCalories(ItemCtrl.getTotalCalories());


        e.preventDefault();
    }
    return {
        // public methods

        init: function () {
            // initalizing app

            // clear edit state

            UICtrl.clearEditState();

            //fetch items from dataStructure
            //Storing the items to a variable and passing it to UICtrl
            const items = ItemCtrl.getItems();

            // check if anyitems
            // if no items we hide the ul
            if (items.length === 0) {
                UICtrl.hideList();
            }
            else {
                // otherwise we show item list
                // Populate list wit items

                UICtrl.populateItemList(items);

            }

            // initig the function to load event listners
            loadEventListners();
        }
    }

})(ItemCtrl, UICtrl, StorageCtrl);

// initating app
AppCtrl.init();
