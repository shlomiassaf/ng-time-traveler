var del = require('del');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var tsc = require('gulp-typescript');
var uglify = require('gulp-uglifyjs');
var concat = require('gulp-concat');

var config = {
    es6Src: ['src/**/*.ts'],
    es6Dest: './dist/es6',
    es5Dest: './dist/es5'
};

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


gulp.task('build', [], function(done) {
    runSequence('!build-es6', '!build-es5', sequenceComplete(done));
});


gulp.task('!build-clean-es6', function(done) {
    return del(config.es6Dest, done);
});

gulp.task('!build-clean-es5', function(done) {
    return del(config.es5Dest, done);
});


gulp.task('!build-es5', ['!build-clean-es5'], function(done) {
    runSequence(['!transpile-es5', '!transpile-es5-runtime'], '!transpile-es5-sfx', '!build-uglify-es5', sequenceComplete(done));
});

gulp.task('!transpile-es5', function() {
    return build_es5(config.es6Dest + '/ngtt_es5', config.es5Dest + '/ngtt.js' ,{ runtime: false , sourceMaps: true });
});

gulp.task('!transpile-es5-runtime', function() {
    return build_es5(config.es6Dest + '/ngtt_es5', config.es5Dest + '/ngtt.runtime.js', {sourceMaps: true});
});

gulp.task('!transpile-es5-sfx', function() {
    return gulp.src(['./node_modules/reflect-metadata/Reflect.js', config.es5Dest + '/ngtt.runtime.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('ngtt.sfx.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.es5Dest));
});

gulp.task('!build-uglify-es5', function() {
    gulp.src(config.es5Dest + '/ngtt.js')
        .pipe(uglify('ngtt.min.js'))
        .pipe(gulp.dest(config.es5Dest));

    gulp.src(config.es5Dest + '/ngtt.runtime.js')
        .pipe(uglify('ngtt.runtime.min.js'))
        .pipe(gulp.dest(config.es5Dest))

    gulp.src(config.es5Dest + '/ngtt.sfx.js')
        .pipe(uglify('ngtt.sfx.min.js'))
        .pipe(gulp.dest(config.es5Dest))
});

gulp.task('!build-es6', ['!build-clean-es6'], function() {
    var stream = gulp.src(config.es6Src)
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
        .pipe(gulp.dest(config.es6Dest))
        .on('end', function() {

        });

    return stream;
});

function build_es5(src, dest, buildConfig) {
    var Builder = require('systemjs-builder');
    var builder = new Builder();
    builder.config({
        paths: {
            "*": "./*.js"
        }
    });
    return builder.buildSFX(src, dest, buildConfig || {});
}
