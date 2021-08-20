({
    post: ({ name }) => name,

    get: ({ a }: { a: number }) => a + 2,
});
