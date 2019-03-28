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
        document.querySelector(".pic").src = `${app.imageURL}${app.people[0].avatar}`;
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
    }
};

if ("cordova" in window){
    document.addEventListener("deviceready", app.init);
} else{
    document.addEventListener("DOMContentLoaded", app.init);
}