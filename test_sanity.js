const https = require('https');

const query = encodeURIComponent('*[_type == "project"] { title, contentBlocks[] { slots[] { _type, beforeImage{asset->{url, metadata{dimensions}}}, afterImage{asset->{url, metadata{dimensions}}} } } }');
const url = 'https://7atwvbxn.api.sanity.io/v2023-08-01/data/query/production?query=' + query;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const json = JSON.parse(data);
    for (const p of json.result) {
      if (!p.contentBlocks) continue;
      for (const block of p.contentBlocks) {
        if (!block.slots) continue;
        for (const slot of block.slots) {
          if (slot._type === 'beforeAfterSlot') {
            console.log("Project:", p.title);
            console.log("Before Image Dimensions:", slot.beforeImage?.asset?.metadata?.dimensions);
            console.log("After Image Dimensions:", slot.afterImage?.asset?.metadata?.dimensions);
          }
        }
      }
    }
  });
});
