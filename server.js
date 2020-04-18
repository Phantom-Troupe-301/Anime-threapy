'use strict';

require('dotenv').config();

const express = require('express');

const superagent = require('superagent');

const cors = require('cors');
var request = require('request');
const app = express();

const PORT = process.env.PORT || 3030;

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.static('./public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
let date = new Date();
let today = date.getDay()
var search = days[today - 1];
var newsArray = [];
app.get('/index', function (req, res) {
    res.redirect('/');
})
app.get('/Contact', function (req, res) {
    res.render('Contact');
})
app.get('/aboutUs',function (req,res){
    res.render('aboutUs');
})
app.get('/', (req, res) => {
    let animeTop = [];
    let url = `https://api.jikan.moe/v3/top/anime`;
    let url2 = `https://api.jikan.moe/v3/schedule`;
    superagent.get(url2).then((news) => {
        if (search == 'friday') {
            news.body.friday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'saturday') {
            news.body.saturday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'sunday') {
            news.body.sunday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'monday') {
            news.body.monday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'tuesday') {
            news.body.tuesday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'wednesday') {
            news.body.wednesday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        } else if (search == 'thursday') {
            news.body.thursday.map((topList) => {
                let animeNews = new Genre(topList);
                newsArray.push(animeNews);
            });
        }
        res.render('./home', { top: animeTop, news: newsArray });
    });
    superagent.get(url).then((topAnime) => {
        topAnime.body.top.map((topList) => {
            let TopAnimeData = new Top(topList);
            animeTop.push(TopAnimeData);
        });
    });
})

function Top(topRank) {
    this.rank = topRank.rank;
    this.title = topRank.title;
    this.image_url = topRank.image_url;
    this.episodesOrVolumes = topRank.episodes || topRank.volumes || 'sitll';
    this.type = topRank.type;
    this.score = topRank.score;
    this.start_date = topRank.start_date;
    this.end_date = topRank.end_date || 'ongoing';
}
app.post('/anime', animeSaver);
app.post('/genre', byGenre)

function animeSaver(req, res) {
    let animeSumarry = [];
    let search_input = req.body.search;
    console.log('asdasdasdasdasdasdasdasdasd', search_input)
    let url = `https://kitsu.io/api/edge/anime?filter[text]=${search_input}`;
    //     console.log('knknlnlknlknlnlkn', url)
    superagent.get(url).then((dataOfAnime) => {
        dataOfAnime.body.data.map((val) => {
            var animeData = new Anime(val);
            animeSumarry.push(animeData);
            console.log(animeSumarry, 'asdkpasjdkhasdshdj');
        });
        res.render('./anime', { animeSearch: animeSumarry });
    });
}

function Anime(data) {
    this.title = data.attributes.canonicalTitle;
    this.title_Japan = data.attributes.titles.ja_jp;
    this.averageRating = data.attributes.averageRating;
    this.date = data.attributes.createdAt;
    this.image = data.attributes.posterImage.large;
    this.gener_old = data.attributes.ageRatingGuide;
    this.subtype = data.attributes.subtype;
    this.status = data.attributes.status;
    this.episodeCount = data.attributes.episodeCount;
    this.episodeLength = data.attributes.episodeLength;
    this.youtubeVideoId = data.attributes.youtubeVideoId;
    this.synopsis = data.attributes.synopsis;
}



function byGenre(req, res) {
    let genreSumarry = [];
    let search_input = req.body.search;
    console.log('fafafafafafa', req.body);
    let url = `https://api.jikan.moe/v3/genre/anime/${search_input}`;

    superagent.get(url).then((animeSearch) => {
        animeSearch.body.anime.map((theAnime) => {
            let geneerData = new Genre(theAnime);
            genreSumarry.push(geneerData);
            //   console.log('lkmsclkmaslkmxlkasmxlkm', theAnime.genres)
        });
        res.render("./genre", { genreAnemi: genreSumarry });
    });
}

app.post('/', (req, res) => {

    var email = req.body.email;
    var data = {
        "members": [
            {

                email_address: email,
                status: 'subscribed',
            }
        ],

    }
    var JSONdata = JSON.stringify(data);

    var options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/cae09b63f7',
        method: 'POST',
        headers: {
            "Authorization": "alaa c2022d468ec18180c4be2692c07ad7e9-us19"

        },
        body: JSONdata

    }

    request(options, (error, response, body) => {
        if (response.statusCode === 200) {
            alert("We will Contact u soon");

        }
    })

})
app.post('/contact', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var Phone = req.body.phone;
    var msg = req.body.message;
   
    var data = {
        "members": [
            {

                email_address: email,
                status: 'subscribed',
                merge_fields:
                {

                    FNAME: firstname,
                    LNAME: lastname,
                    PHONE: Phone,
                    MMERGE5: msg
                }



            }
        ],

    }
    var JSONdata = JSON.stringify(data);

    var options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/cae09b63f7',
        method: 'POST',
        headers: {
            "Authorization": "alaa c2022d468ec18180c4be2692c07ad7e9-us19"

        },
        body: JSONdata

    }

    request(options, (error, response, body) => {
        console.log("message has been sent");
        response.redirect("/");
    })

})

function Genre(data) {
    this.title = data.title;
    this.image_url = data.image_url;
    this.synopsis = data.synopsis;
    this.airing_start = data.airing_start;
    this.type = data.type;
    this.source = data.source;
    this.episodes = data.episodes;
    this.score = data.score;
    this.producers = data.producers.name;
    this.genres = data.genres;
}

app.listen(PORT, () => {
    console.log(`this is our port ${PORT}`);
})