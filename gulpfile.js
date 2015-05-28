var gulp = require('gulp')
var browserify = require('browserify')
var nodemon = require('gulp-nodemon')

gulp.task('nodemon', function() {
  nodemon({
    script: 'index.js',
  })
})

