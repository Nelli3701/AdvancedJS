'use strict';
class Library {
    #books = [];
    constructor(books) {
        if (new Set(books).size !== books.length) throw new Error('Дубликаты не разрешены');
        this.#books = books;
    }
    get books() {
        return this.#books;
    }
    set books(books) {
        this.#books = books;
    }
    allBooks() {
        return this.#books;
    }
    addBook(title) {
        if (this.#books.includes(title)) {
            throw new Error('Книга с таким названием уже существует');
        }
        this.#books.push(title);
    }
    removeBook(title) {
        if (!this.#books.includes(title)) {
            throw new Error('Книги с таким названием не существует');
        }
        this.#books.splice(this.#books.indexOf(title), 1);
    }
    hasBook(title) {
        return this.#books.includes(title);
    }
}

const books = ["Стихи Агнии Барто", "Ревизор", "Айболит"];
const library = new Library(books);
console.log(library.allBooks());
library.addBook("Мойдодыр");
console.log(library.allBooks());
library.removeBook("Ревизор");

console.log(library.allBooks());
console.log(`Книга "Гарри Поттер" ${library.hasBook("Гарри Поттер") ? "имеется" : "отсутствует"} `);