var gulp = require('gulp');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');

function sequenceComplete(done) {
    return function (err) {
        if (err) {
            var error = new Error('build sequence failed');
            error.showStack = false;
            done(error);
        } else {
            done();
        }
    };
}


// public task to build tools
gulp.task('build', [], function(done) {
    runSequence(['!build-es6'], sequenceComplete(done));
});


gulp.task('bundle', [], function (cb) {
    var Builder = require('systemjs-builder');
    var builder = new Builder();
    builder.loadConfig('./config.js')
        .then(function() {
            builder.buildSFX('src/ngtt', 'dist/es5/es5.js', { sourceMaps: true, config: {sourceRoot: 'dist/es5'} })
        })
        .then(function() {
            return cb();
        })
        .catch(function(ex) {
            cb(new Error(ex));
        });
});

gulp.task('!build-es5', function() {
    var stream = gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsc({
            allowNonTsExtensions: false,
            declaration: false,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            mapRoot: '',  // force sourcemaps to use relative path
            noEmitOnError: false,
            rootDir: '.',
            target: 'ES5',
            module: 'commonjs',
            typescript: require('typescript')
        }))
        .on('error', function(error) {
            // nodejs doesn't propagate errors from the src stream into the final stream so we are
            // forwarding the error into the final stream
            stream.emit('error', error);
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/es5'))
        .on('end', function() {
            //var AngularBuilder = require('./dist/tools/broccoli/angular_builder').AngularBuilder;
            //angularBuilder = new AngularBuilder({
            //    outputPath: 'dist',
            //    dartSDK: DART_SDK,
            //    logs: logs
            //});
        });

    return stream;
});


gulp.task('!build-es6', function() {
    var stream = gulp.src(['src/**/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsc({
            allowNonTsExtensions: false,
            declaration: false,
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            mapRoot: '',  // force sourcemaps to use relative path
            noEmitOnError: false,
            rootDir: '.',
            target: 'ES6',
            typescript: require('typescript')
        }))
        .on('error', function(error) {
            // nodejs doesn't propagate errors from the src stream into the final stream so we are
            // forwarding the error into the final stream
            stream.emit('error', error);
        })
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/es6'))
        .on('end', function() {
            //var AngularBuilder = require('./dist/tools/broccoli/angular_builder').AngularBuilder;
            //angularBuilder = new AngularBuilder({
            //    outputPath: 'dist',
            //    dartSDK: DART_SDK,
            //    logs: logs
            //});
        });

    return stream;
});
