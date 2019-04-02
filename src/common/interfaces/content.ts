export interface Content {

    maximumSentences?: number,

    searchTerm?: string,

    prefix?: string

    sourceContentOriginal?: any;

    sourceContentSanitized?: string;

    sentences?: Array<Sentence>;

}

export interface Sentence {
    text: Array<string>;

    keywords: Array<string>;

    images: Array<string>;

    googleSearcQuery?: string;

}