module.exports = function (grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    keepalive: true
                }
            }
        },
        jshint: {
            default: {
                jshintrc: '.jshintrc',
                src: ['js/app/**/*.js', 'js/*.js']
            }
        },
        recess: {
            dist: {
                src: ['less/main.less'],
                options: {
                    strictPropertyOrder: false
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-recess');
};