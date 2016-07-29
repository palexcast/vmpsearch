var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var bower = require( 'bower' );
var concat = require( 'gulp-concat' );
var sass = require( 'gulp-sass' );
var minifyCss = require( 'gulp-minify-css' );
var rename = require( 'gulp-rename' );
var sh = require( 'shelljs' );
var minify = require( 'gulp-minify' );
var browserSync = require( 'browser-sync' ).create();
var argv = require( 'yargs' ).argv;
var historyApiFallback = require( 'connect-history-api-fallback' );
var uglify = require( 'gulp-uglify' );

var paths = {
  sass: [ './static/scss/**/*.scss' ]
};

gulp.task( 'default', [ 'scripts', 'compress' ] );


gulp.task( 'compileSass', [ 'sass', 'hashCss' ] );

/**
 * Sass - Compiles main.scss to regular CSS and writes it to main.css
 * https://www.npmjs.com/package/gulp-sass
 */
gulp.task( 'sass', function () {
  return gulp.src( './static/scss/main.scss' )
    .pipe( sass( {
      outputStyle: 'compressed'
    } ).on( 'error', sass.logError ) )
    .pipe( rename( 'fjellkam.min.css' ) )
    .pipe( gulp.dest( './static/dist/' ) );

} );


/**
 * Sass - Watches all SASS/SCSS files.
 * Compiles main.scss to regular CSS whenever a file changes,
 * and writes it to main.min.css
 * https://www.npmjs.com/package/gulp-sass
 */
gulp.task( 'sass:watch', function () {
  gulp.watch( './static/scss/**/*.scss', [ 'compileSass' ] );
} );

gulp.task( 'scripts', [ 'concat', 'compress' ] );


/**
 * Concatinates all js-files, and creates or replaces the file avexis.js in the dist folder.
 */
gulp.task( 'concat', function () {
  return gulp.src( [
      './bower_components/angular/angular.min.js',
      './bower_components/angular-route/angular-route.min.js',
      './bower_components/angular-translate/angular-translate.min.js',
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/bootstrap-sass/assets/javascripts/bootstrap.min.js',
      './static/lib/terrillthompson/jquery-accessibleMegaMenu.js',
      './static/lib/google-side-nav/detabinator.js',
      './static/lib/google-side-nav/side-nav.js',
      './static/js/**/*.js',
    ] )
    .pipe( concat( 'fjellkam.js' ) )
    .pipe( gulp.dest( './static/dist/' ) );
} );


/**
 * Compresses all js files in the dist folder,
 * and creates a new file that's called filename.min.js for each js file
 */
gulp.task( 'compress', function () {
  gulp.src( './static/dist/fjellkam.js' )
    .pipe( minify( {
      ext: {
        src: '.js',
        min: '.min.js'
      }
    } ) )
    .pipe( gulp.dest( './static/dist' ) );
} );



gulp.task( 'watch', function () {
  gulp.watch( paths.sass, [ 'sass' ] );
} );

gulp.task( 'install', [ 'git-check' ], function () {
  return bower.commands.install()
    .on( 'log', function ( data ) {
      gutil.log( 'bower', gutil.colors.cyan( data.id ), data.message );
    } );
} );

gulp.task( 'git-check', function ( done ) {
  if ( !sh.which( 'git' ) ) {
    console.log(
      '  ' + gutil.colors.red( 'Git is not installed.' ),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan( 'http://git-scm.com/downloads' ) + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan( 'gulp install' ) + '\' again.'
    );
    process.exit( 1 );
  }
  done();
} );


// Static Server + watching scss/html files
gulp.task( 'serve', function () {

  browserSync.instance = browserSync.init( {
    startPath: '/index.html',
    server: {
      baseDir: "./",
      middleware: [
        historyApiFallback()
      ]
    },
    port: 8080,
    ui: {
      port: 8081
    }
  } );

  gutil.log( gutil.colors.red( '\n\n•••••••••••••••••••••••••••••••••••••\n' ), gutil.colors.yellow( '  SERVER RUNNING...' ), gutil.colors.red( '\n•••••••••••••••••••••••••••••••••••••\n\n' ) );

  // === WATCH
  if ( argv.sass || argv.s ) {
    gulp.watch( paths.sass, [ 'sass' ] );
    gutil.log( gutil.colors.yellow( 'Sass autocompiling is turned on. Whenever a SCSS-file is saved, it will be compiled.' ) );
  } else {
    gutil.log( gutil.colors.yellow( 'Sass autocompiling is turned off. To turn on, run gulp serve with argument \"-s\" or \"--sass\".' ) );
  }

  if ( argv.livereload || argv.l ) {
    gulp.watch( [ "static/**/*", "index.html" ] ).on( 'change', browserSync.reload );
    gutil.log( gutil.colors.yellow( 'Browsersync reload is turned on. The page will instantly reload whenever a file changes.' ) );
  } else {
    gutil.log( gutil.colors.yellow( 'Browsersync reload is turned off. To turn it on, run gulp serve with argument \"-l\" or \"--livereload\".' ) );
  }
  // gulp.watch(paths.js, ['compressJs', browserSync.reload]);
  // gulp.watch(paths.jade[1], ['jade-index', browserSync.reload]);
  // gulp.watch(paths.jade[0], ['jade-templates', browserSync.reload]);
} );
