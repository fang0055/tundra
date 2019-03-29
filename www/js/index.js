let app = {
    people: [],
    savedPeople: [],
    imageURL: "",
    tiny: "",
    peopleKey: "peopleKey",

    init: function () {
        app.ready();

        tiny = new tinyshell(document.querySelector(".profileCtn"));
        tiny.addEventListener("swiperight", app.saveOne);
        tiny.addEventListener("swipeleft", app.deleteOne);
        document.querySelector(".saved").addEventListener("click", app.goToSaved);
        document.querySelector(".home").addEventListener("click", app.goToHome);
    },

    ready: function () {
        if (JSON.parse(sessionStorage.getItem(app.peopleKey))){
            app.checkLocal();
            console.log("what?");
        } else{
            document.querySelector(".remind").classList.remove("remindDisappear");
        }

        let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female"
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                app.people = app.people.concat(data.profiles);
                app.imageURL = "https:" + decodeURIComponent(data.imgBaseURL);
                console.log(app.imageURL);
                console.log(app.people);
                app.createCard();
            })
            .catch((err) => {
                console.log(err);
            })
    },

    checkLocal: function(){
        app.savedPeople = JSON.parse(sessionStorage.getItem(app.peopleKey));
        if (app.savedPeople.length == 0){
            console.log("0000000?");
            document.querySelector(".remind").classList.remove("remindDisappear");
        }
    },

    createCard: function () {
        document.querySelector(".pic").src = app.imageURL + app.people[0].avatar;
        document.querySelector(".nameText").textContent = app.people[0].first + " " + app.people[0].last;
        document.querySelector(".genderText").textContent = app.people[0].gender;
        document.querySelector(".distanceText").textContent = app.people[0].distance;
        console.log(app.people);
    },

    saveOne: function () {
        app.savedPeople.push(app.people[0]);
        document.querySelector(".remind").classList.add("remindDisappear");
        sessionStorage.setItem("peopleKey", JSON.stringify(app.savedPeople));
        app.people.splice(0, 1);
        app.createCard();
        if (app.people.length < 3) {
            app.ready();
        }
    },

    deleteOne: function () {
        app.people.splice(0, 1);
        app.createCard();
        if (app.people.length < 3) {
            app.ready();
        }
    },

    goToSaved: function () {
        app.createList()

        document.querySelector(".homePage").classList.add("hide");
        document.querySelector(".listPage").classList.remove("hide");
    },

    goToHome: function () {
        document.querySelector(".homePage").classList.remove("hide");
        document.querySelector(".listPage").classList.add("hide");
    },

    createList: function () {
        document.querySelector(".listPage").innerHTML = "";

        app.savedPeople.forEach((item) => {
            let documentFragment = new DocumentFragment();
            let listCtn = document.createElement("div");
            let listPic = document.createElement("img");
            let fullname = document.createElement("div");
            let firstname = document.createElement("div");
            let lastname = document.createElement("div");
            let deleteCtn = document.createElement("div");
            let deleteBtn = document.createElement("i");

            listCtn.className = "listCtn";
            listPic.className = "listPic";
            fullname.className = "fullname";
            firstname.className = "firstname";
            lastname.className = "lastname";
            deleteCtn.className = "deleteCtn";
            deleteBtn.className = "deleteBtn far fa-trash-alt";
            deleteBtn.setAttribute("data-id", item.id);
            deleteBtn.addEventListener("click", app.deleteItem);

            listPic.src = app.imageURL + item.avatar;
            firstname.textContent = item.first;
            lastname.textContent = item.last;

            fullname.appendChild(firstname);
            fullname.appendChild(lastname);
            listCtn.appendChild(listPic);
            listCtn.appendChild(fullname);
            deleteCtn.appendChild(deleteBtn);
            listCtn.appendChild(deleteCtn);
            documentFragment.appendChild(listCtn);
            document.querySelector(".listPage").appendChild(documentFragment);
        })
    },

    deleteItem: function (ev) {
        ev.currentTarget.classList.add("deleteBtnRed");
        document.querySelector(".deleteBtnRed").classList.add("deleteBtnWhite");

        navigator.notification.confirm(
            "Are you sure to delete this reminder?", 
            app.deleteRmd,
            "Confirmation",
            ["Cancel", "Confirm"]
        );
    },

    deleteRmd: function (buttonIndex) {
        if (buttonIndex == 1) {
            document.querySelector(".deleteBtnRed").classList.remove("deleteBtnRed");
            document.querySelector(".deleteBtnWhite").classList.remove("deleteBtnWhite");
        } else {
            let id = document.querySelector(".deleteBtnRed").getAttribute("data-id");
            let i = app.savedPeople.findIndex(item => item.id == id);
            app.savedPeople.splice(i, 1);
            console.log(app.savedPeople.length);
            sessionStorage.setItem("peopleKey", JSON.stringify(app.savedPeople));

            document.querySelector(".deleteBtnRed").classList.add("deleteBtnCfm");
            document.querySelector(".deleteBtnRed").parentElement.parentElement.classList.add("removeItem");
            setTimeout(() => {
                document.querySelector(".deleteBtnRed").classList.add("deleteBtnHide");
                document.querySelector(".deleteBtnRed").parentElement.parentElement.classList.add("hideItem");
            }, 500);

            setTimeout(() => {
                document.querySelector(".listPage").removeChild(document.querySelector(".removeItem"));
                if(app.savedPeople.length < 1){
                    document.querySelector(".remind").classList.remove("remindDisappear");
                }
            }, 850);
        }
    }
};

if ("cordova" in window) {
    document.addEventListener("deviceready", app.init);
} else {
    document.addEventListener("DOMContentLoaded", app.init);
}