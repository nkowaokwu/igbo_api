const POPULATE_PHRASE = {
    path: 'phrases',
    populate: {
        path: 'examples',
        model: 'Example',
    }
};

const POPULATE_EXAMPLE = {
    path: 'examples',
};

const POPULATE_PARENT_WORD = {
    path: 'parentWord',
};

export {
    POPULATE_PHRASE,
    POPULATE_EXAMPLE,
    POPULATE_PARENT_WORD
};