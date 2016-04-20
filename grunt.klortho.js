var serveStatic = require('serve-static');

module.exports = function(grunt, gcc) {
  var app = gcc.app;
  var bowerComponents = gcc.bowerComponents;
  var tmp = gcc.tmp;
  return {
    connect: {
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              serveStatic(tmp()),
              connect().use(
                '/bower_components',
                serveStatic(bowerComponents())
              ),
              serveStatic(app())
            ];
          },
        },
      },
    },
  };
};