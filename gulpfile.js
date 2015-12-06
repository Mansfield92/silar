/* BASIC CONFIG (better to store it in different file */
var $input_dir = './web/sass/';
var $watch = '*';
var $compile = 'main.sass';
var $output_dir = './web/css';

/* REQUIRED LIBS */
var gulp = require('gulp');
var	sass = require('gulp-ruby-sass');
var	rename = require('gulp-rename');

/* BASIC SASS TASK*/
gulp.task('normal', function(){
    return sass($input_dir+$compile)
        .pipe(gulp.dest($output_dir));
});

/* COMPRESSED SASS */
gulp.task('compressed', function(){
    return sass($input_dir+$compile,{style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest($output_dir))
});

/* LOGIN CSS */
gulp.task('login', function(){
    return sass($input_dir+"login.sass",{style: 'compressed'})
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest($output_dir))
});

/* ACTIVE WATCHERS CALLED AS DEFAULT  */
gulp.task('watchers',function(){
    //gulp.watch($input_dir+$watch, ['normal']);
    gulp.watch($input_dir+$watch, ['compressed','login']);
});

/* TASK INITIALIZED AT START*/
//gulp.task('default',['watchers','normal'], function() {});
gulp.task('default',['watchers','compressed'], function() {});


// commands
// sass web/sass/__bootstrap.sass web/css/bootstrap.css
// sass web/sass/__bootstrap-theme.sass web/css/bootstrap-theme.css