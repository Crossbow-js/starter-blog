var gulp         = require("gulp");
var crossbow     = require("crossbow");
var browserSync  = require("browser-sync");
var sass         = require("gulp-sass");
var rimraf       = require("rimraf");
var htmlInjector = require("bs-html-injector");
var outdir       = "_site";
var norma        = require.resolve("normalize.css/normalize.css");

var site         = crossbow.builder({
    config: {
        base: "_src",
        defaultLayout: "default.html",
        prettyUrls: true
    },
    data: {
        site: "file:config.yml"
    }
});

/**
 * Start BrowserSync
 */
gulp.task("serve", function () {
    browserSync.use(htmlInjector);
    browserSync({
        open: false,
        logLevel: "silent",
        server: {
            baseDir: outdir,
            routes: {
                "/img": "./img",
                "/css": "./css"
            }
        }
    }, function (err, bs) {
        site.logger.info("View your website at: {yellow:%s}", bs.getOptionIn(["urls", "local"]));
        site.logger.info("View your website at: {yellow:%s}", bs.getOptionIn(["urls", "external"]));
    });
});

function buildSite() {
    return gulp.src([
        "_src/index.html",
        "_src/_posts/**"
    ])
        .pipe(crossbow.stream({builder: site}))
        .pipe(gulp.dest("_site"));
}

/**
 * Default task
 */
gulp.task("crossbow", function () {
    buildSite();
});

gulp.task("watch", function () {
    gulp.watch(["scss/**"], ["sass"]);
    gulp.watch(["_src/**"]).on("change", function (file) {
        if (file.type === "deleted" || file.type === "added" || file.type === "renamed") {
            buildSite().on("end", function () {
                browserSync.reload();
            });
        } else {
            gulp.src(file.path)
                .pipe(crossbow.stream({builder: site}))
                .pipe(gulp.dest("_site"))
                .on("end", function () {
                    browserSync.notify("<span style='color: magenta'>Crossbow:</span> Injecting HTML");
                    htmlInjector();
                });
        }
    });
});

gulp.task("sass", function () {
    return gulp.src("scss/main.scss")
        .pipe(sass())
        .pipe(require("through2").obj(function (file, enc, next) {
            var modded = file.contents.toString().replace(/@import url\(\.\.\/(.+?)\);/g, function () {
                var filepath = require("path").resolve((arguments[1]));
                if (require("fs").existsSync(filepath)) {
                    return require("fs").readFileSync(filepath);
                }
            });
            file.contents = new Buffer(modded);
            this.push(file);
            next();
        }))
        .pipe(gulp.dest("./css"))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task("clean", function (done) {
    rimraf.sync("./_site");
    done();
});

gulp.task("default", ["clean", "crossbow", "serve", "watch"]);