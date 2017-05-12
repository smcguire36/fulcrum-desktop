import assert from 'assert';
import through2 from 'through2';
import fs from 'fs';
import DelimitStream from 'delimit-stream';

export function sequenceSplitter() {
  return new DelimitStream('\x1e', {objectMode: true});
}

export function jsonSequenceStream({onObject, onInvalid, onTruncated} = {}) {
  return through2.obj(function(chunk, encoding, completion) {
    assert.ok(chunk.length > 0);

    // if the entry doesn't end with \n, it got truncated
    if (chunk[chunk.length - 1] !== 0x0a) {
      this.push({truncated: chunk});

      if (onTruncated) {
        onTruncated(chunk, completion);
      } else {
        completion();
      }
    } else {
      try {
        const json = JSON.parse(chunk.toString());

        this.push({json: json});

        if (onObject) {
          onObject(json, completion);
        } else {
          completion();
        }
      } catch (error) {
        this.push({invalid: chunk});

        if (onInvalid) {
          onInvalid(chunk, completion);
        } else {
          completion();
        }
      }
    }
  });
}

export function parseFile(filePath, {onObject, onInvalid, onTruncated}) {
  return fs.createReadStream(filePath)
           .pipe(sequenceSplitter())
           .pipe(jsonSequenceStream({onObject, onInvalid, onTruncated}))
           .on('data', () => {});
}
