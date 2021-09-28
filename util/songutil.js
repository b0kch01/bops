module.exports = {
    shortenQueueTitle: function (title) {
        return title
            .replaceAll("(Official)", "")
            .replaceAll("(Official Video)", "")
            .replaceAll("(Official Music Video)", "")
            .replaceAll("(Official Audio)", "")
            .replaceAll("[Official Video]", "")
            .replaceAll("[Official Music Video]", "")
            .replaceAll("(Official Lyrics Video)", "")
            .replaceAll("(Official Lyrics)", "")
            .replaceAll("(Lyrics)", "")
            .replaceAll("(Audio)", "");
    },
    fixLyrics: function (lyrics) {
        return lyrics
            .replaceAll("[", "**")
            .replaceAll("]", "**");
    }
};