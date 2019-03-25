let app = {
    people: [],

    init: function () {
        app.ready();
    },

    ready: function () {
        let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female"
        fetch(url)
            .then( (res) => { return res.json(); } )
            .then( (data) => {
                console.log(data.profiles);
                app.people = app.people.concat(data.profiles);
                console.log(app.people);
            } )
    }
};

if ("cordova" in window){
    document.addEventListener("deviceReady", app.init);
} else{
    document.addEventListener("DOMContentLoaded", app.init);
}