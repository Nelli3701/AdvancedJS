'use strict';
const musicCollection = [
    {title: "Album1", artist: "Name1", year: "2000"},
    {title: "Album2", artist: "Name2", year: "2005"},
    {title: "Album3", artist: "Name3", year: "2010"}
];

musicCollection[Symbol.iterator] = function() {
    return {
        current: 0,
        to: this.length,
        next() {
            return this.current < this.to
            ? {done: false, value: musicCollection[this.current++]}
            : {done: true};
        }
    }
}

for (let album of musicCollection) {
    console.log(`Title: ${album.title}, Artist: ${album.artist}`);
}