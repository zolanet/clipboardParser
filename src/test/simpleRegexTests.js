const text = `test/bla/bla/bla/c.4.4.100-something.json | 2 ++
test/bla/bla/bla/c.3.4.150-oneFifty.json | 4 ++--
`;

const re = new RegExp("\\w\\.\\d.+\\.json", "g");
const matches = text.match(re);
matches.forEach(item => console.log(item));
