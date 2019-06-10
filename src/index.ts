import * as state from './robots/state';
import { input } from './robots/input';
import { text } from './robots/text';

import { image } from './robots/image';

async function start() {

    input();
    await text();
    await image();

    const content = state.load();

    console.dir(content, { depth: null });
}

start();
