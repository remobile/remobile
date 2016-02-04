var babelify = require('babelify');
var brfs = require('brfs');
var browserify = require('browserify');
var chalk = require('chalk');
var del = require('del');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var gutil = require('gulp-util');
var less = require('gulp-less');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var shell = require('gulp-shell');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var libPath = '../src/';
var destPath = './server/www/';
//var releasePath = '../appfog/remobile/www/';
var releasePath = '../tools/www/';
var appPath = './';
var appFile = 'app.js';

function doBundle(target, name, dest) {
    return target.bundle()
    .on('error', function(e) {
        gutil.log('Browserify Error', e.message);
    })
    .pipe(source(name))
    .pipe(gulp.dest(dest));
}

function watchBundle(target, name, dest) {
    return watchify(target).on('update', function (scriptIds) {
        scriptIds = scriptIds
        .filter(function(i) { return i.substr(0,2) !== './' })
        .map(function(i) { return chalk.blue(i.replace(__dirname, '')) });
        if (scriptIds.length > 1) {
            gutil.log(scriptIds.length + ' Scripts updated:\n* ' + scriptIds.join('\n* ') + '\nrebuilding...');
        } else {
            gutil.log(scriptIds[0] + ' updated, rebuilding...');
        }
        doBundle(target, name, dest);
    })
    .on('time', function (time) {
        gutil.log(chalk.green(name + ' built in ' + (Math.round(time / 10) / 100) + 's'));
    });
}
function buildApp(watch, debug) {
    var opts = watch ? {cache: {}, packageCache: {}, debug:false} : {};
    var dest = destPath+'js';

    var appBundle = browserify(opts)
    .add(appPath+appFile)
    .transform(babelify)
    .transform(brfs);

    var reactBundle = browserify();
    ['react','react/addons'].forEach(function(pkg) {
        appBundle.exclude(pkg);
        reactBundle.require(pkg);
    });

    if (watch) {
        watchBundle(appBundle, appFile, dest);
    }
    return merge(
        doBundle(reactBundle, 'react.js', dest),
        doBundle(appBundle, appFile, dest)
    );
}
gulp.task('server', function() {
    require('./server/app');
});
gulp.task('framework7', function() {
    var path = libPath+'js/framework7/dom7/';
    return gulp.src([
        path+'dom7-intro.js',
        path+'dom7-methods.js',
        path+'dom7-ajax.js',
        path+'dom7-utils.js',
        path+'dom7-plugins.js',
        path+'dom7-outro.js'
    ])
    .pipe(concat('framework7.js'))
    .pipe(gulp.dest(destPath+'js'));
});
gulp.task('html', function() {
    return gulp.src(appPath+'index.html')
    .pipe(gulp.dest(destPath));
});
gulp.task('thirdparty', function() {
    var path = appPath+'thirdparty/';
    return gulp.src([
        path+'desktopTouch/desktopTouch.js',
    ])
    .pipe(concat('thirdparty.js'))
    .pipe(gulp.dest(destPath+'js'));
});
gulp.task('less', function() {
    var path = libPath+'less/';
    return gulp.src(path+'material.less')
    .pipe(less())
    .pipe(rename('app.css'))
    .pipe(gulp.dest(destPath+'css'));
});
gulp.task('democss', function() {
    var path = appPath+'css/';
    return gulp.src([
        path+'demo.css',
    ])
    .pipe(concat('demo.css'))
    .pipe(gulp.dest(destPath+'css'));
});
gulp.task('img', function() {
    var path = libPath+'img/**/';
    return gulp.src([path+'*.png', path+'*.svg', path+'*.jpg'])
    .pipe(gulp.dest(destPath+'img/f7'));
});
gulp.task('appimg', function() {
    var path = appPath+'img/**/';
    return gulp.src([path+'*.png', path+'*.jpg'])
    .pipe(gulp.dest(destPath+'img/app'));
});
gulp.task('images', ['img', 'appimg']);
gulp.task('data', function() {
    return gulp.src(appPath+'data/**')
    .pipe(gulp.dest(destPath+'data'));
});
gulp.task('fonts', function() {
    return gulp.src(libPath+'fonts/**')
    .pipe(gulp.dest(destPath+'fonts'));
});
gulp.task('app', function() {
    return buildApp();
});
gulp.task('watch-app', function() {
    return buildApp(true);
});
gulp.task('concat', function() {
});
gulp.task('watch', ['framework7', 'html', 'images', 'fonts', 'less', 'thirdparty', 'democss', 'watch-app', 'data'], function() {
    gulp.watch([appPath+'index.html'], ['html']);
    gulp.watch([libPath+'less/**/*.less'], ['less']);
    gulp.watch([appPath+'css/**/*.css'], ['democss']);
});
gulp.task('release', ['framework7', 'html', 'images', 'fonts', 'less', 'thirdparty', 'democss', 'app'], function() {
    var path = destPath+'js/';
    gulp.src([
        path+'framework7.js',
        // path+'thirdparty.js',
        path+'react.js',
        path+'app.js'
    ])
    .pipe(concat('remobile.js'))
    .pipe(uglify({compress: {drop_console: true}}))
    .pipe(gulp.dest(releasePath+'js'));

    path = destPath+'css/';
    gulp.src([path+'*.css'])
    .pipe(concat('remobile.css'))
    .pipe(minifyCSS({advanced: false, aggressiveMerging: false}))
    .pipe(gulp.dest(releasePath+'css'));

    path = destPath+'img/**/';
    gulp.src([path+'*.png', path+'*.jpg', path+'*.svg'])
    .pipe(gulp.dest(releasePath+'img'));

    gulp.src(libPath+'fonts/**')
    .pipe(gulp.dest(releasePath+'fonts'));

    gulp.src(destPath+'index.html')
    .pipe(concat('main.html'))
    .pipe(replace(/<link rel="stylesheet"[\s\S]*demo.css" \/>/, '<link rel="stylesheet" type="text/css" href="css/remobile.css" />'))
    .pipe(replace(/<script[\s\S]*script>/, '<script type="text/javascript" src="js/remobile.js"></script>'))
    .pipe(gulp.dest(releasePath));

    path = appPath+'platforms/web/phone/';
    gulp.src(path+'index.html')
    .pipe(gulp.dest(releasePath));

    gulp.src(path+'*.png')
    .pipe(gulp.dest(releasePath+"/img"));
});
gulp.task('run', ['watch', 'server']);
gulp.task('clean', function() {
    del([destPath]);
});
