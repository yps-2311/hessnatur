module.exports = function(grunt) {

	grunt.registerTask('default', [ 'jsdoc' ]);
	
	grunt.initConfig({
		jsdoc : {
			dist : {
				src : ['../src/**/*.js', 'README.md'],
				options : {
					destination : 'build'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-jsdoc');
};