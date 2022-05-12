export default ({ date, modified }) => (modified > date && modified) || date;
