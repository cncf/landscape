module.exports = function(api) {
    api.cache(false);
    return (
        {
            "presets": [["latest-node", { "target": "current" }]],
            "plugins": []
        }
    );
}
