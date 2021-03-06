import gulp from 'gulp';
import babel from 'gulp-babel';
import exit from 'gulp-exit';
import injectModules from 'gulp-inject-modules';
import istanbul from 'gulp-istanbul';
import jasmine from 'gulp-jasmine';
import nodemon from 'gulp-nodemon';

gulp.task('compile', ['compile:test'], () => gulp.src('server/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist')));

gulp.task('compile:test', () => gulp.src('__tests__/server/**/*.js')
  .pipe(babel())
  .pipe(gulp.dest('dist/__tests__')));

gulp.task('test', ['compile'], (done) => {
  gulp.src(['dist/controllers/*.js', 'dist/helpers/*.js', 'dist/middleware/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('./__tests__/**/*.js')
        .pipe(babel())
        .pipe(injectModules())
        .pipe(jasmine({
          verbose: true
        }))
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }))
        .on('end', done)
        .pipe(exit());
    });
});

gulp.task('watch', ['compile'], () => {
  nodemon({
    script: 'dist/server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' },
    ignore: ['README.md', 'node_modules/**', '.DS_Store', 'LICENSE', '.*.yml'],
    tasks: ['compile'],
    watch: ['server']
  });
});
