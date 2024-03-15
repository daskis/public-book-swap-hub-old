
const path = require('path');
const fs = require('fs');
const xmldoc = require('xmldoc');
const Hyphen = require('hyphen');
const JSZip = require('jszip');

class FB2HTML {
    constructor(data, options) {

        options = Object.assign({
            hyphenate: false
        }, options);

        if (data) {
            this.fictionBook = new xmldoc.XmlDocument(data);
        }
        if (options.hyphenate) {
            try {
                const lang = this.getLanguage().toLowerCase();
                this.hyphenate = new Hyphen(require(`hyphen/patterns/${lang}`));
            } catch(e) {}
        }
    }

    static read(filePath, options) {

        if (path.extname(filePath) === '.zip') {
            return FB2HTML.readZip(filePath, options)
        }
        else {
            return FB2HTML.readFile(filePath, options);
        }

    }

    static readFile(filePath, options) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) reject(err);
                else resolve(new FB2HTML(data, options));
            })
        })
    }

    static readZip(filePath, options) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) reject(err);

                JSZip.loadAsync(data)
                    .then((zip) => {
                        let files = zip.filter((relativePath) =>
                            path.extname(relativePath) === '.fb2'
                        )
                        if (files && files.length) {
                            return zip.file(files[0].name).async('text');
                        }
                        throw new Error('Zip archive does not contains .fb2 files');
                    })
                    .then((data) => {
                        resolve(new FB2HTML(data, options));
                    })
            })
        })
    }

    format() {
        const book = {
            title: this.getTitle(),
            author: this.getAuthors(),
            translator: this.getTranslators(),
            genre: this.getGenres(),
            annotation: this.getAnnotation(),
            keywords: this.getKeywords(),
            cover: this.getCover(),
            body: this.getBody()
        }

        return `
            <img src="${book.cover}"></img>
            <h1>${book.title}</h1>
            <h2>Author: ${book.author}</h2>
            <h2>Translator: ${book.translator}</h2>
            <h3>Genre: ${book.genre}</h3>
            <h3>Keywords: ${book.keywords}</h3>

            <div>${book.annotation}</div>
            <div>${book.body}</div>
        `;
    }

    getTitle() {
        const element = this.fictionBook
            .descendantWithPath('description.title-info.book-title');

        return element.val;
    }

    getAuthors() {
        const element = this.fictionBook
            .descendantWithPath('description.title-info');

        if (!element) return;

        const authors = element.childrenNamed('author');

        return this.__person(authors);
    }

    getTranslators() {
        const element = this.fictionBook
            .descendantWithPath('description.title-info');

        if (!element) return;

        const translators = element.childrenNamed('translator');

        return this.__person(translators);
    }

    getGenres() {
        const genres = this.fictionBook
            .descendantWithPath('description.title-info')
            .childrenNamed('genre')

        return genres
            .map(genre => genre.val)
            .join(', ');
    }

    getAnnotation() {
        const anotation = this.fictionBook
            .descendantWithPath('description.title-info.annotation');

        if (!anotation) return;

        return this.__content(anotation.children);
    }

    getKeywords() {
        const keywords = this.fictionBook
            .descendantWithPath('description.title-info.keywords');

        if (!keywords) return;

        return this.__content(keywords.children);
    }

    getDate() {
        const date = this.fictionBook
            .descendantWithPath('description.title-info.date');

        if (!date) return;

        return date.attr['value'] || this.__content(data.children);
    }

    getLanguage() {
        const element = this.fictionBook
            .descendantWithPath('description.title-info.lang');
        return element.val;
    }

    getCover() {
        const element = this.fictionBook
            .descendantWithPath('description.title-info.coverpage');

        if (!element) return;

        const image = element.childNamed('image');

        if (!image) return;


        return this.__image(image.attr['l:href']);
    }

    getBody() {
        const bodies = this.fictionBook.childrenNamed('body')

        return this.__content(bodies);
    }

    __image(href) {
        if (href.charAt(0) === '#') {
            const id = href.substr(1);

            const binaries = this.fictionBook.childrenNamed('binary')
            const binary = binaries.find(binary => binary.attr['id'] === id);

            if (binary) {
                return `data:${binary.attr['content-type']};base64,${binary.val}`;
            }
        }

        return href;
    }

    __find(node, id) {
        if (node.type === 'element') {
            if (node.attr['id'] === id) {
                return node;
            }
        }

        if (Array.isArray(node)) {
            for (let n of node) {
                const child = this.__find(n, id);
                if (child) return child;
            }
        }

        if (node.children) {
            return this.__find(node.children, id);
        }

        return null;
    }

    __text(href) {
        if (href.charAt(0) === '#') {
            const id = href.substr(1);

            const node = this.__find(this.fictionBook, id);

            if (node) {
                return this.__note(node);
            }
        }

        return ''
    }

    __note(node) {
        if (node.type === 'text') {
            return node.text;
        }

        if (node.type === 'element') {
            return this.__note(node.children);
        }

        if (Array.isArray(node)) {
            return node.map(n => this.__note(n)).join('')
        }

        return '';
    }

    __attributes(node) {
        if (node && node.attr) {
            return Object.keys(node.attr)
                .filter(k => node.attr[k])
                .map(k => {
                    switch (k) {
                        case 'l:href':
                            return `href="${node.attr[k]}"`;
                        case 'id':
                            return `${k}="${node.attr[k]}"`;
                        default:
                            return `data-${k}="${node.attr[k]}"`;
                    }
                })
                .join(' ');
        }

        return '';
    }

    __content(node, tmpl) {
        if (typeof node === 'string') {
            return tmpl
                ? tmpl.replace('%DATA%', this.__content(node))
                : this.hyphenate ? this.hyphenate(node) : node;
        }

        if (Array.isArray(node)) {
            const collection = node.map(item => this.__content(item, tmpl)).join('');
            return tmpl
                ? tmpl.replace('%DATA%', collection)
                : collection;
        }

        if (node.type === 'text') {
            return this.__content(node.text);
        }

        if (node.type === 'element') {
            switch (node.name) {
                case 'p':
                    return this.__content(node.children, '<p>%DATA%</p>')
                case 'strong':
                    return this.__content(node.children, '<b>%DATA%</b>')
                case 'emphasis':
                    return this.__content(node.children, '<i>%DATA%</i>')
                case 'epigraph':
                    return this.__content(node.children, '<blockquote>%DATA%</blockquote>')
                case 'cite':
                case 'text-author':
                    return this.__content(node.children, '<cite>%DATA%</cite>')
                case 'image':
                    return this.__content(`<img src="${this.__image(node.attr['l:href'])}" />`)
                case 'title':
                    return this.__content(node.children, '<h3>%DATA%</h3>')
                case 'subtitle':
                    return this.__content(node.children, '<h4>%DATA%</h4>')
                case 'a':
                    return this.__content(node.children, `<a ${this.__attributes(node)} title="${this.__text(node.attr['l:href'])}">%DATA%</a>`);
                case 'section':
                    return this.__content(node.children, `<div ${this.__attributes(node)}>%DATA%</div>`)
                case 'empty-line':
                    return this.__content(node.children, '<br />')

                default:
                    return this.__content(node.children, tmpl);
            }
        }
    }

    __person(elements) {
        return elements.map(author => {
            const firstName = author.childNamed('first-name');
            const middleName = author.childNamed('middle-name');
            const lastName = author.childNamed('last-name');
            const nickname = author.childNamed('nickname');
            const email = author.childNamed('email');

            return [
                firstName && firstName.val,
                middleName && middleName.val,
                lastName && lastName.val,
                nickname && nickname.val,
                email && email.val
            ]
                .filter(a => a != null)
                .join(' ')
        }).join(', ')
    }
}

module.exports = FB2HTML;