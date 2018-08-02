# pack-to-zip
> Transform the tgz archive from the npm pack command line to a zip without package folder

## Use case
- Create the Source Bundle for Elastic beanstalk
- Remove the annoying package root folder in tgz (from the npm pack command)


## Install

```
$ npm install pack-to-zip
```

## Usage

### CLI
In your package scripts or with npx.

```
$ pack-to-zip
```

### Programmatically
why not

```js
const packToZip = require('pack-to-zip');

packToZip();
```


## Related

- [npm-pack](https://docs.npmjs.com/cli/pack) - Create a tarball from a package
- [pkg-dir](https://github.com/sindresorhus/pkg-up) - Find the root directory of a Node.js project or npm package
- [node-archiver](https://github.com/archiverjs/node-archiver) - A streaming interface for archive generation
- [decompress](https://github.com/kevva/decompress) - Extracting archives made easy

## License

MIT © [53JS](https://53js.fr)
