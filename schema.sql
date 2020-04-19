
DROP TABLE IF EXISTS anime;

CREATE TABLE anime (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    image VARCHAR(255),
    averageRating VARCHAR(255),
    startDate VARCHAR(255),
    endDate  VARCHAR(255),
gener_old  VARCHAR(255),
subtype  VARCHAR(255),
status  VARCHAR(255),
episodeCount VARCHAR(255),
episodeLength VARCHAR(255),
synopsis TEXT,
youtubeVideoId VARCHAR(255)
);
