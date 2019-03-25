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
                app.imageURL = data.imgBaseURL;
                console.log(app.imageURL);
                console.log(app.people);
            } )
    }
};

if ("cordova" in window){
    document.addEventListener("deviceready", app.init);
} else{
    document.addEventListener("DOMContentLoaded", app.init);
}