function existBetween(arr, start, end) {
  let startRow = parseInt(start.row);
  let endRow = parseInt(end.row);
  let endCol = parseInt(end.col);

  for (let i = 0; i < arr.length; i++) {
    let parentRow = parseInt(arr[i].parent_id.split("-")[0]);
    let parentCol = parseInt(arr[i].parent_id.split("-")[1]);

    if (parentRow > startRow && parentRow < endRow && parentCol === endCol) {
      return true;
    }
  }
  return false;
}

function testHex(hex) {
  let regex = /^#([0-9a-f]{3}){1,2}$/i;
  return regex.test(hex);
}

export { existBetween, testHex };
