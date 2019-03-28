let app = {
    people: [],
    imageURL: "",

    init: function () {
        app.ready();
    },

    ready: function () {
        let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female"
        fetch(url)
            .then( (res) => { return res.json(); } )
            .then( (data) => {
                app.people = app.people.concat(data.profiles);
                app.imageURL = decodeURIComponent(data.imgBaseURL);
                localStorage.setItem("peopleKey", JSON.stringify(app.people));
                console.log(app.imageURL);
                console.log(app.people);
                app.createCard();
            } )
    },

    createCard: function() {
        document.querySelector(".pic").src = `${app.imageURL}${app.people[0].avatar}`;
        document.querySelector(".nameText").textContent = app.people[0].last;
        document.querySelector(".genderText").textContent = app.people[0].gender;
        document.querySelector(".distanceText").textContent = app.people[0].distance;

    }
};

if ("cordova" in window){
    document.addEventListener("deviceready", app.init);
} else{
    document.addEventListener("DOMContentLoaded", app.init);
}