module.exports = {

    build_dir: 'build',
    compile_dir: 'dist',

    meta: {
        title: 'SVGs Are a Thing Now',
        description: 'A quick tour of the Whys &amp; Hows of using SVG in front-end development.',
        viewport: 'width=device-width, initial-scale=1, user-scalable=no, minimal-ui'
    },

    app_files: {
        main: ['slide.js'],
        js: ['src/js/**/*.js'],
        html: ['src/*.html', 'src/slides/*.html'],
        styles: ['src/sass/**/*']
    },

    vendor_files: {
        js: [
            'vendor/modernizr/modernizr.js',
            'bower_components/zepto/zepto.js',
            'vendor/prism/prism.js'
        ],
        css: [
            'bower_components/normalize.css/normalize.css',
            'vendor/prism/prism.css',
        ]
    }
};
