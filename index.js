/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console  */
const archiver = require('archiver');
const decompress = require('decompress');
const del = require('del');
const fs = require('fs');
const path = require('path');
const pkgDir = require('pkg-dir');
const util = require('util');

const exec = util.promisify(require('child_process').execFile);


let rootDir;
let tmpFolder;
let tgzName;
let zipName;

// get correct path thanks to pkgDir
// pkg = the package in root folder
// tgzname the tgz name generated by npm pack
// zipname the zip we need
// tmpFolder a temporary folder for extracting the tgz (will be removed at the end)
const setPaths = async () => {
	rootDir = await pkgDir(process.cwd());

	const pkg = require(`${rootDir}/package.json`);

	/* Get the name of the npm pack file */
	const name = pkg.name.replace('@', '').replace('/', '-');
	const { version } = pkg;

	tgzName = `${name}-${version}.tgz`;
	zipName = `${name}-${version}.zip`;
	tmpFolder = path.join(rootDir, `.${name}-${version}`);
};


// run npm pack command
async function pack() {
	const { stdout } = await exec('npm', ['pack'], { stdio: 'inherit' });
	//console.log(stdout);
}

const createArchiveZip = () =>
	new Promise((resolve, reject) => {
		const output = fs.createWriteStream(path.join(rootDir, zipName));
		const archive = archiver('zip', {
			zlib: {
				level: 9,
			},
		});

		output.on('close', () => {
			console.log(`${archive.pointer()} total bytes`);
			console.log(zipName + ' archive has been finalized and the output file descriptor has closed.');
			resolve();
		});
		/*
		output.on('end', () => {
			console.log('Data has been drained');
		});
		*/
		archive.on('warning', (err) => {
			if (err.code === 'ENOENT') {
				// log warning
			} else {
				reject(err);
				throw err;
			}
		});
		archive.on('error', (err) => {
			reject(err);
			throw err;
		});
		archive.pipe(output);
		archive.directory(path.join(tmpFolder, 'package'), false);
		archive.finalize();
	});

const main = async () => {
	try {
		await setPaths();
		await pack();
		if (!fs.existsSync(tgzName)) {
			throw new Error('something goes wrong with the command npm pack');
		}
		await decompress(tgzName, tmpFolder);
		await createArchiveZip();
		await del([tmpFolder, tgzName]);
	} catch (err) {
		console.log(err);
	}
};


module.exports = main;
