const entityDate = ({ date, modified }) => (modified > date && modified) || date;

export default entityDate;
