'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
var request = require('request');
const PORT = process.env.PORT || 3030;
const client = new pg.Client(process.env.DATABASE_URL);

app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// the routes
app.post('/anime', animeSaver);
app.post('/genre', byGenre)
app.post('/details', detailsRender);
app.post('/detail', detailRender);
app.post('/add', addAnime);
app.get('/favAnime', getAnimeDetails);
app.delete('/delete/:bookResults_id', deletebook);

app.get('/index', function(req, res) {
    res.redirect('/');
})
app.get('/Contact', function(req, res) {
    res.render('Contact');
})
app.get('/aboutUs', function(req, res) {
    res.render('aboutUs');
})

// top anime &  (news)upcoming anime
app.get('/', (req, res) => {
    let newsArray = [];
    let animeTop = [];
    let url = `https://api.jikan.moe/v3/top/anime`;
    let url2 = `https://api.jikan.moe/v3/season/later`;
    superagent.get(url2).then((news) => {
        news.body.anime.map((topList) => {
            let animeNews = new Genre(topList);
            newsArray.push(animeNews);
            return newsArray;
        });
        res.render('./home', { top: animeTop, news: newsArray });
    });
    superagent.get(url).then((topAnime) => {
        topAnime.body.top.map((topList) => {
            let TopAnimeData = new Top(topList);
            animeTop.push(TopAnimeData);
            return animeTop;
        });
    });
})

// search by title (anime & manga)
function animeSaver(req, res) {
    let animeSumarry = [];
    let mangaSumarry = [];
    let search_input = req.body.search;
    search_input = search_input.replace(/\s/g, '%20');
    let url = `https://kitsu.io/api/edge/anime?filter[text]=${search_input}`;
    let url2 = `https://kitsu.io/api/edge/manga?filter[text]=${search_input}`;
    superagent.get(url2).then((mangaSearch) => {
        mangaSearch.body.data.map((val) => {
            var mangaData = new Manga(val);
            mangaSumarry.push(mangaData);
        });
        return mangaSumarry;
    });
    superagent.get(url).then((dataOfAnime) => {
        dataOfAnime.body.data.map((val) => {
            var animeData = new Anime(val);
            animeSumarry.push(animeData);
            return animeSumarry;
        });
        res.render('./anime', { manga: mangaSumarry, animeSearch: animeSumarry });
    });
}


// get the detals for  anime and manga by title
function detailsRender(req, res) {
    let animeDetails = [];
    let mangaDetails = [];
    let input_search = req.body.search;
    let input_search2 = req.body.search2;
    let url = `https://kitsu.io/api/edge/anime/${input_search}`;
    let url2 = `https://kitsu.io/api/edge/manga/${input_search2}`;
    superagent.get(url2).then((managd) => {
        var animeData = new Manga(managd.body.data);
        mangaDetails.push(animeData);
        if (mangaDetails) {
            res.render('./details', { details2: mangaDetails, details: animeDetails });
        }
    })
    superagent.get(url).then((details) => {
        var animeData = new Anime(details.body.data);
        animeDetails.push(animeData);
        if (animeDetails) {
            res.render('./details', { details: animeDetails, details2: mangaDetails });
        }
    })
}

// details for anime by category :
function detailRender(req, res) {
    let genreSumarry = [];
    let search_input = req.body.search;
    let url = `https://api.jikan.moe/v3/anime/${search_input}`;

    superagent.get(url).then((animeSearch) => {
        let geneerData = new Genre2(animeSearch.body);
        genreSumarry.push(geneerData);
        res.render("./detail", { genreAnemi: genreSumarry });
    });

}

// search by genre 
function byGenre(req, res) {
    let genreSumarry = [];
    let search_input = req.body.search;
    console.log('fafafafafafa', req.body);
    let url = `https://api.jikan.moe/v3/genre/anime/${search_input}`;
    superagent.get(url).then((animeSearch) => {
        animeSearch.body.anime.map((theAnime) => {
            let geneerData = new Genre(theAnime);
            genreSumarry.push(geneerData);
        });
        res.render("./genre", { genreAnemi: genreSumarry });
    });
}


//add data to database
function addAnime(req, res) {
    let Anime = req.body.title;
    let sql = 'SELECT * FROM anime WHERE title = $1';
    const safeValue = [Anime];
    client.query(sql, safeValue).then((dataResult) => {
        if (dataResult.rowCount > 0) {
            //to check if the search_query is exist in the databaseor not
            res.render('./favAnime', { bookResults: dataResult.rows })
        } else {
            let {
                title,
                image,
                averageRating,
                startDate,
                endDate,
                gener_old,
                subtype,
                status,
                episodeCount,
                episodeLength,
                synopsis,
                youtubeVideoId
            } = req.body;
            let SQL = `INSERT INTO  anime (title,image,averageRating,startDate,endDate,gener_old,subtype,status,episodeCount,episodeLength,synopsis,youtubeVideoId) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12);`;
            let safeValues = [title, image, averageRating, startDate, endDate, gener_old, subtype, status, episodeCount, episodeLength, synopsis, youtubeVideoId];
            console.log(averageRating, 'sadasdasdals,dpassmsmdmdmsd')
            return client.query(SQL, safeValues)
                .then(() => {
                    res.redirect(`/`);
                })
        }
    })
}

// show the results
function getAnimeDetails(req, res) {
    let SQL = 'SELECT * FROM anime;'
    client.query(SQL)
        .then(results => {
            //   console.log('asdasdasdasdasdasdas', results.rows);
            res.render('./favAnime', { bookResults: results.rows });
        })
}

// remove data from database
function deletebook(req, res) {
    let SQL = "DELETE FROM anime WHERE id=$1;";
    let safeValue = [req.params.bookResults_id];
    client.query(SQL, safeValue)
        .then(res.redirect('/favAnime'));
}


// constucters
function Top(topRank) {
    this.rank = topRank.rank;
    this.title = topRank.title;
    this.image = topRank.image_url;
    this.episodeCount = topRank.episodes || topRank.volumes || 'sitll';
    this.subtype = topRank.type;
    this.averageRating = topRank.score;
    this.start_date = topRank.start_date;
    this.end_date = topRank.end_date || 'ongoing';
    this.title_Japan = topRank.ja_jp || 'not available';
    this.gener_old = topRank.ageRatingGuide || '+ 13';
    this.status = topRank.status || 'finished';
    this.episodeLength = topRank.episodeLength || '20 min per ep ';
    this.youtubeVideoId = topRank.youtubeVideoId || 'not available';
    this.synopsis = topRank.synopsis || 'not available';
    this.id = topRank.mal_id;
}

function Anime(data) {
    this.title = data.attributes.canonicalTitle;
    this.title_Japan = data.attributes.titles.ja_jp;
    this.averageRating = data.attributes.averageRating;
    this.startDate = data.attributes.startDate;
    this.endDate = data.attributes.endDate;
    this.image = data.attributes.posterImage.large;
    this.gener_old = data.attributes.ageRatingGuide || '+ 13';
    this.subtype = data.attributes.subtype;
    this.status = data.attributes.status;
    this.episodeCount = data.attributes.episodeCount;
    this.episodeLength = data.attributes.episodeLength;
    this.youtubeVideoId = data.attributes.youtubeVideoId;
    this.synopsis = data.attributes.synopsis;
    this.id = data.id;
}


function Manga(data) {
    this.title = data.attributes.canonicalTitle;
    this.title_Japan = data.attributes.titles.ja_jp;
    this.averageRating = data.attributes.averageRating || '6.5';
    this.datestartDate = data.attributes.startDate;
    this.endDate = data.attributes.endDate || 'ongoing';
    this.startDate = data.attributes.startDate;
    this.gener_old = data.attributes.ageRatingGuide || '+ 13';
    this.subtype = data.attributes.subtype;
    this.status = data.attributes.status || 'ongoing';
    this.ratingRank = data.attributes.ratingRank || '214';
    this.popularityRank = data.attributes.popularityRank;
    this.chapterCount = data.attributes.chapterCount;
    this.volumeCount = data.attributes.volumeCount;
    this.serialization = data.attributes.serialization;
    this.image = data.attributes.posterImage.large;
    this.image_thumbnail = data.attributes.posterImage.small;
    this.synopsis = data.attributes.synopsis;
    this.id = data.id;

}

function Genre(data) {
    this.title = data.title;
    this.image_url = data.image_url;
    this.synopsis = data.synopsis;
    this.airing_start = data.airing_start || 'COMING SOON';
    this.type = data.type;
    this.source = data.source;
    this.episodes = data.episodes || 'Unknown';
    this.score = data.score;
    this.producers = data.producers;
    this.genres = data.genres;
    this.id = data.mal_id;
}

function Genre2(data) {
    this.title = data.title;
    this.title_Japan = data.title_japanese;
    this.image = data.image_url;
    this.synopsis = data.synopsis;
    this.airing_start = data.airing_start || 'COMING SOON';
    this.subtype = data.type;
    this.source = data.source;
    this.episodeCount = data.episodes || 'Unknown';
    this.averageRating = data.score;
    this.producers = data.producers;
    this.id = data.mal_id;
    this.startDate = data.aired.from;
    this.endDate = data.aired.to;
    this.episodeLength = data.duration;
    this.studioName = data.studios;
    this.youtubeVideoId = data.trailer_url;
    this.gener_old = data.rating || '+13';
    this.status = data.status;
    this.genres = data.genres;
}

// mailchimp for contact us and newsletter
app.post('/', (req, res) => {
    var email = req.body.email;
    var data = {
        "members": [{
            email_address: email,
            status: 'subscribed',
        }],
    }
    var JSONdata = JSON.stringify(data);
    var options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/5baa312099',
        method: 'POST',
        headers: {
            "Authorization": "alaa c2022d468ec18180c4be2692c07ad7e9-us19"
        },
        body: JSONdata
    }
    request(options, (error, response, body) => {})

})

app.post('/contact', (req, res) => {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var Phone = req.body.phone;
    var msg = req.body.message;
    var data = {
        "members": [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
                PHONE: Phone,
                MMERGE5: msg
            }
        }],
    }
    var JSONdata = JSON.stringify(data);
    var options = {
        url: 'https://us19.api.mailchimp.com/3.0/lists/5baa312099',
        method: 'POST',
        headers: {
            "Authorization": "alaa c2022d468ec18180c4be2692c07ad7e9-us19"
        },
        body: JSONdata
    }
    request(options, (error, response, body) => {
        console.log("message has been sent");
    });
    res.render('Contact');
})


// connect the sever to the database
client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on PORT ${PORT} `)
        })
    })