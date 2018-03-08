export function removeNonReferencedImages(imageEntries) {
  const existingFiles = fs.readdirSync('./cached_logos');
  const allowedFiles = imageEntries.filter( (e) => !!e).map( (e) => e.fileName );
  _.each(existingFiles, function(existingFile) {
    if (allowedFiles.indexOf(existingFile) === -1){
      fs.unlinkSync('./hosted_logos/' + existingFile);
    }
  })
}
