let app = {
    people: [],
    savedPeople: [],
    imageURL: "",
    tiny: "",

    init: function (){
        app.ready();

        tiny = new tinyshell(document.querySelector(".profileCtn"));
        tiny.addEventListener("swiperight", app.saveOne);
        tiny.addEventListener("swipeleft", app.deleteOne);
        document.querySelector(".saved").addEventListener("click", app.goToSaved);
        document.querySelector(".home").addEventListener("click", app.goToHome);
    },

    ready: function (){
        let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female"
        fetch(url)
            .then( (res) => { return res.json(); } )
            .then( (data) => {
                app.people = app.people.concat(data.profiles);
                app.imageURL = decodeURIComponent(data.imgBaseURL);
                // localStorage.setItem("peopleKey", JSON.stringify(app.people));
                console.log(app.people);
                app.createCard();
            } )
            .catch( (err) => {
                console.log(err);
            })
    },

    createCard: function(){
        document.querySelector(".pic").src = app.imageURL+app.people[0].avatar;
        document.querySelector(".nameText").textContent = app.people[0].first + " " + app.people[0].last;
        document.querySelector(".genderText").textContent = app.people[0].gender;
        document.querySelector(".distanceText").textContent = app.people[0].distance;
        console.log(app.people);
    },

    saveOne: function(){
        app.savedPeople.push(app.people[0]);
        app.people.splice(0,1);
        app.createCard();
        if (app.people.length < 3){
            app.ready();
        }
    },

    deleteOne: function(){
        app.people.splice(0,1);
        app.createCard();
        if (app.people.length < 3){
            app.ready();
        }
    },

    goToSaved: function (){
        app.createList()

        document.querySelector(".homePage").classList.add("hide");
        document.querySelector(".listPage").classList.remove("hide");
    },

    goToHome: function (){
        document.querySelector(".homePage").classList.remove("hide");
        document.querySelector(".listPage").classList.add("hide");
    },

    createList: function (){
        document.querySelector(".listPage").innerHTML = "";

        app.savedPeople.forEach( (item) => {
            let documentFragment = new DocumentFragment();
            let listCtn = document.createElement("div");
            let listPic = document.createElement("img");
            let fullname = document.createElement("div");
            let firstname = document.createElement("div");
            let lastname = document.createElement("div");
            let deleteBtn = document.createElement("i");

            listCtn.className = "listCtn";
            listPic.className = "listPic";
            fullname.className = "fullname";
            firstname.className = "firstname";
            lastname.className = "lastname";
            deleteBtn.className = "deleteBtn far fa-trash-alt";

            listPic.src = app.imageURL + item.avatar;
            firstname.textContent = item.first;
            lastname.textContent = item.last;

            fullname.appendChild(firstname);
            fullname.appendChild(lastname);
            listCtn.appendChild(listPic);
            listCtn.appendChild(fullname);
            listCtn.appendChild(deleteBtn);
            documentFragment.appendChild(listCtn);
            document.querySelector(".listPage").appendChild(documentFragment);

        })
    }
};

if ("cordova" in window){
    document.addEventListener("deviceready", app.init);
} else{
    document.addEventListener("DOMContentLoaded", app.init);
}