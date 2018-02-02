var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    htmlmin = require('gulp-html-minifier'),
    rename = require('gulp-rename'),
    clean = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    jasmine = require('gulp-jasmine'),
    del = require('del'),
    gulpUtil = require('gulp-util');




/********************CSS*************************/
gulp.task('css_task', function(){
     gulp.src('src/css/*.css')
        .pipe(minifycss())
       // .pipe(rev())
       // .pipe(gulp.dest('css'))
       // .pipe(rev.manifest())
        .pipe(gulp.dest('css'))
   //     .pipe(notify('css_task min complete !'));
});
/********************JS*************************/
gulp.task('js_activity', function(){
     gulp.src('src/js/tmpl/activity/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/activity'))
        .pipe(notify('js_activity  min complete !'));
});

gulp.task('js_index', function(){
     gulp.src('src/js/tmpl/index/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/index'))
        .pipe(notify('js_index  min complete !'));
});

gulp.task('js_login', function(){
     gulp.src('src/js/tmpl/login/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/login'))
        .pipe(notify('js_login  min complete !'));
});

gulp.task('js_logistics', function(){
     gulp.src('src/js/tmpl/logistics/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/logistics'))
        .pipe(notify('js_logistics  min complete !'));
});

gulp.task('js_member', function(){
     gulp.src('src/js/tmpl/member/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/member'))
        .pipe(notify('js_member  min complete !'));
});

gulp.task('js_order', function(){
     gulp.src('src/js/tmpl/order/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/order'))
        .pipe(notify('js_order  min complete !'));
});

gulp.task('js_packet', function(){
     gulp.src('src/js/tmpl/packet/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/packet'))
        .pipe(notify('js_packet  min complete !'));
});

gulp.task('js_activity', function(){
     gulp.src('src/js/tmpl/activity/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/activity'))
        .pipe(notify('js_activity  min complete !'));
});


gulp.task('js_refund', function(){
     gulp.src('src/js/tmpl/refund/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/refund'))
        .pipe(notify('js_refund  min complete !'));
});

gulp.task('js_shopping', function(){
     gulp.src('src/js/tmpl/shopping/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/shopping'))
        .pipe(notify('js_shopping  min complete !'));
});

gulp.task('js_store', function(){
     gulp.src('src/js/tmpl/store/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/store'))
        .pipe(notify('js_store  min complete !'));
});

gulp.task('js_store_joinin', function(){
     gulp.src('src/js/tmpl/store_joinin/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/store_joinin'))
        .pipe(notify('js_store_joinin  min complete !'));
});

gulp.task('js_weidian', function(){
     gulp.src('src/js/tmpl/weidian/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify().on('error', gulpUtil.log))
        .pipe(gulp.dest('js/tmpl/weidian'))
        .pipe(notify('js_weidian  min complete !'));
});

/*****************************images**************************/
gulp.task('img_task', function() {
  return gulp.src('src/images/**')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest('images'))
    .pipe(notify('images min complete!'));
});

/**************************HTML****************************/

//gulp.task('html_tmpl_task', function(){
//	var opts = {
//		collapseWhitespace: true,
//		ignoreCustomFragments:false
//	};
//        gulp.src('src/tmpl/*/*.html')
 //       .pipe(htmlmin(opts))
///        .pipe(gulp.dest('tmpl'))
 //       .pipe(notify('html_tmpl_task  min complete !'));
//});
//修改引用路径
//gulp.task('rev',function(){
//	gulp.src(['css/*.json','src/tmpl/*/*.html'])
//	.pipe(revCollector())
//	.pipe(gulp.dest('tmpl'));
//})
//watch
gulp.task('watch',function(){
	gulp.watch('src/css/*.css',['css_task']),
	gulp.watch('src/js/tmpl/activity/*.js',['js_activity']),
	gulp.watch('src/js/tmpl/index/*.js',['js_index']),
	gulp.watch('src/js/tmpl/login/*.js',['js_login']),
	gulp.watch('src/js/tmpl/logistics/*.js',['js_logistics']),
	gulp.watch('src/js/tmpl/member/*.js',['js_member']),
	gulp.watch('src/js/tmpl/order/*.js',['js_order']),
	gulp.watch('src/js/tmpl/packet/*.js',['js_packet']),
	gulp.watch('src/js/tmpl/refund/*.js',['js_refund']),
	gulp.watch('src/js/tmpl/shopping/*.js',['js_shopping']),
	gulp.watch('src/js/tmpl/store/*.js',['js_store']),
	gulp.watch('src/js/tmpl/store_joinin/*.js',['js_store_joinin']),
	gulp.watch('src/js/tmpl/weidian/*.js',['js_weidian']),
	gulp.watch('src/images/**',['img_task'])
});

gulp.task('clean', function(){
	  gulp.src(['css/*.css','js/tmpl/activity/*.js','js/tmpl/index/*.js','js/tmpl/login/*.js','js/tmpl/logistics/*.js','js/tmpl/member/*.js','js/tmpl/order/*.js','js/tmpl/packet/*.js','js/tmpl/refund/*.js','js/tmpl/shopping/*.js','js/tmpl/store/*.js','js/tmpl/store_joinin/*.js','js/tmpl/weidian/*.js'], { read:false })
	    .pipe(clean());
	});
/**
 * 默认执行
 */

gulp.task('default', ['clean'],function() {
	gulp.start(['css_task','js_activity','js_index','js_login','js_logistics','js_member','js_order','js_packet','js_refund','js_shopping','js_store','js_store_joinin','js_weidian']);
});

