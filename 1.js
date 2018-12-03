require('@babel/register')({
    ignore: [function (filename) {
        var ignore = false
        if (filename.match('/node_modules/') && !filename.match(/interactive-landscape/)) {
            ignore = true;
        }
        return ignore
    }]
})
