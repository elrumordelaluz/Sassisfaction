var React = require('react');
var Search = require('./views/search.jsx')

React.render(
    <Search jsonURL='sassisfaction.json' />, document.querySelector('#items')
);
