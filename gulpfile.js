// Use scripts

var gulp                = require('gulp'),
    watch               = require('gulp-watch'),
    prefixer            = require('gulp-autoprefixer'),
    uglify              = require('gulp-uglify'),
    cssmin              = require('gulp-cssmin'),
    sass                = require('gulp-sass'),
    rigger              = require('gulp-rigger'),
    imagemin            = require('gulp-imagemin'),
    pngquant            = require('imagemin-pngquant'),
    jade                = require('gulp-jade'),
    connect             = require('gulp-connect'),
    filter              = require('gulp-filter'),
    sprite              = require('gulp.spritesmith'),
    colors              = require('colors');


var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        sprite: 'assets/sprite/compile/',
        jsVendor: 'build/js/vendor/',
        jsVendor1: 'assets/js/vendor/',
        cssVendor: 'assets/style/import/'
    },
    src: { //Пути откуда брать исходники
        html: 'assets/html/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'assets/js/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: './assets/style/style.scss',
        img: 'assets/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'assets/fonts/**/*.*',
        jade: 'assets/jade/*.jade',
        sprite: 'assets/sprite/img/*.png'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'assets/html/**/*.html',
        js: 'assets/js/**/*.js',
        style: 'assets/style/**/*.scss',
        img: 'assets/img/**/*.*',
        jade: 'assets/jade/**/*.jade',
        fonts: 'assets/fonts/**/*.*'
    },
    compile: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'compile/',
        js: 'compile/js/',
        css: 'compile/css/',
        img: 'compile/img/',
        fonts: 'compile/fonts/',
        jsVendor: 'compile/js/vendor/',
    },
    clean: './build'
};

var server = {
    host: 'localhost',
    port: '8080',
    root: 'build'
};

gulp.task('html:build', function () {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(rigger()) //Прогоним через rigger
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(connect.reload()); //И перезагрузим наш сервер для обновлений
});

gulp.task('jade:build', function () {
    gulp.src(path.src.jade) //Выберем файлы по нужному пути
        .pipe(jade({
            pretty: true
        })).on('error', log)
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(connect.reload()); //И перезагрузим наш сервер для обновлений
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(rigger()).on('error', log) //Прогоним через rigger
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(connect.reload()); //И перезагрузим сервер
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sass()).on('error', log) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(connect.reload());
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(connect.reload());
});

gulp.task('sprite:build', function () {
    gulp.src(path.src.sprite)
        .pipe(sprite({ 
            imgName: 'sprite.png',
            cssName: 'sprite.css',
            algorithm: 'binary-tree',
            //algorithm: 'left-right',
            padding: 5,
            cssOpts: {
              cssClass: function (item) {
                return '.' + item.name;
              }}
        }))
        .pipe(gulp.dest(path.build.sprite));
});


gulp.task('jsVendor:build', function () {
    var jsFilter = filter('**/*.js'),
        cssFilter = filter('**/*.css');

    gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(uglify()).on('error', log)
        .pipe(gulp.dest(path.build.jsVendor));

    gulp.src(mainBowerFiles())
        .pipe(jsFilter)
        .pipe(uglify()).on('error', log)
        .pipe(gulp.dest(path.build.jsVendor1));
        
    gulp.src(mainBowerFiles())    
        .pipe(cssFilter)
        .pipe(cssmin()).on('error', log)
        .pipe(gulp.dest(path.build.cssVendor))
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
    'html:build',
    'jade:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.jade], function(event, cb) {
        gulp.start('jade:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});

gulp.task('webserver', function() {
    connect.server({
        host: server.host,
        port: server.port,
        root: server.root,
        livereload: true
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);

gulp.task('jsmin', function() {
    gulp.src('bower_components/fancybox3/jquery.fancybox.js')
    .pipe(uglify()).on('error', log)
    .pipe(gulp.dest(path.build.jsVendor))
    .pipe(gulp.dest(path.build.jsVendor1));
});


/* ----------- Prodaction ------------ */
gulp.task('compile', ['prodaction']);
gulp.task('prodaction', [
  'html:compile',
  'jade:compile',
  'js:compile',
  'style:compile',
  'fonts:compile',
  'image:compile'
]);

gulp.task('html:compile', function () {
  gulp.src(path.src.html) //Выберем файлы по нужному пути
    .pipe(rigger()) //Прогоним через rigger
    .pipe(gulp.dest(path.compile.html)); //Выплюнем их в папку compile
});

gulp.task('jade:compile', function () {
  gulp.src(path.src.jade) //Выберем файлы по нужному пути
    .pipe(jade({
        pretty: true
    })).on('error', log)
    .pipe(gulp.dest(path.compile.html)); //Выплюнем их в папку compile
});

gulp.task('js:compile', function () {
    gulp.src(path.src.js) //Найдем наш main файл
      .pipe(rigger()).on('error', log) //Прогоним через rigger
      .pipe(uglify()).on('error', log) //Сожмем наш js
      .pipe(gulp.dest(path.compile.js)); //Выплюнем готовый файл в compile
});

gulp.task('style:compile', function () {
  gulp.src(path.src.style) //Выберем наш main.scss
    .pipe(sass()).on('error', log) //Скомпилируем
    .pipe(prefixer()) //Добавим вендорные префиксы
    .pipe(cssmin()) //Сожмем
    .pipe(gulp.dest(path.compile.css)); //И в compile
});

gulp.task('image:compile', function () {
  gulp.src(path.src.img) //Выберем наши картинки
    .pipe(imagemin({ //Сожмем их
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.compile.img)); //И бросим в compile
});

gulp.task('fonts:compile', function() {
  gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.compile.fonts));
});


function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------".bold.red,
        ("[" + error.name + " in " + error.plugin + "]").white.bold.italic,
        error.message.green,
        "----------ERROR MESSAGE END----------".bold.red,
        ''
    ].join('\n'));
    this.end();
}