import * as state from './state';
import * as g from 'googleapis';

import * as googleSearchCredentials from '../credentials/google-search.json';
import { Content } from '../common/interfaces/content';

const customSearch = g.google.customsearch('v1');

const SEARCH_TYPE: string = 'image';

export async function image() {

    const content = state.load();

    await fetcImageOfAllSentences(content);

    state.save(content);

    process.exit(0);

    async function fetcImageOfAllSentences(content) {
        for (const sentence of content.sentences) {

            console.log(sentence);
            const query: string =
                `${content.searchTerm} ${sentence.keywords[0]}`;

            sentence.images = await fetcGoogleAndReturnImageLinks(query);

            sentence.googleSearcQuery = query;

        }
    }

    async function fetcGoogleAndReturnImageLinks(query: string) {

        const response: any =
            await customSearch.cse.list({
                auth: googleSearchCredentials.apiKey,
                cx: googleSearchCredentials.searchEngineId,
                q: query,
                searchType: SEARCH_TYPE,
                num: 2
            });

        const imagesUrls: Array<string> =
            response.data.items.map(i => i.link);

        return imagesUrls;
    }

}