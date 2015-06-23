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
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var libPath = 'src/';
var destPath = './www/';
var releasePath = './dist/';
var appPath = './kitchen-sink/';
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
gulp.task('serve', function() {
    var express = require('express');
    var app = express();

    app.use(express.static('./www'));
    try {
        require('./src/js/route/proxy')(app);
    } catch(e) {}

    var server = app.listen(process.env.PORT || 8000, function() {
        console.log('Local Server ready on port %d', server.address().port);
    });
});
gulp.task('framework7', function() {
    var path = libPath+'thirdparty/framework7/';
    return gulp.src([
        path+'dom7-intro.js',
        path+'dom7-methods.js',
        path+'dom7-ajax.js',
        path+'dom7-utils.js',
        path+'dom7-outro.js'
    ])
    .pipe(concat('framework7.js'))
    .pipe(gulp.dest(destPath+'js'));
});
gulp.task('html', function() {
    return gulp.src(appPath+'index.html')
    .pipe(gulp.dest(destPath));
});
gulp.task('desktopTouch', function() {
    return gulp.src(appPath+'thirdparty/desktopTouch/desktopTouch.js')
    .pipe(gulp.dest(destPath+'js'));
});
gulp.task('less', function() {
    var path = libPath+'less/';
    return gulp.src(path+'app.less')
    .pipe(less())
    .pipe(gulp.dest(destPath+'css'));
});
gulp.task('democss', function() {
    var path = appPath+'css/';
    return gulp.src(path+'demo.css')
    .pipe(gulp.dest(destPath+'css'));
});
gulp.task('img', function() {
    var path = libPath+'img/**/';
    return gulp.src(path+'*.png')
    .pipe(gulp.dest(destPath+'img'));
});
gulp.task('demoimg', function() {
    var path = appPath+'img/**/';
    return gulp.src([path+'*.png', path+'*.jpg'])
    .pipe(gulp.dest(destPath+'img'));
});
gulp.task('images', ['img', 'demoimg']);
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**')
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
gulp.task('watch', ['framework7', 'html', 'images', 'fonts', 'less', 'desktopTouch', 'democss', 'watch-app'], function() {
    gulp.watch([appPath+'index.html'], ['html']);
    gulp.watch([libPath+'less/**/*.less'], ['less']);
    gulp.watch([appPath+'css/**/*.css'], ['democss']);
});
gulp.task('release', ['framework7', 'html', 'images', 'fonts', 'less', 'desktopTouch', 'democss', 'app'], function() {
    var path = destPath+'js/';
    gulp.src([
        path+'framework7.js',
        path+'desktopTouch.js',
        path+'react.js',
        path+'app.js'
    ])
    .pipe(concat('remobile.js'))
    .pipe(uglify({compress: {drop_console: true}}))
    .pipe(gulp.dest(releasePath+'js'));

    path = destPath+'css/';
    gulp.src([
        path+'app.css',
        path+'demo.css'
    ])
    .pipe(concat('remobile.css'))
    .pipe(minifyCSS({advanced: false, aggressiveMerging: false}))
    .pipe(gulp.dest(releasePath+'css'));

    path = destPath+'img/**/';
    gulp.src([path+'*.png', path+'*.jpg'])
    .pipe(gulp.dest(releasePath+'img'));

    path = destPath+'fonts/**';
    gulp.src([path+'*.png', path+'*.jpg'])
    .pipe(gulp.dest(releasePath+'fonts'));

    gulp.src(destPath+'index.html')
    .pipe(replace(/<link rel="stylesheet"[\s\S]*demo.css" \/>/, '<link rel="stylesheet" type="text/css" href="css/remobile.css" />'))
    .pipe(replace(/<script[\s\S]*script>/, '<script type="text/javascript" src="js/remobile.js"></script>'))
    .pipe(gulp.dest(releasePath));
});
gulp.task('run', ['watch', 'serve']);
gulp.task('clean', function() {
    del([destPath]);
});
