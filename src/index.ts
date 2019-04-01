import * as state from './robots/state';
import { input } from './robots/input';
import { text } from './robots/text';

async function start() {

    input();
    await text();

    const content = state.load();

    console.dir(content, { depth: null });

}

start();
