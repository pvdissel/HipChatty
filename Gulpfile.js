/* jshint node: true */
'use strict';

var NwBuilder = require('nw-builder');
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');

var manifest = require('./package.json');

gulp.task('package', function () {
    var nw = new NwBuilder({
        version: manifest.nwjsVersion,
        files: './nwapp/**',
        macIcns: './icons/icon.icns',
        macPlist: {mac_bundle_id: 'myPkg'},
        platforms: [
            'win32', 'win64',
            'osx32', 'osx64',
            'linux32', 'linux64'
        ]
    });

    // Log stuff you want
    nw.on('log', function (msg) {
        gutil.log('nw-builder', msg);
    });

    // Build returns a promise, return it so the task isn't called in parallel
    return nw.build().catch(function (err) {
        gutil.log('nw-builder', err);
    });
});

gulp.task('run', function (done) {
    var builder = new NwBuilder({
        version: manifest.nwjsVersion,
        files: path.join(SOURCE_DIR, '**')
    });

    builder.on('log', gutil.log.bind(gutil, 'nw-builder:'));
    builder.run().nodeify(done);
});

gulp.task('clean:package', function () {
    return del([
        'build',
        // here we use a globbing pattern to match everything inside the `mobile` folder
        'dist/mobile/**/*',
        // we don't want to clean this file though so we negate the pattern
        '!dist/mobile/deploy.json'
    ]);
});

gulp.task('clean:all', function () {
    return del([
        'cache',
        '**/node_modules'
    ]);
});

gulp.task('clean', ['clean:package']);

gulp.task('default', ['run']);
