module.exports = function(grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [
                'Gruntfile.js',
                'enums/**/*.js',
                'utils/**/*.js',
                'components/**/*.js',
                'repositories/**/*.js',
                'services/**/*.js',
                'test/**/*.js',
                'web/**/*.js'
            ],
            options: {
                ignores: ['web/public/javascripts/**/*-autogenerated.js']
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'Tests'
            },
            all: ['test/']
        },
        browserify: {
            'web/public/javascripts/bundle-autogenerated.js': ['web/public/javascripts/**/*.js']
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['test']
        }
    });

    grunt.registerTask('test', ['jshint', 'jasmine_node']);
};
