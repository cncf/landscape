const result = {
  errors: {},
  warnings: {}
}
save();
export function addError(kind) {
  result.errors[kind] = result.errors[kind] || 0;
  result.errors[kind] += 1;
  save();
}
export function addWarning(kind) {
  result.warnings[kind] = result.warnings[kind] || 0;
  result.warnings[kind] += 1;
  save();
}

function save() {
  require('fs').writeFileSync('/tmp/landscape.json', JSON.stringify(result, null, 4));
}
