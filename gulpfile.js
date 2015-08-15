var gulp = require('gulp');

var Builder = require('systemjs-builder');
var del = require('del');
var runSequence = require('run-sequence');

var APP_BASE = '/';

var PATH = {
    dest: {
        all: 'dist',
        dev: {
            all: 'dist/dev',
            lib: 'dist/dev/lib'
        }
    },
    src: {
        // Order is quite important here for the HTML tag injection.
        lib: [
            './node_modules/es6-module-loader/dist/es6-module-loader-dev.src.js',
            './node_modules/es6-module-loader/dist/es6-module-loader-dev.js.map',
            './node_modules/reflect-metadata/Reflect.js',
            './node_modules/reflect-metadata/Reflect.js.map',
            './node_modules/systemjs/dist/system.src.js',
            './node_modules/babel-core/browser.js'
        ]
    }
};

gulp.task('clean.dev', function (done) {
    del(PATH.dest.dev.all, done);
});

gulp.task('build.lib.dev', [], function () {
    return gulp.src(PATH.src.lib)
        .pipe(gulp.dest(PATH.dest.dev.lib));
});

gulp.task('build.dev', function (done) {
    runSequence('clean.dev', 'build.lib.dev', done);
});
